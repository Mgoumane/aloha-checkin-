import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { pageApp } from 'src/environments/path-app';
import { configApp } from 'src/environments/config-app';
import { ScanDatabaseService } from 'src/app/services/scan-database.service';
import { FileSystemeService } from 'src/app/services/file-systeme.service';



@Component({
	selector: 'app-statistique',
	templateUrl: './statistique.page.html',
	styleUrls: ['./statistique.page.scss'],
})

export class StatistiquePage implements OnInit {

	title!:string;
	nbScans! : any;
	nbContacts : any;
	nbScansValides : any;

	constructor(
		private router: Router,
		private scanDatabaseService: ScanDatabaseService,
		private fileSystemeService: FileSystemeService

	) { }

	async ngOnInit() {
		this.title = "Statistiques";
		this.getStatistiques();
	}

	goToScan(){
		this.router.navigate([pageApp.home]);
	}

	async getStatistiques(){

		let dataBaseScans = await this.scanDatabaseService.getScans();
		console.log(dataBaseScans)
		let nbContacts = await this.scanDatabaseService.getNbContacts();
		let scansValides = await this.scanDatabaseService.getScansValides();

		// Récupération du nombre des scans 
			this.nbScans = dataBaseScans.length;

		// Récupération du nombe de scans uniques 
			this.nbContacts = nbContacts

		// Récupération des scans valides 
			this.nbScansValides = scansValides.length

	}

	
async deleteStorage(){
		let confirmation = "aloha-checkin";
		let person = prompt(`Pour supprimer la base de données locale , veuillez saisir : ${confirmation}`)

		if (person === confirmation) {
			await this.scanDatabaseService.deleteAll();
			alert('Base de données locale supprimée ')
		} else {
			alert('Erreur détecté , base de donnée non supprimé')
		}
	}
	async deleteFileSysteme(){

		let confirmation = "aloha-checkin";
		let person = prompt(`Pour supprimer le fichier de sauvegarde , veuillez saisir : ${confirmation}`)

		if (person === confirmation) {
			await this.fileSystemeService.deleteFile( configApp.folderName, configApp.fileName )
			alert('Fichier de sauvegarde supprimé ')
		} else {
			alert('Erreur détecté, fichier non supprimé ')
		}
	}

	
	

}
