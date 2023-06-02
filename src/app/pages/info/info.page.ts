import { Component, OnInit } from '@angular/core';
import { configApp } from 'src/environments/config-app';
import { Device } from '@capacitor/device';
import { Router } from '@angular/router';


@Component({
	selector: 'app-info',
	templateUrl: './info.page.html',
	styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

	title: string;
	appVersion: string;
	deviceId: string;
	
	constructor(
		private router: Router,
	) { }

	ngOnInit() {
		this.title = "Informations";
		this.appVersion = configApp.app_version;
		this.setDeviceId();		
	}

	private async setDeviceId() {
		let deviceId = await Device.getId();
		this.deviceId = deviceId.uuid
	}

	// Méthode passé au  composant Header (Voir info.page.html)
	goToScan(){
		this.router.navigate(['home']);
	}

}
