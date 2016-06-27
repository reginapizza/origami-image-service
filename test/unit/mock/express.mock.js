'use strict';

const sinon = require('sinon');

const express = module.exports = sinon.stub();

const mockApp = module.exports.mockApp = {
	disable: sinon.stub(),
	enable: sinon.stub(),
	get: sinon.stub(),
	listen: sinon.stub().yieldsAsync(),
	set: sinon.stub(),
	use: sinon.stub()
};

const mockServer = module.exports.mockServer = {};

module.exports.mockRequest = {
	query: {},
	params: {}
};

module.exports.mockResponse = {
	send: sinon.stub().returnsThis(),
	status: sinon.stub().returnsThis()
};

mockApp.listen.returns(mockServer);
express.returns(mockApp);
