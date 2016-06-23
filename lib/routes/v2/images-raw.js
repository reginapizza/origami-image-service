'use strict';

const ImageTransform = require('../../image-transform');
const imgixTransform = require('../../transformers/imgix');
const cloudinaryTransform = require('../../transformers/cloudinary');
const httpError = require('http-errors');

module.exports = app => {

	// Image with a an HTTP or HTTPS scheme, matches:
	// /v2/images/raw/https://...
	// /v2/images/raw/http://...
	app.get(/\/v2\/images\/raw\/(https?(:|%3A).*)$/, (request, response, next) => {
		let transform;
		request.query.uri = request.params[0];
		try {
			transform = new ImageTransform(request.query);
		} catch (error) {
			error.status = 400;
			return next(error);
		}
		if (!request.query.source) {
			return next(httpError(400, 'The source parameter is required'));
		}

		let proxyTarget;
		switch (request.query.transformer) {
			case 'imgix':
				proxyTarget = imgixTransform(transform, {
					imgixSecureUrlToken: app.imageServiceConfig.imgixSecureUrlToken,
					imgixSourceName: app.imageServiceConfig.imgixSourceName
				});
				break;
			default:
				proxyTarget = cloudinaryTransform(transform, {
					cloudinaryAccountName: app.imageServiceConfig.cloudinaryAccountName
				});
				break;
		}

		if (request.query.echo !== undefined) {
			return response.send({
				transform,
				appliedTransform: proxyTarget
			});
		}
		app.proxy.web(request, response, {
			target: proxyTarget
		});
	});

	// Image with a custom scheme, matches:
	// /v2/images/raw/ftcms:...
	// /v2/images/raw/fticon:...
	// /v2/images/raw/fthead:...
	// /v2/images/raw/ftsocial:...
	// /v2/images/raw/ftpodcast:...
	// /v2/images/raw/ftlogo:...
	app.get(/^\/v2\/images\/raw\/((ftcms|fticon|fthead|ftsocial|ftpodcast|ftlogo)(:|%3A).*)$/, (request, response, next) => {
		// Not implemented yet
		next(httpError(501));
	});

	// Image with an imageset, matches:
	// all other /v2/images/raw/...
	app.get(/\/v2\/images\/raw\/?$/, (request, response, next) => {
		// Not implemented, maybe we don't need to based on logs?
		next(httpError(501));
	});

};
