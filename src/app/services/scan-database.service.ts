import { Injectable, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';
import { configApp } from 'src/environments/config-app';
import { FileSystemeService } from './file-systeme.service';


@Injectable({
	providedIn: 'root'
})

export class ScanDatabaseService{

	private listeDesScans: any;
 
	constructor(
		private databaseService: DatabaseService,

	) { }

	/**
	 * Export du tableau de scans
	 */
	private async exportScans(){
		// Initialisation du stockage
			const response = await this.databaseService.exportTable(configApp.database_scan);

		// Intégration du stockage dans une variable local
			this.listeDesScans = response.data;
	}


	/**
	 * Récupération des scans
	 */
	public async getScans(){

		//Export des scans
		await this.exportScans()

		//Réponse de la fonction
		return this.listeDesScans;
	}

	/**
	 * Fonction qui permet de récuperer le nombre de contacts
	 * 
	 */
	public async getNbContacts(){

		//Export des scans
			await this.exportScans()
			let scans = this.listeDesScans

		// Récupération liste de codes 
			let listeCodes = [];
			for (let i = 0; i < scans.length; i++) {

				let unCodeUnique = scans[i].code;

				listeCodes.push(unCodeUnique);
			}
		
		// Récupération de liste de codes uniques
			let listeCodeScansUniques = Array.from(new Set(listeCodes))

		// Récupération des contact
			let nombreDeContact = listeCodeScansUniques.length;
		
		// Réponse de la fonction
			return nombreDeContact
		
	}

	/**
	 * Fonction qui permet de récuperer les scans valides
	 */
	public async getScansValides(){

		//Export des scans
		await this.exportScans()
		let scans = this.listeDesScans;

		//Récupération des scans valides
		let scansValides = [];
		for (let unScan of scans){
			if (unScan.statut_reponse === configApp.scan_valide ) {
				scansValides.push(unScan)
			}
		}

		// Réponse de la fonction 
		return scansValides;
		
	}

	/**
	 * Fonction qui permet d'ajouter un scan dans le locale storage
	 * 
	 */
	public async createScan( scan: object){

		//Export des scans
		await this.exportScans()
		let scans = this.listeDesScans;

		//Ajout du scan 
		scans.push(scan)

		//Importation des scans
		try {
			await this.databaseService.importTable(configApp.database_scan, scans);	
		} catch (error) {
			return { 'result': 0 , 'message' : error};
		}

		// Réponse de la fonction
		return { 'result': 1 };

	}


	/**
	 * Fonction qui permet de modifier un scan
	 * Elle prend en paramètre l'uuid du scan à modifier et un tableau des cles à modifier
	 */
	public async updateScan( uuid: string , tableau: string ){

		// Export des scans
		await this.exportScans();
		let scans = this.listeDesScans;

		// Récupération du scan à modifier
		let scan: object = {};
		for( let unScan of scans){
			if (unScan.uuid ===  uuid) {
				scan = unScan
			}
		}

		// 
	}


	/**
	 * Fonction qui permet de supprimer tous les scans 
	 */
	public async deleteAll(){
		this.databaseService.deleteTable(configApp.database_scan)
	}


}
