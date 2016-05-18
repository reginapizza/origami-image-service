'use strict';

const httpError = require('http-errors');

module.exports = app => {

	// v1 documentation page (gone)
	app.use('/v1', (request, response, next) => {
		next(httpError(410));
	});

};
