'use strict';

const express = require('express');
const handleErrors = require('./middleware/handle-errors');
const httpProxy = require('http-proxy');
const notFound = require('./middleware/not-found');
const requireAll = require('require-all');
const url = require('url');

module.exports = imageService;

function imageService(config) {

	const app = createExpressApp(config);
	const errorHandler = handleErrors(config);
	app.proxy = createProxy(errorHandler);
	app.imageServiceConfig = config;

	mountRoutes(app);
	app.use(notFound);
	app.use(errorHandler);

	return new Promise((resolve, reject) => {
		const server = app.listen(config.port, error => {
			if (error) {
				return reject(error);
			}
			app.server = server;
			resolve(app);
		});
	});
}

function createExpressApp(config) {
	const app = express();
	app.set('env', config.environment);
	app.disable('x-powered-by');
	app.enable('strict routing');
	app.enable('case sensitive routing');
	return app;
}

function createProxy(errorHandler) {
	const proxy = httpProxy.createProxyServer({
		ignorePath: true,
		secure: false
	});
	proxy.on('proxyReq', proxyRequestHandler);
	proxy.on('error', errorHandler);

	function proxyRequestHandler(proxyRequest, request, response, proxyOptions) {
		proxyRequest.setHeader('Host', url.parse(proxyOptions.target).host);
	}

	return proxy;
}

function mountRoutes(app) {
	requireAll({
		dirname: `${__dirname}/routes`,
		resolve: initRoute => initRoute(app)
	});
}
