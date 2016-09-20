'use strict';

module.exports = (app, router) => {

	router.get('/__gtg', (request, response) => {
		response.status(200).send('OK');
	});

};
