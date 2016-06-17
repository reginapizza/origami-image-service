'use strict';

const cloudinary = require('cloudinary');
const ImageTransform = require('../image-transform');

module.exports = cloudinaryTransform;

function cloudinaryTransform(transform, options = {}) {
	if (!(transform instanceof ImageTransform)) {
		throw new Error('Invalid transform argument, expected an ImageTransform object');
	}
	cloudinary.config({
		cloud_name: options.cloudinaryAccountName
	});
	return cloudinary.url(encodeURI(transform.uri), buildCloudinaryTransforms(transform));
}

function buildCloudinaryTransforms(transform) {
	const cloudinaryTransforms = {
		type: 'fetch',
		width: transform.width,
		height: transform.height,
		dpr: transform.dpr,
		format: transform.format,
		quality: transform.quality,
		background: (transform.bgcolor ? `#${transform.bgcolor}` : undefined),
		crop: getCloudinaryCropStrategy(transform.fit)
	};
	return cloudinaryTransforms;
}

function getCloudinaryCropStrategy(cropStrategy) {
	const cropStrategyMap = {
		contain: 'fit',
		cover: 'fill',
		'scale-down': 'limit'
	};
	return cropStrategyMap[cropStrategy];
}
