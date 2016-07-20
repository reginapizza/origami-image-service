'use strict';

const ImageTransform = require('../image-transform');

module.exports = mapCustomScheme;

function mapCustomScheme(config) {
	return (request, response, next) => {

		// Replace any custom schemes in the request URI with
		// their HTTP/HTTPS equivalents.
		try {
			request.params[0] = ImageTransform.resolveCustomSchemeUri(request.params[0], config.customSchemeStore);
		} catch (error) {
			error.status = 400;
			return next(error);
		}

		next();
	};
}
