import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage-angular';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { FooterComponent } from './component/footer/footer.component';
import { HeaderComponent } from './component/header/header.component';
import { InfoPage } from './pages/info/info.page';
import { SettingsPage } from './pages/settings/settings.page';
import { StatistiquePage } from './pages/statistique/statistique.page';

@NgModule({
  declarations: [
    AppComponent,
	HomePage,
	LoginPage,
	FooterComponent,
	HeaderComponent,
	InfoPage,
	SettingsPage,
	StatistiquePage
  ],
  imports: [
    BrowserModule, 
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(), 
    HttpClientModule,
    AppRoutingModule,
	FormsModule,
	ReactiveFormsModule,
  ],
  providers: [{ 
    provide: RouteReuseStrategy, 
    useClass: IonicRouteStrategy 
  }],
  bootstrap: [AppComponent],
})

export class AppModule {}
