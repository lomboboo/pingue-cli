const fs = require( 'fs' );
const chalk = require( 'chalk' );
const ora = require( 'ora' );
const exec = require( 'child_process' ).exec;

const file = require( '../helper' );
const config = require( '../../config' );
const messages = config.messages;
const project_directories = config.project_directories;

const page_start_Spinner = ora( chalk.yellow( messages.generate.page_start ) );
const html_Spinner = ora();

const generate = {
	page: ( PROJECT_ROOT, page_name ) => {
		page_start_Spinner.start();
		return new Promise( ( resolve, reject ) => {
			const html_dir = `${PROJECT_ROOT}/${project_directories.html}`;
			const html_dist = `${PROJECT_ROOT}/${project_directories.html}/${project_directories.dist.html}`;
			const new_page_html = `${html_dir}/${page_name}.html`;

			if ( fs.existsSync( new_page_html ) ) {
				page_start_Spinner.fail( `${messages.generate.component_exists} - ${page_name}` );
				process.exit();
			}

			fs.createReadStream( html_dist )
				.pipe(
					fs.createWriteStream( new_page_html )
				)
				.on( 'error', ( e ) => {
					console.log( chalk.red( e ) );
					reject();
				} );

			html_Spinner.succeed( chalk.yellow( `${messages.generate.html} ${new_page_html}` ) );
			page_start_Spinner.succeed( chalk.hex( messages.colors.light_green )( messages.generate.page_finish ) );

			resolve();

		} );
	}
};

module.exports = generate;