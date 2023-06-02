import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePageRoutingModule } from './home-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';


@NgModule({
  imports: [
    CommonModule,
	IonicModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
	IonicStorageModule.forRoot(),
  ],
  declarations: []
})
export class HomePageModule {}
