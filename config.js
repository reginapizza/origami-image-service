'use strict';

module.exports = {
	cloudinaryAccountName: process.env.CLOUDINARY_ACCOUNT_NAME,
	environment: process.env.NODE_ENV || 'development',
	log: console,
	logLevel: process.env.LOG_LEVEL || 'info',
	port: process.env.PORT || 8080
};
