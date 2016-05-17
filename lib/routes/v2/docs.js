'use strict';

module.exports = app => {

	// v2 documentation page
	app.get('/v2/', (request, response) => {
		response.send('Hello World!');
	});

};
