'use strict';

module.exports = app => {

	// v1 documentation page (gone)
	app.use('/v1', (request, response) => {
		response.status(410).send('Not here!');
	});

};
