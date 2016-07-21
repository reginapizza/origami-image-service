'use strict';

const getCmsUrl = require('../../middleware/get-cms-url');
const httpError = require('http-errors');
const mapCustomScheme = require('../../middleware/map-custom-scheme');
const processImageRequest = require('../../middleware/process-image-request');

module.exports = app => {

	// Image with an HTTP or HTTPS scheme, matches:
	// /v2/images/raw/https://...
	// /v2/images/raw/http://...
	app.get(
		/\/v2\/images\/raw\/(https?(:|%3A).*)$/,
		processImageRequest(app.imageServiceConfig),
		(request, response) => {
			app.proxy.web(request, response, {
				target: request.appliedTransform
			});
		}
	);

	// Image with a custom scheme, matches:
	// /v2/images/raw/fticon:...
	// /v2/images/raw/fthead:...
	// /v2/images/raw/ftsocial:...
	// /v2/images/raw/ftpodcast:...
	// /v2/images/raw/ftlogo:...
	// TODO make sure these default to the original exension! E.g. SVG for fticon
	app.get(
		/^\/v2\/images\/raw\/((fticon|fthead|ftsocial|ftpodcast|ftlogo)(\-v\d+)?(:|%3A).*)$/,
		mapCustomScheme(app.imageServiceConfig),
		processImageRequest(app.imageServiceConfig),
		(request, response) => {
			app.proxy.web(request, response, {
				target: request.appliedTransform
			});
		}
	);

	// Image with a custom scheme, matches:
	// /v2/images/raw/ftcms:...
	app.get(
		/^\/v2\/images\/raw\/((ftcms)(:|%3A).*)$/,
		getCmsUrl(app.imageServiceConfig),
		processImageRequest(app.imageServiceConfig),
		(request, response) => {
			app.proxy.web(request, response, {
				target: request.appliedTransform
			});
		}
	);

	// Image with an imageset, matches:
	// all other /v2/images/raw/...
	app.get(/\/v2\/images\/raw\/?$/, (request, response, next) => {
		// Not implemented, maybe we don't need to based on logs?
		next(httpError(501));
	});

};
