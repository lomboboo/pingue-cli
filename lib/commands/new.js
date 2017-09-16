const chalk = require( 'chalk' );
const git = require( 'simple-git/promise' )();
const CLI = require( 'clui' );
const Spinner = CLI.Spinner;
const exec = require( 'child_process' ).exec;

const file = require( '../file' );
const config = require( '../../config' );
const messages = config.messages;

const status = new Spinner( chalk.yellow( messages.create.start ) );

let removeGitDir = () => {
	exec( `rm -rf ./.git`, function ( err ) {
		if ( err ) throw err;
	} );
};

let npmInstall = () => {
	exec( `npm install`, ( err, stdout, stderr ) => {
		console.log( chalk.red( err ) );
		console.log( chalk.red( messages.create.npm_failed ) );
	} )
};

let navigateToProject = ( project_name ) => {
	exec( `cd ./${project_name}`, ( err, stdout, stderr ) => {
		if ( err ) throw stderr;
	} )
};

let create = ( project_name ) => {
	if ( file.directoryExists( project_name ) ) {
		console.log( chalk.red( `${project_name} ${messages.create.directory_exists}` ) );
		process.exit();
	}

	status.start();
	git
		.clone( config.repo, project_name )
		.then( () => {
			navigateToProject(project_name);
			removeGitDir( project_name );
			npmInstall();

			process.stdout.write( '\n' );
			console.log( chalk.green( messages.create.finished( project_name ) ) );
			status.stop();
		} )
		.catch( ( err ) => chalk.red( console.error( 'failed: ', err ) ) );
};

module.exports = {
	create
};