import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { configApp } from 'src/environments/config-app';
import { FunctionsService } from './functions.service';

@Injectable({
	providedIn: 'root'
})

export class DatabaseService {

	constructor(
		private storageService: StorageService,
		private functionsService: FunctionsService
	){ }

	/**
	 * Permet de garder en mémoire les date de synchronisation de chaque table
	 */
	private async updateDateSync( tableName: string ){
		// Gestion de l'extraction des données déjà stockée
			// Initialisation de la variable de contenu
				let contentObject: {[k: string]: any} = {};

			// Extraction des données du stockage local
				let contentJsonOld = await this.storageService.get( configApp.systeme_database_sync_date, configApp.prefix_systeme );

			// Vérification de présence de précédente donnée et déséralisation
				if( contentJsonOld != '' ){
					try {
						contentObject = await JSON.parse( contentJsonOld );
					} catch( e ){ }
				}

		// Intégration de la date
			if( tableName in contentObject ){
				contentObject[ tableName ].date_modification = this.functionsService.generePhpDateUtc();
			} else {
				contentObject[ tableName ] = { 'date_creation': this.functionsService.generePhpDateUtc() };
			}

		// Gestion de la sauvegarde des dates dans le stockage local
			// Initialisation de la variable de contenu
				let contentJsonNew = '';

			// Permet de sérialiser les données de la table
				try {
					contentJsonNew = JSON.stringify( contentObject );
				} catch( e ){
					return { 'result': -11, 'message': 'Erreur durant la sérialisation de la chaine [' + tableName + ']' };
				}

			// Mise dans le stockage
				try {
					await this.storageService.set( configApp.systeme_database_sync_date, contentJsonNew, configApp.prefix_systeme );
				} catch( e ){
					return { 'result': -12, 'message': 'Erreur durant l\'enregistrement  de la chaine dans le stockage local [' + contentJsonNew + ']' };
				}

		// Réponse de la fonction
			return { 'result': 1 };
	}

	/**
	 * Permet de créer ou modifier les données d'une table
	 */
	public async importTable( tableName: string, tableContent: any ): Promise<any> {
		// Vérification de la présence d'une table
			if( tableName == '' ){
				return { 'result': -10, 'message': 'Nom de la table vide' };
			}

		// Initialisation de la variable de contenu
			let contentJson = '';

		// Permet de sérialiser les données de la table
			try {
				contentJson = JSON.stringify( tableContent );
			} catch( e ){
				return { 'result': -11, 'message': 'Erreur durant la sérialisation de la chaine [' + tableContent + ']' };
			}

		// Mise dans le stockage
			try {
				await this.storageService.set( tableName, contentJson, configApp.prefix_database );
			} catch( e ){
				return { 'result': -12, 'message': 'Erreur durant l\'enregistrement  de la chaine dans le stockage local [' + tableContent + ']' };
			}

		// Mise à jour de la date de synchronisation
			await this.updateDateSync( tableName );
		
		// Réponse de la fonction
			return { 'result': 1 };
	}

	/**
	 * Permet d'extraire les données d'une table
	 */
	public async exportTable( tableName: string ): Promise<any> {
		// Vérification de la présence d'une table
			if( tableName == '' ){
				return { 'result': -10, 'message': 'Nom de la table vide' };
			}

		// Extraction de l'élément du stockage
			let contentJson = await this.storageService.get( tableName, configApp.prefix_database );

		// Vérification de la valeur
			if( contentJson == '' ){
				return { 'result': 1, 'data': [] };
			}

		// Initialisation de la variable de contenu
			let contentObject = [];

		// Permet de désérialiser les données de la table
			try {
				contentObject = await JSON.parse( contentJson );
			} catch( e ){
				return { 'result': -11, 'message': 'Erreur durant la désérialisation de la chaine [' + contentJson + ']' };
			}

		 // Réponse de la fonction
			return { 'result': 1, 'data': contentObject };
	}

	/**
	 * Suppression d'une table
	 */
	public async deleteTable( tableName: string ): Promise<any> {
		// Vérification de la présence d'une table
			if( tableName == '' ){
				return { 'result': -10, 'message': 'Nom de la table vide' };
			}

		// Mise dans le stockage
			try {
				await this.storageService.remove( tableName, configApp.prefix_database );
			} catch( e ){
				return { 'result': -11, 'message': 'Erreur durant la suppression de la table [' + tableName + ']' };
			}
	
		// Réponse de la fonction
			return { 'result': 1 };
	}

	/**
	 * Permet de savoir si des données sont présents dans d'une table
	 */
	public async haveDatasInTable( tableName: string ): Promise<Boolean> {
		// Vérification de la présence d'une table
			if( tableName == '' ){
				return false;
			}

		// Extraction de l'élément du stockage
			let contentJson = await this.storageService.get( tableName, configApp.prefix_database );

		// Vérification de la valeur
			if( contentJson == '' ){
				return false;
			}

		// Vérification de la longueur de la chaine
			if( !( contentJson.length > 10 ) ){
				return false;
			}

		// Réponse par défaut
			return true;
	}

}