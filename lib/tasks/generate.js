const fs = require( 'fs' );
const chalk = require( 'chalk' );
const ora = require( 'ora' );
const exec = require( 'child_process' ).exec;
const readLine = require( 'readline' );

const file = require( '../helper' );
const config = require( '../../config' );
const messages = config.messages;
const project_directories = config.project_directories;

const page_start_Spinner = ora( chalk.yellow( messages.generate.page_start ) );
const html_Spinner = ora();
const stylesheet_Spinner = ora();
const ts_Spinner = ora();
const webpack_Spinner = ora();

let newFileFromDist = ( page_name, from, to ) => {
	return fs.createReadStream( from )
		.pipe(
			fs.createWriteStream( to )
		);
};

let writeToWebpackConfig = ( PROJECT_ROOT, page_name ) => {
	return new Promise( ( resolve, reject ) => {
		let ws = fs.createWriteStream( `${PROJECT_ROOT}/${project_directories.webpack_config}`, {
			flags: 'r+',
			defaultEncoding: 'utf8'
		} );
		ws.isTTY = true;
		let lineReader = readLine.createInterface( {
			input: fs.createReadStream( `${PROJECT_ROOT}/${project_directories.webpack_config}` ),
			output: ws
		} );

		lineReader.on( 'line', function ( line ) {
			if ( /plugins:.\[/.test( line ) ) {
				lineReader.write(
					`new HtmlWebpackPlugin( {
					    filename: '${page_name}.html',
					    chunks: [ "common", "vendor", "bootstrap", "manifest", "${page_name}" ],
					    template: help.root( "src/${page_name}.html" )
					} ),`, '\n' );
				webpack_Spinner.succeed( chalk.yellow( `${messages.generate.webpack}` ) );
				resolve();
			}
		} );

		lineReader.on( 'error', function () {
			reject();
		} );
	} );
};

let writeToTs = ( new_page_ts, page_name ) => {
	let ws = fs.createWriteStream( `${new_page_ts}`, {
		flags: 'r+',
		defaultEncoding: 'utf8'
	} );
	ws.isTTY = true;
	let ts_lineReader = readLine.createInterface( {
		input: fs.createReadStream( `${new_page_ts}` ),
		output: ws
	} );
	ts_lineReader.on( 'line', function ( line ) {
		let data = fs.readFileSync( new_page_ts, 'utf8' );
		let lines = data.split( '\n' );
		let isLastLine = (lines[ lines.length - 1 ] == '' || line == require( 'os' ).EOL) ? true : false;

		if ( isLastLine ) {
			ts_lineReader.write( `import "../stylesheets/${page_name}";`, '\n' );
		}
	} );
};

const generate = {

	page: ( PROJECT_ROOT, page_name, cli_json ) => {
		page_start_Spinner.start();
		return new Promise( ( resolve, reject ) => {
			const html_dir = `${PROJECT_ROOT}/${project_directories.html}`;
			const html_dist = `${PROJECT_ROOT}/${project_directories.html}/${project_directories.dist.html}`;
			const new_page_html = `${html_dir}/${page_name}.html`;

			const stylesheet_dir = `${PROJECT_ROOT}/${project_directories.stylesheet}`;
			const stylesheet_dist = `${PROJECT_ROOT}/${project_directories.stylesheet}/${project_directories.dist.stylesheet}`;
			const new_page_stylesheet = `${stylesheet_dir}/${page_name}.${cli_json.preprocessor}`;

			const ts_dir = `${PROJECT_ROOT}/${project_directories.ts}`;
			const ts_dist = `${PROJECT_ROOT}/${project_directories.ts}/${project_directories.dist.ts}`;
			const new_page_ts = `${ts_dir}/${page_name}.ts`;

			if ( fs.existsSync( new_page_html ) || fs.existsSync( new_page_stylesheet ) ) {
				page_start_Spinner.fail( `${messages.generate.component_exists} - ${page_name}` );
				process.exit();
			}

			let html_stream = newFileFromDist( page_name, html_dist, new_page_html );
			html_stream.on( 'error', ( e ) => {
				console.log( chalk.red( e ) );
				reject();
			} );

			let stylesheet_stream = newFileFromDist( page_name, stylesheet_dist, new_page_stylesheet );
			stylesheet_stream.on( 'error', ( e ) => {
				console.log( chalk.red( e ) );
				reject();
			} );


			let ts_stream = newFileFromDist( page_name, ts_dist, new_page_ts );
			ts_stream.on( 'error', ( e ) => {
				console.log( chalk.red( e ) );
				reject();
			} );
			ts_stream.on( 'finish', function () {
				writeToTs( new_page_ts, page_name );
			} );

			writeToWebpackConfig( PROJECT_ROOT, page_name )
				.then( () => {
					page_start_Spinner.succeed( chalk.hex( messages.colors.light_green )( messages.generate.page_finish ) );
				} )
				.catch( ( e ) => console.log( e ) );

			html_Spinner.succeed( chalk.yellow( `${messages.generate.html} ${new_page_html}` ) );
			stylesheet_Spinner.succeed( chalk.yellow( `${messages.generate.stylesheet} ${new_page_stylesheet}` ) );
			ts_Spinner.succeed( chalk.yellow( `${messages.generate.ts} ${new_page_ts}` ) );

			resolve();

		} );
	}

};

module.exports = generate;