'use strict';

const express = require('express');
const requireAll = require('require-all');

module.exports = imageService;

function imageService(config) {

	const app = createExpressApp(config);
	mountRoutes(app);

	return new Promise((resolve, reject) => {
		const server = app.listen(config.port, error => {
			if (error) {
				return reject(error);
			}
			app.server = server;
			resolve(app);
		});
	});
}

function createExpressApp(config) {
	const app = express();
	app.set('env', config.environment);
	app.disable('x-powered-by');
	app.enable('strict routing');
	app.enable('case sensitive routing');
	return app;
}

function mountRoutes(app) {
	requireAll({
		dirname: `${__dirname}/routes`,
		resolve: initRoute => initRoute(app)
	});
}
