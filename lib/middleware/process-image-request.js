'use strict';

const ImageTransform = require('../image-transform');
const imgixTransform = require('../transformers/imgix');
const cloudinaryTransform = require('../transformers/cloudinary');
const httpError = require('http-errors');

module.exports = processImage;

function processImage(config) {
	return (request, response, next) => {
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

		let appliedTransform;
		switch (request.query.transformer) {
			case 'imgix':
				appliedTransform = imgixTransform(transform, {
					imgixSecureUrlToken: config.imgixSecureUrlToken,
					imgixSourceName: config.imgixSourceName
				});
				break;
			default:
				appliedTransform = cloudinaryTransform(transform, {
					cloudinaryAccountName: config.cloudinaryAccountName
				});
				break;
		}

		request.transform = transform;
		request.appliedTransform = appliedTransform;
		next();
	};
}
