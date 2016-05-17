'use strict';

const config = require('./config');
const imageService = require('./lib/image-service');

imageService(config).catch(error => {
	console.error(error.stack); // TODO use proper logging
	process.exit(1);
});
