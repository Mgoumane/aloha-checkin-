// import { Component, Input } from "@angular/core";
// import { Filesystem, Directory } from "@capacitor/filesystem";

// const CACHE_FOLDER = 'CACHED-IMG';

// @Component({
//     selector: 'cached-image',
//     templateUrl: './cached-image.component.html',
// })

// export class CachedImageComponent {

//     _src = '';
//     @Input()spinner = false;

//     constructor(){ }

//     @Input()
//     set src(imageUrl: string){
//         console.log( 'set source' + imageUrl );

//         const imageName = imageUrl.split('/').pop();
//         const fileType = imageName?.split('.').pop();

//         if( imageName == undefined ){
//             this._src = '';
//         } else {

//             Filesystem.readFile({
//                 directory: Directory.Data,
//                 path: CACHE_FOLDER + '/' + imageName
//             }).then(readFile => {
//                 console.log( 'local fichier: ' + readFile );
//                 this._src = 'data:image/' + fileType + ';base64,' + readFile.data;
//             }).catch( async e => {
//                 // ecrire fichier
//                 await this.storeImage( imageUrl, imageName );
//                 Filesystem.readFile({
//                     directory: Directory.Data,
//                     path: CACHE_FOLDER + '/' + imageName
//                 }).then(readFile => {
//                     this._src = 'data:image/' + fileType + ';base64,' + readFile.data;
//                 })
//             })

//         }
//     }

//     async storeImage( url: string, path: string ){
//         await Filesystem.mkdir({
//             directory: Directory.Data,
//             path: CACHE_FOLDER
//           }).catch( e => {
//             console.log( 'Déjà présent' );
//           });


//         // retrieve the image
//         const response = await fetch( url );

//         // convert to a Blob
//         const blob = await response.blob();

//         // convert to base64 data, which the Filesystem plugin requires
//         const base64Data = await this.convertBlobToBase64(blob) as string;
            
//         const savedFile = await Filesystem.writeFile({
//             path: CACHE_FOLDER + '/' + path,
//             data: base64Data,
//             directory: Directory.Data
//         }).then(rep => {
//             console.log( rep );
//         }).catch( async e => {
//             console.log( e );
//         });

//         return savedFile;
//     }

//     convertBlobToBase64(blob: Blob){
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader;
//             reader.onerror = reject;
//             reader.onload = () => {
//                 resolve(reader.result);
//             };
//             reader.readAsDataURL(blob);
//         });
//     }

// }