const repo = 'https://github.com/lomboboo/webpack-typescript-boilerplate.git';

const messages = {
	create: {
		start: 'Creating new project, please wait...',
		directory_exists: `already exists`,
		finished: (project_name) => `SUCCESS! New project ${project_name} has been created.`
	}
};

module.exports = {
	repo,
	messages
};