'use strict';

// Generate image variants
const imagesSrc = require('../../data/comparison-images.json');

// original stuff
module.exports = app => {
	app.get('/compare', (request, response) => {
		response.set({ 'Cache-Control': 'no-cache' });
		response.render('compare', {
			layout: 'layout',
			title: 'Version Comparison',
			image: imagesSrc
		});
	});
};
