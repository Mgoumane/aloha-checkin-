import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { MenuController } from '@ionic/angular';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlohaCommunicationService } from 'src/app/services/aloha-communication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { configApp } from 'src/environments/config-app';
import { Platform } from '@ionic/angular';


@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

	batteryLevel: number;
	batteryIconName: string;
	batteryIconColor: string;
	isValide: number | undefined;

	// Récupération du title du parent
	@Input() title: string;

	//Récupération de la Méthode startScanner du parent 
	@Output("startScanner") startScannerFromParent: EventEmitter<any> = new EventEmitter();

	// Timer
	timerSubscription: Subscription;

	constructor(
		private router: Router,
		private alohaCommunicationService: AlohaCommunicationService,
		private menu: MenuController,
		private databaseService: DatabaseService,
		public platform: Platform
	) { }

	async ngOnInit() {

		let dbUserInfo = await this.databaseService.exportTable(configApp.systeme_user_info);
		this.isValide = dbUserInfo.data.is_valide

		this.runSetBattery();

		//Arret en mode Background :
		this.stopSetBattery();
	}

	ngOnDestroy(): void {
		this.timerSubscription.unsubscribe();
	}

	async logOut() {
		// Suppression des informations utilisateurs du storage 
		await this.databaseService.deleteTable(configApp.systeme_user_info);

		this.alohaCommunicationService.actionLogout().then((response) => {
			this.router.navigate(['login']);
		})
	}


	setBatteryLevel = async () => {
		const batteryInfo = await Device.getBatteryInfo();
		const batteryLevel = batteryInfo.batteryLevel as number;
		this.batteryLevel = Math.floor(batteryLevel * 100);

		if (this.batteryLevel >= 75) {
			this.batteryIconName = "full";
			this.batteryIconColor = "green"
		}
		if (this.batteryLevel < 75 && this.batteryLevel >= 25) {
			this.batteryIconName = "half"
			this.batteryIconColor = "white"

		}
		if (this.batteryLevel < 25) {
			this.batteryIconName = "red" // icone vert 
		}
	};
	runSetBattery() {
		this.setBatteryLevel();
		this.timerSubscription = timer(0, 300000).pipe(
			map(() => {
				this.setBatteryLevel();
			})
		).subscribe();

		this.platform.resume.subscribe(async () => {
			this.runSetBattery();
		});
	}
	stopSetBattery() {
		this.platform.pause.subscribe(async () => {
			this.timerSubscription.unsubscribe();
		});
	}
	// 20 % message orange
	// 10 % et 5% message rouge 



	// Ci dessous : fonctions liés au menu de navigation 
	startScanner() {
		this.startScannerFromParent.emit();
		this.menu.close();
	}

	goToInfoPage() {
		this.router.navigate(['info']);
		this.menu.close();

	}

	goToHomePage() {
		this.router.navigate(['home']);
		this.menu.close();

	}

	goToSettingsPage() {
		this.router.navigate(['settings']);
		this.menu.close();

	}

	goToStatistiquePage() {
		this.router.navigate(['statistique']);
		this.menu.close();

	}
}
