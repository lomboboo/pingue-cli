const chalk = require( 'chalk' );
const git = require( 'simple-git/promise' )();
const ora = require( 'ora' );
const exec = require( 'child_process' ).exec;
const rimraf = require( 'rimraf' );

const file = require( '../helper' );
const config = require( '../../config' );
const messages = config.messages;
const project_directories = config.project_directories;

const git_remove_Spinner = ora( chalk.yellow( messages.create.git_remove ) );
const git_Spinner = ora( chalk.yellow( messages.create.git_clone_start ) );
const npm_Spinner = ora( chalk.yellow( messages.create.npm_start ) );
const stylesheets_Spinner = ora( chalk.yellow( messages.create.stylesheets_start ) );

let removeGitDir = ( project_directory ) => {
	git_Spinner.succeed( chalk.hex( messages.colors.light_green )( messages.create.git_clone_succeed ) );
	git_remove_Spinner.start();
	return new Promise( ( resolve, reject ) => {
		rimraf( `${project_directory}/.git`, function ( err ) {
			if ( err ) {
				console.log( err );
				reject();
			}
			git_remove_Spinner.succeed( chalk.hex( messages.colors.light_green )( messages.create.git_remove ) );
			resolve();
		} );
	} );

};

let npmInstall = ( project_directory ) => {
	npm_Spinner.start();
	return new Promise( ( resolve, reject ) => {
			exec( `npm install`, { cwd: project_directory }, ( err ) => {
					if ( err ) {
						console.log( chalk.red( err ) );
						console.log( chalk.red( messages.create.npm_failed ) );
						reject();
					} else {
						npm_Spinner.succeed( chalk.hex( messages.colors.light_green )( messages.create.npm_finished ) );
						resolve();
					}
				}
			)
		}
	)
};

let removeOldStylesheets = ( project_directory ) => {
	stylesheets_Spinner.start();
	return new Promise( ( resolve, reject ) => {
		exec( `find ./${project_directories.stylesheet} -maxdepth 1 -type f -exec rm {} \\;`, { cwd: project_directory }, ( err ) => {
			if ( err ) {
				console.log( err );
				reject();
			}

			resolve();
		} );
	} );
};

let generateStylesheets = ( project_directory, preprocessor ) => {
	return new Promise( ( resolve, reject ) => {
		exec( `cp ./${project_directories.stylesheet}/dist/${preprocessor}/* ./${project_directories.stylesheet}/ && rename 's/\.dist//' ./${project_directories.stylesheet}/*`, { cwd: project_directory }, ( err ) => {
			if ( err ) {
				console.log( err );
				reject();
			}
			stylesheets_Spinner.succeed( chalk.hex( messages.colors.light_green )( messages.create.stylesheets_finished ) );
			resolve();
		} );
	} );
};

let create = ( project_directory, project_name, preprocessor ) => {
	if ( file.directoryExists( project_name ) ) {
		console.log( chalk.red( `${project_name} ${messages.create.directory_exists}` ) );
		process.exit();
	}

	console.log( chalk.green( messages.create.start ) );
	git_Spinner.start();

	return git
		.clone( config.repo, project_name )
		.then( () => removeGitDir( project_directory ) )
		.then( () => npmInstall( project_directory ) )
		.then( () => removeOldStylesheets( project_directory ) )
		.then( () => generateStylesheets( project_directory, preprocessor ) )
		.catch( ( err ) => {
			chalk.red( console.error( 'failed: ', err ) );
			process.exit();
		});
};

module.exports = {
	create
};