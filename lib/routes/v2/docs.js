'use strict';

const fs = require('fs');
const oneWeek = 60 * 60 * 24 * 7;

module.exports = app => {
	// Load the documentation HTML
	const documentation = fs.readFileSync(`${__dirname}/../../../docs/index.html`, 'utf-8');

	// v2 documentation page
	app.get('/v2', (request, response) => {
		response.set({
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': `public, stale-while-revalidate=${oneWeek}, max-age=${oneWeek}`
		});
		response.send(documentation);
	});

};
