'use strict';

const mapCustomScheme = require('../../middleware/map-custom-scheme');
const processImageRequest = require('../../middleware/process-image-request');

module.exports = app => {

	// Debug image with an HTTP or HTTPS scheme, matches:
	// /v2/images/debug/https://...
	// /v2/images/debug/http://...
	app.get(
		/\/v2\/images\/debug\/(https?(:|%3A).*)$/,
		processImageRequest(app.imageServiceConfig),
		(request, response) => {
			response.send({
				transform: request.transform,
				appliedTransform: request.appliedTransform
			});
		}
	);

	// Debug image with a custom scheme, matches:
	// /v2/images/debug/fticon:...
	// /v2/images/debug/fthead:...
	// /v2/images/debug/ftsocial:...
	// /v2/images/debug/ftpodcast:...
	// /v2/images/debug/ftlogo:...
	// TODO make sure these default to the original exension! E.g. SVG for fticon
	app.get(
		/^\/v2\/images\/debug\/((fticon|fthead|ftsocial|ftpodcast|ftlogo)(\-v\d+)?(:|%3A).*)$/,
		mapCustomScheme(app.imageServiceConfig),
		processImageRequest(app.imageServiceConfig),
		(request, response) => {
			response.send({
				transform: request.transform,
				appliedTransform: request.appliedTransform
			});
		}
	);

	// Image with a custom scheme, matches:
	// /v2/images/debug/ftcms:...
	app.get(/^\/v2\/images\/raw\/((ftcms)(:|%3A).*)$/, (request, response, next) => {
		// Not implemented yet
		next(httpError(501));
	});

};
