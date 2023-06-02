import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { ScanDatabaseService } from './scan-database.service';


@Injectable({
	providedIn: 'root'
})
export class FileSystemeService {

	scans: any;

	constructor(	) { }
	
	/**
	 * Fonction permettant de créer un fichier 
	 * 
	 */
	writeFile = async ( data: string, folderName: string  , fileName:string ) => {

		let result = await Filesystem.writeFile({
		  path: `${folderName}/${fileName}`,
		  data: data,
		  directory: Directory.Documents,
		  encoding: Encoding.UTF8,
		  recursive: true
		});
		
		console.log("file created at " + result.uri )
	
	};

	/**
	 * Fonction permettant de supprimer un fichier 
	 */
	deleteFile = async ( folderName: string  , fileName:string ) => {
		
		await Filesystem.deleteFile({
			path: `${folderName}/${fileName}`,
			directory: Directory.Documents,
		});

		console.log(` file ${folderName}/${fileName} deleted` )
		
	}

}
