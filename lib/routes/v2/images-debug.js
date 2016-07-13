'use strict';

const mapCustomScheme = require('../../middleware/map-custom-scheme');
const processImageRequest = require('../../middleware/process-image-request');

module.exports = app => {

	// Debug image with an HTTP or HTTPS scheme
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

	// Image with a custom scheme
	// TODO make sure these default to the original exension! E.g. SVG for fticon
	app.get(
		/^\/v2\/images\/debug\/((ftcms|fticon|fthead|ftsocial|ftpodcast|ftlogo)(\-v\d+)?(:|%3A).*)$/,
		mapCustomScheme(app.imageServiceConfig),
		processImageRequest(app.imageServiceConfig),
		(request, response) => {
			response.send({
				transform: request.transform,
				appliedTransform: request.appliedTransform
			});
		}
	);

};
