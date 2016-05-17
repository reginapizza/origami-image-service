'use strict';

module.exports = {
	environment: process.env.NODE_ENV || 'development',
	logLevel: process.env.LOG_LEVEL || 'info',
	port: process.env.PORT || 8080
};
