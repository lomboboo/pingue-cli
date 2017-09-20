const repo = 'https://github.com/lomboboo/webpack-typescript-boilerplate.git';

const project_directories = {
	html: 'src',
	ts: 'app',
	stylesheets: `src/stylesheets`,
	dist: {
		ts: 'component.ts.dist',
		html: 'component.html.dist',
		stylesheet: 'component.dist',
	}
};

const messages = {
	create: {
		start: 'Creating new project, please wait...',
		git_remove: 'Git diretory removed.',
		git_clone_start: 'Cloning repository...',
		git_clone_succeed: 'Repository have been cloned.',
		directory_exists: `already exists`,
		finished: ( project_name ) => `SUCCESS! New project ${project_name} have been created.`,
		npm_start: 'Installing dependencies...',
		npm_failed: 'Package install failed, see above.',
		npm_finished: 'Installed packages for tooling via npm.',
		stylesheets_start: 'Configuring preprocessor stylesheets...',
		stylesheets_finished: 'Preprocessor have been configured.',
	},

	generate: {
		page_start: 'Generating and configuring new page...',
		page_finish: 'New page have been created.',
		component_exists: 'Component exists: ',
		html: 'Html file created: '
	},

	colors: {
		light_green: '#6CED05'
	},

	settings: {
		json_name: "pingue_cli.json",
		json_save: "Saving settings...",
		json_saved: "Settings file saved.",
	},

	questions: {
		preprocessors_choice_message: "Choose preprocessor (less, scss):",
		preprocessors_choice_error: "Please enter one of two possible options.",
		port_input_message: "Enter port of the webpack dev server:",
		port_input_error: "Entered value must be a number and higher or equals 3000.",
		bootstrap_choice_message: "Bootstrap version (3, 4):",
		bootstrap_choice_error: "Please enter one of two possible options."
	},

	config: {
		missing: "Project does not have pingue_cli.json file."
	}
};

module.exports = {
	repo,
	messages,
	project_directories
};