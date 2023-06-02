import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlohaCommunicationService } from 'src/app/services/aloha-communication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { configApp } from 'src/environments/config-app';
import { pageApp } from 'src/environments/path-app';




@Component({
	selector: 'app-settings',
	templateUrl: './settings.page.html',
	styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

	title: string ;
	lieuForm: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private databaseService: DatabaseService,
		private functionsService: FunctionsService,
		private router: Router,
		private alohaCommunicationService: AlohaCommunicationService,

	) { }

	async ngOnInit() {
		this.title = "Settings";
		this.lieuForm = this.formBuilder.group({
			inputValue: ['', Validators.required],
		});
		let reponse = await this.alohaCommunicationService.getInfo();
	}

	// Méthode passé au  composant Header (Voir settings.page.html)
	goToScan(){
		this.router.navigate([pageApp.home]);
	}
	
	async onSubmit(){
		// Récupération de la valeur de l'input
		console.log( this.lieuForm.get('inputValue')?.value)
		let lieuName = this.lieuForm.get('inputValue')?.value
		
		// Stockage en local
		await this.databaseService.importTable(configApp.systeme_user_lieu, lieuName );

		// Message de confirmation 
		await this.functionsService.alertSuccess("Ok", "Lieu ajouté" );

	}
	

}
