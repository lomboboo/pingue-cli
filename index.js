const chalk = require( 'chalk' );
const clear = require( 'clear' );
const figlet = require( 'figlet' );
const inquirer = require( 'inquirer' );
const Preferences = require( 'preferences' );
const _ = require( 'lodash' );
const fs = require( 'fs' );
const program = require( 'commander' );

const { create } = require( './lib/commands/new' );
const questions = require( './lib/questions/index' );
const file = require( './lib/file' );
const messages = require('./config').messages;

let init = () => {

	console.log(
		chalk.green(
			figlet.textSync( 'Pingue CLI', { horizontalLayout: 'full' } )
		)
	);

	program
		.version( '1.0.0' )
		.description( 'Pingue CLI fast up&run boilerplate' );

	program
		.command( 'new <project_name>' )
		.alias( 'n' )
		.description( 'Create new project' )
		.action( ( project_name ) => {
			inquirer.prompt( questions ).then( answers => {
				const project_directory = `${file.getCurrentDirectory()}/${project_name}`;

				let pingue_settings = {
					preprocessor: answers.preprocessor
				};
				create( project_name )
					.then( () => file.saveJson( project_directory, pingue_settings ))
					.then( () => {
						process.stdout.write( '\n' );
						console.log( chalk.green( messages.create.finished( project_name ) ) );
						process.exit();
					})
					.catch( ( err ) => chalk.red( err ) );
			} );
		} );

	program.parse( process.argv );

};

init();