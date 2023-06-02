import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlohaCommunicationService } from '../../services/aloha-communication.service'
import { FunctionsService } from 'src/app/services/functions.service';
import { DatabaseService } from 'src/app/services/database.service';
import { configApp } from 'src/environments/config-app';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

	title: string;
	loginForm: FormGroup;
	
	constructor(
		private router: Router,
		private formBuilder: FormBuilder,
		private alohaCommunicationService: AlohaCommunicationService,
		private functionsService: FunctionsService,
		private databaseService: DatabaseService,
	) { }

	ngOnInit() {
		this.title = "Identification"

		this.loginForm = this.formBuilder.group({
			sessionCodeValue: ['', Validators.required],
		});
	}

	async onSubmit() {
		// Extraction de la donnée saisie 
			let inputValue = this.loginForm.get('sessionCodeValue')?.value;

		// Demande de connexion au serveur 
			const response = await this.alohaCommunicationService.actionLogin(inputValue);

		// Traitement de la réponse 
			if (response.data.is_valide == 1) {

				// Récupération et mise en DB locale des infos de l'utilisateur 
				let response = await this.alohaCommunicationService.getInfo();
				let userInfo = response.data
				await this.databaseService.importTable(configApp.systeme_user_info, userInfo);

				// Changement de la page
				this.router.navigate(['home']);

			} else {

				await this.functionsService.alertErreur("Indentification impossible", "Connexion");

			}
	}

}
