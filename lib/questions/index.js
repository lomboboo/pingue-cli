const inquirer = require( 'inquirer' );
inquirer.registerPrompt('command', require('inquirer-command-prompt'));
const _ = require( 'lodash' );
const messages = require('../../config').messages;

const preprocessor_choices = [ 'less', 'scss' ];

const questions = [
	{
		type: 'command',
		name: 'preprocessor',
		message: 'Choose preprocessor (less, scss)',
		'default': 'less',
		autoCompletion: preprocessor_choices,
		validate: value =>{
			if ( _.includes(preprocessor_choices, value) ) return true;
			return messages.questions.preprocessors_choice_error;
		}
	}
];

module.exports = questions;