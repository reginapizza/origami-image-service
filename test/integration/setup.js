'use strict';

const imageService = require('../..');
const supertest = require('supertest');

before(function() {
	return imageService({
		cloudinaryAccountName: 'financial-times', // TODO set up a test account for this?
		environment: 'test',
		logLevel: process.env.LOG_LEVEL || 'trace',
		port: process.env.PORT || null
	})
	.then(service => {
		this.agent = supertest.agent(service);
		this.service = service;
	});
});

after(function() {
	this.service.server.close();
});
