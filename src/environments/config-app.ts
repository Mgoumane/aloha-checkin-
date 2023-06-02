export const configApp = {
	// Application
		app_version					: '1.0.0',
		app_date					: '2023-04-03',

	// API
		api_url						: 'https://dev.aloha-checkin.mediactive-events.com/wsrv/mobile/index.php',
		api_key						: 'FgUpLGYeMaKDzJaqknytr34AiAW8c8JRqMEWnrC4jDx4fbQSRn',

	// Stockage données
		prefix_stockage				: 'st_',
		prefix_database				: 'db_',
		prefix_systeme				: 'sy_',

		database_scan				: 'scan',

		systeme_database_sync_date	: 'database_sync_date',
		systeme_user_info			: 'user_info',
		systeme_user_lieu			: 'user_lieu',

	// Statut des scans
		scan_statut_a_envoyer		: 0,
		scan_statut_traite			: 1,

		scan_invalide				: 0,
		scan_valide					: 1,

	// File systeme
		folderName					: "dossier-scans",
		fileName					: "scan.txt",

	// Erreur
		erreur_show_message			: -1000,
};