'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');

describe('lib/middleware/handle-errors', () => {
	let express;
	let handleErrors;

	beforeEach(() => {

		express = require('../../mock/n-express.mock');

		handleErrors = require('../../../../lib/middleware/handle-errors');
	});

	it('exports a function', () => {
		assert.isFunction(handleErrors);
	});

	describe('handleErrors(config)', () => {
		let config;
		let middleware;

		beforeEach(() => {
			config = {
				environment: 'development',
				log: {
					error: sinon.spy()
				}
			};
			middleware = handleErrors(config);
		});

		it('returns a middleware function', () => {
			assert.isFunction(middleware);
		});

		describe('middleware(error, request, response, next)', () => {
			let error;
			let next;

			beforeEach(() => {
				error = new Error('test error');
				error.status = 123;
				next = sinon.spy();
				middleware(error, express.mockRequest, express.mockResponse, next);
			});

			it('sets the response status to the error status', () => {
				assert.calledOnce(express.mockResponse.status);
				assert.calledWithExactly(express.mockResponse.status, 123);
			});

			it('sets the response body to HTML representing the error', () => {
				assert.calledOnce(express.mockResponse.send);
				assert.isString(express.mockResponse.send.firstCall.args[0]);
				assert.match(express.mockResponse.send.firstCall.args[0], /error 123/i);
				assert.match(express.mockResponse.send.firstCall.args[0], /test error/i);
			});

			it('includes the error stack in the response', () => {
				assert.include(express.mockResponse.send.firstCall.args[0], error.stack);
			});

			describe('with a 4xx error', () => {

				beforeEach(() => {
					error.status = 400;
					config.log.error.reset();
					middleware(error, express.mockRequest, express.mockResponse, next);
				});

				it('does not log the error stack', () => {
					assert.neverCalledWith(config.log.error, error.stack);
				});

			});

			describe('with a 5xx error', () => {

				beforeEach(() => {
					error.status = 500;
					config.log.error.reset();
					middleware(error, express.mockRequest, express.mockResponse, next);
				});

				it('logs the error stack', () => {
					assert.calledWithExactly(config.log.error, error.stack);
				});

			});

			describe('when `config.environment` is "production"', () => {

				beforeEach(() => {
					config.environment = 'production';
					express.mockResponse.send.reset();
					middleware(error, express.mockRequest, express.mockResponse, next);
				});

				it('does not include the error stack in the response', () => {
					assert.notInclude(express.mockResponse.send.firstCall.args[0], error.stack);
				});

			});

			describe('when the error has no `status` property', () => {

				beforeEach(() => {
					delete error.status;
					express.mockResponse.status.reset();
					middleware(error, express.mockRequest, express.mockResponse, next);
				});

				it('sets the response status to 500', () => {
					assert.calledOnce(express.mockResponse.status);
					assert.calledWithExactly(express.mockResponse.status, 500);
				});

			});

			describe('when the error has a `code` property set to "ENOTFOUND"', () => {

				beforeEach(() => {
					delete error.status;
					delete error.message;
					error.code = 'ENOTFOUND';
					express.mockResponse.status.reset();
					middleware(error, express.mockRequest, express.mockResponse, next);
				});

				it('sets the response status to 502', () => {
					assert.calledOnce(express.mockResponse.status);
					assert.calledWithExactly(express.mockResponse.status, 502);
				});

				it('sets the error message to "Bad Gateway"', () => {
					assert.strictEqual(error.message, 'Bad Gateway');
				});

			});

		});

	});

});
