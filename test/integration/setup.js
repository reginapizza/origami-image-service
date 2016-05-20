'use strict';

const imageService = require('../..');
const supertest = require('supertest');

before(function() {
	return imageService({
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
