'use strict';

const ImageTransform = require('../image-transform');
const ImgixClient = require('imgix-core-js');

module.exports = imgixTransform;

function imgixTransform(transform, options = {}) {
	if (!(transform instanceof ImageTransform)) {
		throw new Error('Invalid transform argument, expected an ImageTransform object');
	}
	const client = new ImgixClient({
		host: `${options.imgixSourceName}.imgix.net`,
		includeLibraryParam: false,
		secureURLToken: options.imgixSecureUrlToken
	});
	return client.buildURL(transform.uri, buildImgixTransforms(transform));
}

function buildImgixTransforms(transform) {
	const imgixTransforms = {
		fm: transform.format,
		quality: transform.quality,
		fit: getImgixFitStrategy(transform.fit)
	};
	if (transform.width !== undefined) {
		imgixTransforms.w = transform.width;
	}
	if (transform.height !== undefined) {
		imgixTransforms.h = transform.height;
	}
	if (transform.dpr !== undefined) {
		imgixTransforms.dpr = transform.dpr;
	}
	if (transform.bgcolor !== undefined) {
		imgixTransforms.bg = transform.bgcolor;
	}
	return imgixTransforms;
}

function getImgixFitStrategy(fitStrategy) {
	const fitStrategyMap = {
		contain: 'clip',
		cover: 'crop',
		'scale-down': 'max'
	};
	return fitStrategyMap[fitStrategy];
}
