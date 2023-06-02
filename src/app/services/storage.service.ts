import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { configApp } from 'src/environments/config-app';

@Injectable({
	providedIn: 'root'
})

export class StorageService {

	private storageService: Storage;

	constructor(
		private storage: Storage
	){ }

	/**
	 * Instanciation du stockage
	 */
	private async init(){
		// Initialisation du stockage
			const storage = await this.storage.create();

		// Intégration du stockage dans une variable local
			this.storageService = storage;
	}

	/**
	 * Permet de créer ou modifier un élément dans le stockage
	 */
	public async set( key: string, value: any, prefix: string = configApp.prefix_stockage ){
		// Initialisation du stockage si besoin
			await this.init();

		// Création ou modification de l'élément dans le stockage
			await this.storageService?.set( prefix + key, value );
	}

	/**
	 * Permet d'extraire un élément du stockage
	 */
	public async get( key: string, prefix: string = configApp.prefix_stockage ){
		// Initialisation du stockage si besoin
			await this.init();

		// Extraction de l'élément du stockage
			let value = await this.storageService?.get( prefix + key );

		// Correction de la valeur "null"
			if( value == null ){
			value = '';
			}

		// Réponse de la fonction
			return value;
	}

	/**
	 * Permet d'extraire tous les éléments du stockage
	 */
	public async getAll(){
		// Initialisation du stockage si besoin
			await this.init();

		// Extraction des éléments un par et ajout dans un tableau
			let allDatas: Object[] = [];
			this.storageService.forEach( (value, key, index) => {
			allDatas.push({ key : key, value : value, index: index });
			});

		// Réponse de la fonction
			return allDatas;
	}

	/**
	 * Permet d'extraire tous les éléments du stockage
	 */
	public async remove( key: string, prefix: string = configApp.prefix_stockage ){
		// Initialisation du stockage si besoin
			await this.init();

		// Suppression de l'élément ciblé
			await this.storageService?.remove( prefix + key );
	}

	/**
	 * Permet d'extraire tous les éléments du stockage
	 */
	public async removeAll(){
		// Initialisation du stockage si besoin
			await this.init();

		// Suppression de toutes les données
			await this.storageService?.clear();
	}

}