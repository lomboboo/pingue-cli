#! /usr/bin/env node
const path = require( 'path' );
const fs = require( 'fs' );
const chalk = require( 'chalk' );
const figlet = require( 'figlet' );
const inquirer = require( 'inquirer' );
const program = require( 'commander' );
const findConfig = require('find-config');

const { create, removeOldStylesheets, insertDistStylesheets } = require( './lib/tasks/new' );
const generate = require( './lib/tasks/generate' );
const questions = require( './lib/questions/index' );
const helper = require( './lib/helper' );
const messages = require( './config' ).messages;

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
				const project_directory = `${helper.getCurrentDirectory()}/${project_name}`;

				let pingue_settings = {
					preprocessor: answers.preprocessor,
					port: answers.port,
					bootstrap: answers.bootstrap
				};
				// helper.saveJson( project_directory, pingue_settings );
				create( project_name )
					.then( () => helper.saveJson( project_directory, pingue_settings ) )
					.then( () => removeOldStylesheets( project_directory ) )
					.then( () => insertDistStylesheets( project_directory, answers.preprocessor ) )
					.then( () => {
						process.stdout.write( '\n' );
						console.log( chalk.green( messages.create.finished( project_name ) ) );
						process.exit();
					} )
					.catch( ( err ) => chalk.red( err ) );
			} );
		} );

	program
		.command( 'generate:page <page_name>' )
		.alias( 'g:page' )
		.description( 'Generate new page' )
		.action( page_name => {
			let cli_json_path = findConfig(messages.settings.json_name);
			let cli_json = JSON.parse(fs.readFileSync(cli_json_path, 'utf-8'));
			if ( !helper.issetConfig(cli_json_path) ) {
				throw Error( chalk.red(messages.config.missing) );
			}

			let PROJECT_ROOT = path.dirname(cli_json_path);

			generate
				.page(PROJECT_ROOT, page_name, cli_json);
		} );

	program.parse( process.argv );

};

init();