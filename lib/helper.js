const fs = require( 'fs' );
const messages = require( '../config' ).messages;
const ora = require( 'ora' );
const chalk = require( 'chalk' );

const json_start_Spinner = ora( chalk.hex( messages.colors.light_green )( messages.settings.json_save ) );

module.exports = {
	getCurrentDirectory: () => {
		return process.cwd();
	},

	directoryExists: filePath => {
		try {
			return fs.statSync( filePath ).isDirectory();
		} catch ( err ) {
			return false;
		}
	},

	saveJson: ( project_directory, object ) => {
		json_start_Spinner.start();
		object = JSON.stringify( object );
		return new Promise( ( resolve, reject ) => {
			fs.writeFile( `${project_directory}/${messages.settings.json_name}`, object, 'utf8', ( err ) => {
				if ( err ) {
					console.log( chalk.red( err ) );
					reject();
				} else {
					json_start_Spinner.succeed( chalk.hex( messages.colors.light_green )( messages.settings.json_saved ) );
					resolve();
				}
			} );
		} );
	},

	issetConfig: (cli_json_path) => {
		return !!cli_json_path;
	}

};