'use strict';

const assert = require('chai').assert;
const mockery = require('mockery');
const path = require('path');
const sinon = require('sinon');

describe('lib/image-service', () => {
	let basePath;
	let express;
	let handleErrors;
	let imageService;
	let notFound;
	let requireAll;

	beforeEach(() => {
		basePath = path.resolve(`${__dirname}/../../..`);

		express = require('../mock/express.mock');
		mockery.registerMock('express', express);

		handleErrors = sinon.stub().returns(sinon.spy());
		mockery.registerMock('./middleware/handle-errors', handleErrors);

		notFound = sinon.spy();
		mockery.registerMock('./middleware/not-found', notFound);

		requireAll = require('../mock/require-all.mock');
		mockery.registerMock('require-all', requireAll);

		imageService = require(basePath);
	});

	it('exports a function', () => {
		assert.isFunction(imageService);
	});

	describe('imageService(config)', () => {
		let config;
		let returnedPromise;
		let routes;

		beforeEach(() => {
			config = {
				environment: 'test',
				port: 1234
			};
			routes = {
				foo: sinon.spy(),
				bar: sinon.spy()
			};
			requireAll.returns(routes);
			returnedPromise = imageService(config);
		});

		it('returns a promise', () => {
			assert.instanceOf(returnedPromise, Promise);
		});

		it('creates an Express application', () => {
			assert.calledOnce(express);
		});

		it('sets the Express application `env` to `config.environment`', () => {
			assert.calledWithExactly(express.mockApp.set, 'env', config.environment);
		});

		it('disables the `X-Powered-By` header', () => {
			assert.calledWithExactly(express.mockApp.disable, 'x-powered-by');
		});

		it('enables strict routing', () => {
			assert.calledWithExactly(express.mockApp.enable, 'strict routing');
		});

		it('enables case sensitive routing', () => {
			assert.calledWithExactly(express.mockApp.enable, 'case sensitive routing');
		});

		it('loads all of the routes', () => {
			assert.calledOnce(requireAll);
			assert.isObject(requireAll.firstCall.args[0]);
			assert.strictEqual(requireAll.firstCall.args[0].dirname, `${basePath}/lib/routes`);
			assert.isFunction(requireAll.firstCall.args[0].resolve);
		});

		it('calls each route with the Express application', () => {
			const route = sinon.spy();
			requireAll.firstCall.args[0].resolve(route);
			assert.calledOnce(route);
			assert.calledWithExactly(route, express.mockApp);
		});

		it('mounts middleware to handle routes that are not found', () => {
			assert.calledWith(express.mockApp.use, notFound);
		});

		it('mounts middleware to handle errors', () => {
			assert.calledOnce(handleErrors);
			assert.calledWith(handleErrors, config);
			assert.calledWith(express.mockApp.use, handleErrors.firstCall.returnValue);
		});

		it('starts the Express application on the port in `config.port`', () => {
			assert.calledOnce(express.mockApp.listen);
			assert.calledWith(express.mockApp.listen, config.port);
		});

		describe('.then()', () => {
			let service;

			beforeEach(() => {
				return returnedPromise.then(value => {
					service = value;
				});
			});

			it('resolves with the created Express application', () => {
				assert.strictEqual(service, express.mockApp);
			});

			it('stores the created server in the Express application `server` property', () => {
				assert.strictEqual(service.server, express.mockServer);
			});

		});

		describe('when the Express application errors on startup', () => {
			let expressError;

			beforeEach(() => {
				expressError = new Error('Express failed to start');
				express.mockApp.listen.yieldsAsync(expressError);
				returnedPromise = imageService(config);
			});

			describe('.catch()', () => {
				let caughtError;

				beforeEach(done => {
					returnedPromise.then(done).catch(error => {
						caughtError = error;
						done();
					});
				});

				it('fails with the Express error', () => {
					assert.strictEqual(caughtError, expressError);
				});

			});

		});

	});

});
