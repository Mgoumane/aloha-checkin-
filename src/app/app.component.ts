import { Component } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  constructor() {
    this.createCacheFolder();
  }

  async createCacheFolder(){
    /*await Filesystem.mkdir({
      directory: Directory.Cache,
      path: 'CACHED-IMG'
    }).catch( e => {
      console.log( 'Déjà présent' );
    });*/
  }
}
