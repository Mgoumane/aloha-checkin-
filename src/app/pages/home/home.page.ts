import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { configApp } from 'src/environments/config-app';
import { FunctionsService } from 'src/app/services/functions.service';
import { AlohaCommunicationService } from 'src/app/services/aloha-communication.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Device } from '@capacitor/device';
import { DatabaseService } from 'src/app/services/database.service';
import { ScanDatabaseService } from 'src/app/services/scan-database.service';
import { FileSystemeService } from 'src/app/services/file-systeme.service';


@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit{
	title: string;
	lieu: string;
	scanActive: boolean = false;
	isModalOpen: boolean = false;
	formulaireDeSimulation: FormGroup;

	// Message venant du serveur qui sera affiché à l'utilisateur
	serveurMessage: string;

	// l'attribut statutId venant du serveur qui permettra de gerer l'affichage de la HomePage
	// if statutId === 1 le visiteur est authorisé , if statutId < 1 visiteur non autorisé, if statutId === 2 affichage homePage par default
	statutId: number = 2 ;

	constructor(
		private formBuilder: FormBuilder,
		private alohaCommunicationService: AlohaCommunicationService,
		private databaseService: DatabaseService,
		private functionsService: FunctionsService,
		private scanDatabaseService: ScanDatabaseService,
		private fileSystemeService: FileSystemeService

	) { }

	async ngOnInit() {
		// Initialisation du title de la page
		let dbUserInfo = await this.databaseService.exportTable(configApp.systeme_user_info);
		this.title = dbUserInfo.data.salon_name;

		// Initialisation du formBuilder
		this.formulaireDeSimulation = this.formBuilder.group({
			codeSaisie: [''],
		});

		//Extraction du lieu du storage pour l'ajouter au scan 
		let lieuName = await this.databaseService.exportTable(configApp.systeme_user_lieu);
		this.lieu = lieuName.data ;

	}

	// Ouverture du modal pour simuler un qrCode
	modalIsOpen(isOpen: boolean) {
		this.isModalOpen = isOpen;
	}

	// Validation du formulaire de simulation
	async simulateScan() {
		// TODO : Récupérer la valeur saisie
		let codeSaisie = this.formulaireDeSimulation.get('codeSaisie')?.value;

		// Appel de la focntion de scan
		this.dataResult(codeSaisie, 'manuel');
	}

	async checkPermission() {
		return new Promise(async (resolve, reject) => {
			const status = await BarcodeScanner.checkPermission({ force: true });
			if (status.granted) {
				resolve(true);
			} else if (status.denied) {
				BarcodeScanner.openAppSettings();
				resolve(false);
			}
		});
	}

	async startScanner() {

		// A chaque scan la page redevient par default
		this.statutId = 2

		let getDevice = await Device.getInfo();

		if ( getDevice.platform === "web") {

			this.modalIsOpen(true)

		} else {

			const allowed = await this.checkPermission();

			if (allowed) {
				this.scanActive = true;
				BarcodeScanner.hideBackground();

				const result = await BarcodeScanner.startScan({
					targetedFormats: [SupportedFormat.QR_CODE, SupportedFormat.CODE_128]
				});

				if (result.hasContent) {
					this.scanActive = false;

					// fonction prise en compte des données
					this.dataResult(result.content, result.format);

				} else {
					alert('NO DATA FOUND!');
				}
			} else {
				alert('NOT ALLOWED!');
			}
		}
	}

	async dataResult(content: string, format: string) {
		// Initialisation de l'objet scan
			// let scan = {
			// 	'uuid': crypto.randomUUID,
			// 	'code': content,
			// 	'type': format,
			// 	'date-scan': this.functionsService.generePhpDateUtc(),
			// 	'lieu': this.lieu,
			// 	'statut_envoi':configApp.scan_statut_a_envoyer,
			// 	'statut_reponse':configApp.scan_invalide
			// }

			let scan = {
				'uuid': crypto.randomUUID(),
				'code': content,
				'type': format,
				'statut_id': configApp.scan_statut_a_envoyer,
				'date-scan': this.functionsService.generePhpDateUtc(),
				'lieu': this.lieu
			}

		// Mise en DB local
			await this.scanDatabaseService.createScan(scan)

		// Mise en fichier backup 
			let dbScans = await this.scanDatabaseService.getScans();
			let dbScansStringify = JSON.stringify(dbScans)
			this.fileSystemeService.writeFile(dbScansStringify, configApp.folderName, configApp.fileName)

		// Envoi sur le serveur
			let response = await this.alohaCommunicationService.synchroScanInstantanee(scan);

		// Traitement de la réponse 

			if (response.result != 1 ) 
			{
				console.log('scan non traité')

				console.log(response.result)
				var audio = new Audio(`../assets/sounds/son_3.mp3`);
				audio.play()

				await this.functionsService.alertErreur(response.message);
				response = await this.alohaCommunicationService.synchroScanRattrapage(scan);

			} 
			else 
			{
				console.log('scan traité');

				// Affichage au niveau de l'utilisateur :
		
				if (response.data.statut_id > 0) {

					// Update du statut_reponse et du statut_envoi (A METTRE DANS UN SERVICE)
						let exportTable = await this.databaseService.exportTable(configApp.database_scan);
						let tableScan = exportTable.data;
						for( let unScan of tableScan){
							if (unScan.uuid ===  response.data.uuid) {
								unScan.statut_reponse = configApp.scan_valide;
								unScan.statut_envoi = configApp.scan_statut_traite;
							}
						}
						await this.databaseService.importTable(configApp.database_scan, tableScan);

					var audio = new Audio(`../assets/sounds/${response.data.son}.mp3`);
					audio.play()
					this.modalIsOpen(false)
					this.statutId = response.data.statut_id
					this.serveurMessage = response.data.show_message

				} else { 

					// Update seulement du statut envoi
						let exportTable = await this.databaseService.exportTable(configApp.database_scan);
						let tableScan = exportTable.data;
						for( let unScan of tableScan){
							if (unScan.uuid ===  response.data.uuid) {
								unScan.statut_envoi = configApp.scan_statut_traite;
							}
						}
						await this.databaseService.importTable(configApp.database_scan, tableScan);

					var audio = new Audio(`../assets/sounds/${response.data.son}.mp3`);
					audio.play();
					this.modalIsOpen(false)
					this.statutId = response.data.statut_id;
					this.serveurMessage = response.data.show_message
				}
			}
	}

	stopScanner() {
		BarcodeScanner.stopScan();
		this.scanActive = false;
	}

	ionViewWillLeave() {
		BarcodeScanner.stopScan();
		this.scanActive = false;
	}
}
