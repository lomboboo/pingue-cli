const chalk = require( 'chalk' );
const clear = require( 'clear' );
const figlet = require( 'figlet' );
const inquirer = require( 'inquirer' );
const Preferences = require( 'preferences' );
const _ = require( 'lodash' );
const fs = require( 'fs' );
const program = require( 'commander' );

const { create } = require( './lib/commands/new' );

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
			create( project_name );
		} );

	program.parse( process.argv );

};

init();