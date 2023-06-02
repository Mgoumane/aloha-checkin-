import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { Device } from '@capacitor/device';
import { configApp } from 'src/environments/config-app';
import { FunctionsService } from './functions.service';

@Injectable({
	providedIn: 'root'
})

export class AlohaCommunicationService {

	private deviceDatas: any;

	constructor(
		private http: HttpClient,
		private functionsService: FunctionsService
	) {}

	/**
	 * Fonction permettant d'extraire les données du mobile
	 */
	private async getDeviceDatas(): Promise<Object> {
		// Appel des fonctions d'information sur le mobile
			let deviceGetInfo = await Device.getInfo();
			let devicGetId = await Device.getId();
			let devicGetLangue = await Device.getLanguageCode();

		// Préparation des données de retour
			return {
				'uuid'		: devicGetId.uuid, 
				'osName'	: deviceGetInfo.operatingSystem,
				'osVersion'	: deviceGetInfo.osVersion,
				'langue'	: devicGetLangue.value,
			};
	}

	/**
	 * Fonction pemrettant de préparer les éléments pour les appels HTTP pui d'effectuer l'appel
	 */
	private async send( requestDatas: object ) : Promise<any> {
		// Vérification de la présence des données mobiles pour limiter les appels
			if( this.deviceDatas == undefined ){
				await this.getDeviceDatas().then( ( result ) => { this.deviceDatas = result; } );
			}

		// Exécution de l'appel HTTP
			let httpResults = await lastValueFrom( this.request( requestDatas ) );

		// Réponse de la fonction
			return httpResults;
	}

	/**
	 * Fonction permettant d'interroger le serveur distant
	 */
	private request( requestDatas: any ): Observable<Object> {
		// Url d'appel de l'API
			let url = configApp.api_url;

		// Donnée du BODY
			// Vérification de la présence de l'action
				if( typeof requestDatas.action != 'string' ){
					return of({ 'result': '-1001', 'message': 'Paramétre "action" manquant dans la requête' });
				}

			// Extraction de l'action
				let actionValue: String = requestDatas.action;

			// Suppression de la valeur du tableau
				delete requestDatas.action;

			// Prépration des données
				let body = JSON.stringify({
					'header'			: {
						'api-key'			: configApp.api_key,
						'app-version'		: configApp.app_version,
						'app-date'			: configApp.app_date,
						'app-langue'		: this.deviceDatas.langue,
						'phone-date'		: this.functionsService.generePhpDateUtc(),
						'phone-uuid'		: this.deviceDatas.uuid,
						'phone-os-name'		: this.deviceDatas.osName,
						'phone-os-version'	: this.deviceDatas.osVersion,
						'action'			: actionValue,
					},
					'data'				: requestDatas
				});

		// Lancement de l'appel
			let sendResult = this.http.post<object>(url, body).pipe(
				map( ( response:any ) => {
					// Vérification de la réponse du flux
						if( typeof response.header.result != 'number' || !( response.header.result > 0 ) ){
							return { 'result': '-1002', 'message': 'Erreur durant la génération de la réponse serveur distant' };
						}

					// Détermiantion du tableau de donnée
						var responseDatas = {};
						if( typeof response.data == 'object' ){
							responseDatas = response.data;
						}

					// Renvoi des données
						return { 'result' : response.header.result, 'message' : response.header.message, 'data': responseDatas };
				}),

				catchError( ( error ) => {
					console.log(error);
					 return of({ 'result': '-1003', 'message': 'Erreur durant l\'appel du serveur distant' });
				})
			);

		// Réponse de la fonction
			return sendResult;
	}

	/**
	 * Fonction de "ping"
	 */
	ping() : Promise<any> {
		// Formatage des données envoyés
			const requestDatas = { 'action': 'ping' };

		// Envoi au serveur
			return this.send( requestDatas );
	}

	/**
	 * Fonction de "login"
	 */
	actionLogin( sessionCodeValue: string ) : Promise<any> {
		// Formatage des données envoyés
			const requestDatas = { 'action': 'login','session-code': sessionCodeValue };

		// Envoi au serveur
			return this.send( requestDatas );
	}

	/**
	 * Fonction de "logout"
	 */
	actionLogout() : Promise<any> {
		// Formatage des données envoyés
			const requestDatas = { 'action': 'logout' };

		// Envoi au serveur
			return this.send( requestDatas );
	}

	/**
	 * Fonction de "getInfo"
	 */
	getInfo() : Promise<any> {
		// Formatage des données envoyés
			const requestDatas = { 'action': 'getInfo'};

		// Envoi au serveur
			return this.send( requestDatas );
	}

	/**
	 * Fonction de "synchroScanInstantanee"
	 */
	synchroScanInstantanee( scan: object ) : Promise<any> {
		// Formatage des données envoyées
			const requestDatas = { 'action' : 'synchroScanInstantanee','scan' : scan };

		// Envoi au serveur
			return this.send( requestDatas )
	}

	/**
	 * Fonction de "synchroScanRattrapage"
	 */
	synchroScanRattrapage( scan: object ) : Promise<any> {
		// Formatage des données envoyées
			const requestDatas = { 'action' : 'synchroScanRattrapage','scan' : scan };

		// Envoi au serveur
			return this.send( requestDatas )
	}
}
