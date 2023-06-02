import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { configApp } from "src/environments/config-app";
import { AlohaCommunicationService } from "./aloha-communication.service";

@Injectable({
	providedIn: 'root'
})
  
export class UserService {

	private userInfo: any = null;

	constructor(
		private alohaCommunicationService: AlohaCommunicationService,
		private storageService: StorageService,
	){ }

	/**
	 * Permet d'initialiser les variables local
	 */
	private async init(){
		// Vérification d'un compte déjà présent
			if( this.userInfo !== null ){
				return true;
			}

		// Extraction des données du stockage local
			let userInfoJson = await this.storageService.get( configApp.systeme_user_info, configApp.prefix_systeme );

		// Vérification de présence de précédente donnée
			if( userInfoJson == '' ){
				return false;
			}

		// Initialisation de la variable de contenu
			let userInfoObject: any;

		// Décompilation des données
			try {
				userInfoObject = await JSON.parse( userInfoJson );
			} catch( e ){ }

		// Vérification de la présence des clés de "code" et "security_key" permettant de dialoguer avec le serveur
			if( !( 'code' in userInfoObject ) || userInfoObject.code == '' || !( 'security_key' in userInfoObject ) || userInfoObject.security_key == '' ){
				return false;
			}

		// Mise à jour de la variable local
			this.userInfo = userInfoObject;
			
		// Réponse de la fonction
			return true;
	}

	/**
	 * Pemret de savoir si un utilisateur est connecté ou pas
	 */
    public async isLogged(){
		// Appel de la focntion d'init
			await this.init();

		// Vérification de la présence d'un contact
			if( this.userInfo === null ){
				return false;
			}

		// Réponse de la fonction
			return true;
	}

	/**
	 * Permet de faire une connexion par identifiant
	 */
	// public async loginByIdentifiant( login: string, password: string ): Promise<any> {
	// 	// Interrogation du serveur
	// 		let reponse = await this.alohaCommunicationService.loginByIdentifiant( login, password ).then( async response => {
	// 			// Vérification de la réponse de l'API
	// 				if( !( response.result > 0 ) ){
	// 					return { 'result' : configApp.erreur_show_message, 'message' : 'L\'application n\'a pas réussi à récupérer les informations de votre compte.' };
	// 				}

	// 			// Vérification de l'identification
	// 				if( !( response.data.is_valide > 0 ) ){
	// 					return { 'result' : configApp.erreur_show_message, 'message' : 'Identifiant ou mot de passe incorret.' };
	// 				}

	// 			// Initialisation de la variable de contenu
	// 				let contactJson = '';

	// 				// Permet de sérialiser les données de la table
	// 					try {
	// 						contactJson = JSON.stringify( response.data.contact );
	// 					} catch( e ){
	// 						return { 'result': -10, 'message': 'Erreur durant la sérialisation de la chaine de contact' };
	// 					}
			
	// 				// Mise dans le stockage
	// 					try {
	// 						await this.storageService.set( configApp.systeme_user_info, contactJson, configApp.prefix_systeme );
	// 					} catch( e ){
	// 						return { 'result': -11, 'message': 'Erreur durant l\'enregistrement  de la chaine de contact dans le stockage local' };
	// 					}

	// 				// Mise à jour de la variable local
	// 					this.userInfo = response.data.contact;

	// 			// Réponse de la fonction
	// 				return { 'result' : 1 };
	// 		});

	// 	// Réponse de la fonction
	// 		return reponse;
	// }

	/**
	 * Permet de faire une connexion par le code badge
	 */
	public async loginByBadge( codeBadge: string ){

	}

	/**
	 * Pemret de se deconnecter
	 */
	public async logout(){
		// Suppression dans le stockage
			try {
				await this.storageService.remove( configApp.systeme_user_info, configApp.prefix_systeme );
			} catch( e ){
				return { 'result': -10, 'message': 'Erreur durant la suppression des données du contact dans le stockage local' };
			}

		// Mise à jour de la variable local
			this.userInfo = null;

		// Réponse de la fonction
			return { 'result' : 1 };
	}

	/**
	 * Pemret d'extraire les information sur le contact
	 */
    public async getUserDatas(){
		// Appel de la focntion d'init
			await this.init();

		// Vérification 
			if( this.userInfo === null ){
				return false;
			}

		// Réponse de la fonction
			return this.userInfo;
	}

}