import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'loader',
		loadChildren: () => import('./pages/loader/loader.module').then( m => m.LoaderPageModule)
	},
	{
		path: 'login',
		loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
	},
	{
		path: 'home',
		loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
	},
	{
		path: 'info',
		loadChildren: () => import('./pages/info/info.module').then( m => m.InfoPageModule)
	},
	{
		path: 'settings',
		loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
	},
	{
		path: 'statistique',
		loadChildren: () => import('./pages/statistique/statistique.module').then( m => m.StatistiquePageModule)
	},
	
	{ // Premiére page
		path: '',
		redirectTo: 'loader',
		pathMatch: 'full'
	},
	{ // Page 404
		path: '**',
		redirectTo: 'loader',
	},
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'statistique',
    loadChildren: () => import('./pages/statistique/statistique.module').then( m => m.StatistiquePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
