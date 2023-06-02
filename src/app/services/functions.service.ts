import { Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { AlohaCommunicationService } from "./aloha-communication.service";

@Injectable({
	providedIn: 'root'
})

export class FunctionsService {

	constructor(
		private alertController: AlertController,

	){ }

	/**
	 * Pemret de générer un message
	 */
	public async alertBase( messageValue: string, headerValue: string = '', typeValue: string = '' ){
		// Détermiantion du CSS de l'alert
			// Initialisation du CSS
				let cssClassArray = [ 'modale-alert-custom' ];

			// Ajout de la spécificité de l'alert
				if( typeValue != '' ){
					cssClassArray.push( typeValue );
				}

		// Détermiantion du header à utiliser
				if( headerValue == '' ){
					headerValue = 'Message'
				}

		// Paramétrage du message
			const alert = await this.alertController.create({
				header		: headerValue,
				message		: messageValue,
				buttons		: ['OK'],
				cssClass	: cssClassArray
			});

		// Déclenchement du message
			await alert.present();
	}

	/**
	 * Permet d'afficher un message d'erreur
	 */
	public async alertErreur( messageValue: string, headerValue: string = '' ){
		// Détermiantion du header à utiliser
			if( headerValue == '' ){
				headerValue = 'Erreur'
			}

		// Génération de la modale
			await this.alertBase( messageValue, headerValue, 'modale-alert-erreur' );
	}

	/**
	 * Permet d'afficher un message d'information
	 */
	public async alertInfo( messageValue: string, headerValue: string = '' ){
		// Détermiantion du header à utiliser
			if( headerValue == '' ){
				headerValue = 'Information'
			}

		// Génération de la modale
			await this.alertBase( messageValue, headerValue, 'modale-alert-info' );
	}

	/**
	 * Permet d'afficher un message d'avertissement
	 */
	public async alertWarning( messageValue: string, headerValue: string = '' ){
		// Détermiantion du header à utiliser
			if( headerValue == '' ){
				headerValue = 'Attention'
			}

		// Génération de la modale
			await this.alertBase( messageValue, headerValue, 'modale-alert-warning' );
	}

	/**
	 * Permet d'afficher un message de succés
	 */
	public async alertSuccess( messageValue: string, headerValue: string = '' ){
		// Détermiantion du header à utiliser
			if( headerValue == '' ){
				headerValue = 'Succès'
			}

		// Génération de la modale
			await this.alertBase( messageValue, headerValue, 'modale-alert-success' );
	}
    
	/**
	 * Compensation du zero
	 */
	private padDate( valueNumber: number ){
		// Convertion du nombre en lettre
			let valueLetter = valueNumber.toString();

		// Vérification de la taille
			if( valueLetter.length > 1 ){
				return valueLetter;
			}

		// Ajout des zeros
			return valueLetter.padStart( 2, '0' );
	}

	/**
	 * Génére la date au format PHP
	 */
	public generePhpDateUtc(){
		// Détermiantion de la date UTC
			// Extraction de la date du systéme
				var dateLocal = new Date(); 

			// Extraction de la date en UTC
				var nowUtc =  Date.UTC( dateLocal.getUTCFullYear(), dateLocal.getUTCMonth(), dateLocal.getUTCDate(), dateLocal.getUTCHours(), dateLocal.getUTCMinutes(), dateLocal.getUTCSeconds() );

			// Initialsiation de la date en UTC
				var dateUtc = new Date( new Date( nowUtc ).toLocaleString( 'en-US', { timeZone: 'UTC' } ) );

		// Génération de la date
			// Initialisation de la chaine
				let dateValue = '';

			// Gestion de la date
				dateValue += dateUtc.getFullYear() + '-' + this.padDate( dateUtc.getMonth() + 1 ) + '-' + this.padDate( dateUtc.getDate() );

			// Sépérateur date et heure
				dateValue += ' ';

			// Gestion de l'heure
				dateValue += this.padDate( dateUtc.getHours() ) + ':' + this.padDate( dateUtc.getMinutes() ) + ':' + this.padDate( dateUtc.getSeconds() );

			// Réponse de la fonction
				return dateValue;
	}

	/**
	 * Permet de convertir une date PHP en timestamp
	 * Note : Pratique pour faire des comparaison de date
	 */
	public transformDatePhpToTimestamp( dateString: string ){
		return Date.parse( dateString );
	}

}
