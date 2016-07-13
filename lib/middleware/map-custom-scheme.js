'use strict';

const ImageTransform = require('../image-transform');

module.exports = mapCustomScheme;

function mapCustomScheme(config) {
	return (request, response, next) => {
		try {
			request.params[0] = ImageTransform.resolveCustomSchemeUri(request.params[0], config.customSchemeStore);
		} catch (error) {
			error.status = 400;
			return next(error);
		}
		next();
	};
}
