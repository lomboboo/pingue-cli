const inquirer = require( 'inquirer' );
const _ = require( 'lodash' );
const messages = require('../../config').messages;

const preprocessor_choices = [ 'less', 'scss' ];

const questions = [
	{
		type: 'input',
		name: 'preprocessor',
		message: 'Choose preprocessor (less, scss)',
		'default': 'less',
		choices: preprocessor_choices,
		validate: value =>{
			if ( _.includes(preprocessor_choices, value) ) return true;
			return messages.questions.preprocessors_choice_error;
		}
	}
];

module.exports = questions;