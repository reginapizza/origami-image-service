/* global service */
'use strict';

const imageService = require('../..');
const supertest = require('supertest');

before(() => {
	return imageService({
		environment: 'test',
		logLevel: process.env.LOG_LEVEL || 'trace',
		port: process.env.PORT || null
	})
	.then(service => {
		global.agent = supertest.agent(service);
		global.service = service;
	});
});

after(() => {
	service.server.close();
});
