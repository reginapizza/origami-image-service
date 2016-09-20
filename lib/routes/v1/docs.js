'use strict';

const httpError = require('http-errors');

module.exports = (app, router) => {

	// v1 documentation page (gone)
	router.use('/v1', (request, response, next) => {
		const error = httpError(501);
		const url = `http://image.webservices.ft.com/v1${request.url}`;
		error.explanation = `Version 1 of the image service can be found at <a href="${url}">${url}</a>.`;
		next(error);
	});

};
