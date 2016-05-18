'use strict';

const config = require('./config');
const imageService = require('./lib/image-service');

imageService(config).catch(error => {
	config.log.error(error.stack);
	process.exit(1);
});
