const chalk = require( 'chalk' );
const git = require( 'simple-git/promise' )();
const CLI = require( 'clui' );
const Spinner = CLI.Spinner;
const exec = require('child_process').exec;

const file = require( '../file' );
const config = require( '../../config' );
const messages = config.messages;

const status = new Spinner( chalk.yellow( messages.create.start ) );

let removeGitDir = (project_name) => {
	exec(`cd ./${project_name} && rm -rf ./.git`, function (err) {
		if ( err ) throw err;
	});
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
			removeGitDir(project_name);

			process.stdout.write('\n');
			console.log( chalk.green( messages.create.finished(project_name) ) );
			status.stop();
		} )
		.catch( ( err ) => chalk.red( console.error( 'failed: ', err ) ) );
};

module.exports = {
	create
};