const inquirer = require( 'inquirer' );
inquirer.registerPrompt( 'command', require( 'inquirer-command-prompt' ) );
const _ = require( 'lodash' );
const messages = require( '../../config' ).messages;

const preprocessor_choices = [ 'less', 'scss' ];
const bootstrap_choices = [ 3, 4 ];

const questions = [
	{
		type: 'preprocessor',
		name: 'preprocessor',
		message: messages.questions.preprocessors_choice_message,
		autoCompletion: preprocessor_choices,
		default: "less",
		validate: value => {
			if ( _.includes( preprocessor_choices, value ) ) return true;
			return messages.questions.preprocessors_choice_error;
		}
	},
	{
		type: 'input',
		name: 'port',
		message: messages.questions.port_input_message,
		'default': 8000,
		filter: ( value ) => {
			return parseInt( value );
		},
		validate: value => {
			if ( _.isNumber( value ) && value >= 3000 ) return true;
			return messages.questions.port_input_error;
		}
	},
	{
		type: 'bootstrap',
		name: 'bootstrap',
		message: messages.questions.bootstrap_choice_message,
		autoCompletion: bootstrap_choices,
		default: 4,
		filter: ( value ) => {
			return parseInt( value );
		},
		validate: value => {
			if ( _.includes( bootstrap_choices, value ) ) return true;
			return messages.questions.bootstrap_choice_error;
		}
	}
];

module.exports = questions;