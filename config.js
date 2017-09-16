const repo = 'https://github.com/lomboboo/webpack-typescript-boilerplate.git';

const messages = {
	create: {
		start: 'Creating new project, please wait...',
		git_remove: 'Git diretory removed.',
		git_clone_start: 'Cloning repository...',
		git_clone_succeed: 'Repository has been cloned',
		directory_exists: `already exists`,
		finished: ( project_name ) => `SUCCESS! New project ${project_name} has been created.`,
		npm_start: 'Installing dependencies...',
		npm_failed: 'Package install failed, see above.',
		npm_finished: 'Installed packages for tooling via npm.',
	},

	colors: {
		light_green: '#6CED05'
	},

	settings: {
		json_name: "pingue_cli.json",
		json_save: "Saving settings...",
		json_saved: "Settings file was saved",
	},

	questions: {
		preprocessors_choice_error: "Please enter one of two possible options"
	}
};

module.exports = {
	repo,
	messages
};