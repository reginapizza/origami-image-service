'use strict';

const httpError = require('http-errors');

module.exports = app => {

	// Image with a an HTTP or HTTPS scheme
	app.get(/\/v2\/images\/raw\/(https?(:|%3A).*)$/, (request, response) => {
		const uri = request.params[0];
		response.send(`
			<p>Would process <code>${uri}</code></p>
		`);
	});

	// Image with a custom scheme
	app.get(/^\/v2\/images\/raw\/((ftcms|fticon|fthead|ftsocial|ftpodcast|ftlogo)(:|%3A).*)$/, (request, response, next) => {
		// Not implemented yet
		next(httpError(501));
	});

	// Image with an imageset
	app.get(/\/v2\/images\/raw\/?$/, (request, response, next) => {
		// Not implemented, maybe we don't need to based on logs?
		next(httpError(501));
	});

};
