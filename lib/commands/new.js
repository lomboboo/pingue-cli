const chalk = require( 'chalk' );
const git = require( 'simple-git/promise' )();
const ora = require( 'ora' );
const exec = require( 'child_process' ).exec;

const file = require( '../file' );
const config = require( '../../config' );
const messages = config.messages;

const git_remove_Spinner = ora( chalk.yellow( messages.create.git_remove ) );
const git_Spinner = ora( chalk.yellow( messages.create.git_clone_start ) );
const npm_Spinner = ora( chalk.yellow( messages.create.npm_start ) );
let project_directory;

let removeGitDir = () => {
	git_Spinner.succeed( chalk.hex( '#6CED05' )( messages.create.git_clone_succeed ) );
	git_remove_Spinner.start();
	return new Promise( ( resolve, reject ) => {
		exec( `rm -rf ./.git`, { cwd: project_directory }, ( err ) => {
			if ( err ) {
				console.log( err );
				reject();
			}
			git_remove_Spinner.succeed( chalk.hex( '#6CED05' )( messages.create.git_remove ) );
			resolve();
		} );
	} );

};

let npmInstall = () => {
	npm_Spinner.start();
	return new Promise( ( resolve, reject ) => {
			exec( `npm install`, { cwd: project_directory }, ( err, stdout, stderr ) => {
					if ( err ) {
						console.log( chalk.red( err ) );
						console.log( chalk.red( messages.create.npm_failed ) );
						reject();
					} else {
						npm_Spinner.succeed( chalk.hex( '#6CED05' )( messages.create.npm_finished ) );
						resolve();
					}
				}
			)
		}
	)
};

let create = ( project_name ) => {
	if ( file.directoryExists( project_name ) ) {
		console.log( chalk.red( `${project_name} ${messages.create.directory_exists}` ) );
		process.exit();
	}
	project_directory = `${file.getCurrentDirectory()}/${project_name}`;

	console.log( chalk.green( messages.create.start ) );
	git_Spinner.start();
	git
		.clone( config.repo, project_name )
		.then( () => removeGitDir() )
		.then( () => npmInstall() )
		.then( () => {
			process.stdout.write( '\n' );
			console.log( chalk.green( messages.create.finished( project_name ) ) );
			process.exit();
		} )
		.catch( ( err ) => chalk.red( console.error( 'failed: ', err ) ) );
};

module.exports = {
	create
};