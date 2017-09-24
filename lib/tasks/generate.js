const fs = require( 'fs' );
const path = require( 'path' );
const chalk = require( 'chalk' );
const ora = require( 'ora' );
const readLine = require( 'readline' );

const config = require( '../../config' );
const messages = config.messages;
const project_directories = config.project_directories;

const page_start_Spinner = ora( chalk.yellow( messages.generate.page_start ) );
const html_Spinner = ora();
const stylesheet_Spinner = ora();
const ts_Spinner = ora();
const webpack_Spinner = ora();

let newFileFromDist = ( page_name, from, to ) => {
	return new Promise( ( resolve, reject ) => {
		fs.createReadStream( from )
			.pipe( fs.createWriteStream( to ) )
			.on( 'finish', () => resolve() )
			.on( 'error', ( e ) => {
				console.log( chalk.red( e ) );
				reject();
			} );
	} );
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
			if ( /entry:/.test( line ) ) {
				lineReader.write(
					`${page_name}: [ "./${page_name}.ts" ],\n`, '\n' );
			}
			if ( /plugins:.\[/.test( line ) ) {
				lineReader.write(
					`new HtmlWebpackPlugin( {
					    filename: '${page_name}.html',
					    chunks: [ "common", "vendor", "bootstrap", "manifest", "${page_name}" ],
					    template: help.root( "src/${page_name}.html" )
					} ),\n`, '\n' );
			}
		} );

		lineReader.on('close', function () {
			resolve();
		});

		lineReader.on( 'error', function () {
			reject();
		} );
	} );
};

let writeToTs = ( new_page_ts, page_name ) => {
	return new Promise( ( resolve, reject ) => {
		if ( !fs.existsSync( new_page_ts ) ) {
			reject();
		}
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
				ts_lineReader.close();
			}
		} );
		ts_lineReader.on( 'close', function () {
			resolve();
		} )
	} );
};

const generate = {

	page: ( PROJECT_ROOT, page_name, cli_json ) => {
		page_start_Spinner.start();
		const html_dir = `${PROJECT_ROOT}/${project_directories.html}`;
		const html_dist = `${config.ROOT}/${project_directories.dist.blueprints.component}/${project_directories.dist.html}`;
		const new_page_html = `${html_dir}/${page_name}.html`;

		const stylesheet_dir = `${PROJECT_ROOT}/${project_directories.stylesheet}`;
		const stylesheet_dist = `${config.ROOT}/${project_directories.dist.blueprints.component}/${project_directories.dist.stylesheet}`;
		const new_page_stylesheet = `${stylesheet_dir}/${page_name}.${cli_json.preprocessor}`;

		const ts_dir = `${PROJECT_ROOT}/${project_directories.ts}`;
		const ts_dist = `${config.ROOT}/${project_directories.dist.blueprints.component}/${project_directories.dist.ts}`;
		const new_page_ts = `${ts_dir}/${page_name}.ts`;

		return new Promise( ( resolve, reject ) => {

			if ( fs.existsSync( new_page_html ) || fs.existsSync( new_page_stylesheet ) || fs.existsSync( new_page_ts ) ) {
				page_start_Spinner.fail( `${messages.generate.component_exists} - ${page_name}` );
				process.exit();
			}

			newFileFromDist( page_name, html_dist, new_page_html )
				.then( () => {
					html_Spinner.succeed( chalk.yellow( `${messages.generate.html} ${path.basename(new_page_html)}` ) );
					return newFileFromDist( page_name, stylesheet_dist, new_page_stylesheet )
				} )
				.then( () => {
					stylesheet_Spinner.succeed( chalk.yellow( `${messages.generate.stylesheet} ${path.basename(new_page_stylesheet)}` ) );
					return newFileFromDist( page_name, ts_dist, new_page_ts )
				} )
				.then( () => {
					ts_Spinner.succeed( chalk.yellow( `${messages.generate.ts} ${path.basename(new_page_ts)}` ) );
					return writeToTs( new_page_ts, page_name )
				} )
				.then( () => writeToWebpackConfig( PROJECT_ROOT, page_name ) )
				.then( () => {
					webpack_Spinner.succeed( chalk.yellow( `${messages.generate.webpack}` ) );
					resolve( page_start_Spinner );
				} )
				.catch( ( e ) => {
					console.log( chalk.red( e ) );
					reject();
				} )
			;

		} );
	}

};

module.exports = generate;