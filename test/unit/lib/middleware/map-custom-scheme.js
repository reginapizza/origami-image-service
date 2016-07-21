'use strict';

const assert = require('chai').assert;
const mockery = require('mockery');
const sinon = require('sinon');

describe('lib/middleware/map-custom-scheme', () => {
	let express;
	let ImageTransform;
	let mapCustomScheme;

	beforeEach(() => {

		express = require('../../mock/n-express.mock');

		ImageTransform = {
			resolveCustomSchemeUri: sinon.stub()
		};
		mockery.registerMock('../image-transform', ImageTransform);

		mapCustomScheme = require('../../../../lib/middleware/map-custom-scheme');
	});

	it('exports a function', () => {
		assert.isFunction(mapCustomScheme);
	});

	describe('mapCustomScheme(config)', () => {
		let config;
		let middleware;

		beforeEach(() => {
			config = {
				customSchemeStore: 'mock-store'
			};
			middleware = mapCustomScheme(config);
		});

		it('returns a middleware function', () => {
			assert.isFunction(middleware);
		});

		describe('middleware(request, response, next)', () => {
			let next;

			beforeEach(() => {
				next = sinon.spy();
				express.mockRequest.params[0] = 'foo:bar';
				ImageTransform.resolveCustomSchemeUri.returns('http://foo.bar/');
				middleware(express.mockRequest, express.mockResponse, next);
			});

			it('calls `ImageTransform.resolveCustomSchemeUri` with the request param (0) and the configured base URL', () => {
				assert.calledOnce(ImageTransform.resolveCustomSchemeUri);
				assert.calledWithExactly(ImageTransform.resolveCustomSchemeUri, 'foo:bar', 'mock-store');
			});

			it('sets the request param (0) to the returned URL', () => {
				assert.strictEqual(express.mockRequest.params[0], ImageTransform.resolveCustomSchemeUri.firstCall.returnValue);
			});

			it('calls `next` with no error', () => {
				assert.calledOnce(next);
				assert.calledWithExactly(next);
			});

			describe('when `ImageTransform.resolveCustomSchemeUri` throws', () => {
				let resolutionError;

				beforeEach(() => {
					next.reset();
					resolutionError = new Error('resolution error');
					ImageTransform.resolveCustomSchemeUri.throws(resolutionError);
					middleware(express.mockRequest, express.mockResponse, next);
				});

				it('sets the error status to 400', () => {
					assert.strictEqual(resolutionError.status, 400);
				});

				it('calls `next` with the error', () => {
					assert.calledOnce(next);
					assert.calledWithExactly(next, resolutionError);
				});

			});

		});

	});

});
