'use strict';

const processImageRequest = require('../../middleware/process-image-request');

module.exports = app => {

	// Debug image with an HTTP or HTTPS scheme
	app.get(/\/v2\/images\/debug\/(https?(:|%3A).*)$/, processImageRequest(app.imageServiceConfig), (request, response) => {
		response.send({
			transform: request.transform,
			appliedTransform: request.appliedTransform
		});
	});

};
