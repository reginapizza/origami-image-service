'use strict';

// Generate image variants
const imagesSrc = require('../../data/comparison-images.json');

// imagesSrc.forEach((img) => {
// 	return img;
// });

// original stuff
module.exports = app => {
	app.get('/__compare', (request, response) => {
		response.set({ 'Cache-Control': 'no-cache' });
		response.render('compare', {
			layout: 'layout',
			title: 'Version Comparison',
			image: imagesSrc
		});
	});
};
