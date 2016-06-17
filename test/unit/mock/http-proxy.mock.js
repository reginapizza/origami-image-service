'use strict';

const sinon = require('sinon');

const httpProxy = module.exports = {
	createProxyServer: sinon.stub()
};

const mockProxyServer = module.exports.mockProxyServer = {
	on: sinon.stub(),
	web: sinon.stub()
};

module.exports.mockProxyRequest = {
	setHeader: sinon.spy()
};

httpProxy.createProxyServer.returns(mockProxyServer);
