import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { configApp } from 'src/environments/config-app';
import { pageApp } from 'src/environments/path-app';



@Component({
	selector: 'app-loader',
	templateUrl: './loader.page.html',
	styleUrls: ['./loader.page.scss'],
})

export class LoaderPage implements OnInit {

	isValide: number | undefined;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private databaseService: DatabaseService,

	) { }

	async ngOnInit() {

		let dbUserInfo = await this.databaseService.exportTable(configApp.systeme_user_info);
		this.isValide = dbUserInfo.data.is_valide

		this.route.params.subscribe(async val => {

			if (this.isValide === 1) {

				setTimeout(() => {
					this.router.navigate([pageApp.home], { replaceUrl: true });
				}, 1000);
				
			} else {
				setTimeout(() => {
					this.router.navigate([pageApp.login], { replaceUrl: true });
				}, 1000);
			}


		});
	}

}
