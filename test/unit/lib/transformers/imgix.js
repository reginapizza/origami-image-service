'use strict';

const assert = require('chai').assert;

describe('lib/transformers/imgix', () => {
	let imgixTransform;
	let ImageTransform;

	beforeEach(() => {
		ImageTransform = require('../../../../lib/image-transform');
		imgixTransform = require('../../../../lib/transformers/imgix');
	});

	it('exports a function', () => {
		assert.isFunction(imgixTransform);
	});

	describe('imgixTransform(transform, options)', () => {
		let imgixUrl;
		let options;
		let transform;

		beforeEach(() => {
			transform = new ImageTransform({
				uri: 'http://example.com/'
			});
			options = {
				imgixSourceName: 'foo-source'
			};
			imgixUrl = imgixTransform(transform, options);
		});

		it('returns an Imgix fetch URL', () => {
			assert.strictEqual(imgixUrl, 'https://foo-source.imgix.net/http%3A%2F%2Fexample.com%2F?fm=jpg&quality=70&fit=crop');
		});

		describe('when `transform` has a `width` property', () => {

			beforeEach(() => {
				transform.width = 123;
				imgixUrl = imgixTransform(transform, options);
			});

			it('returns the expected Imgix fetch URL', () => {
				assert.strictEqual(imgixUrl, 'https://foo-source.imgix.net/http%3A%2F%2Fexample.com%2F?fm=jpg&quality=70&fit=crop&w=123');
			});

		});

		describe('when `transform` has a `height` property', () => {

			beforeEach(() => {
				transform.height = 123;
				imgixUrl = imgixTransform(transform, options);
			});

			it('returns the expected Imgix fetch URL', () => {
				assert.strictEqual(imgixUrl, 'https://foo-source.imgix.net/http%3A%2F%2Fexample.com%2F?fm=jpg&quality=70&fit=crop&h=123');
			});

		});

		describe('when `transform` has a `dpr` property', () => {

			beforeEach(() => {
				transform.dpr = 2;
				imgixUrl = imgixTransform(transform, options);
			});

			it('returns the expected Imgix fetch URL', () => {
				assert.strictEqual(imgixUrl, 'https://foo-source.imgix.net/http%3A%2F%2Fexample.com%2F?fm=jpg&quality=70&fit=crop&dpr=2');
			});

		});

		describe('when `transform` has a `fit` property set to `contain`', () => {

			beforeEach(() => {
				transform.fit = 'contain';
				imgixUrl = imgixTransform(transform, options);
			});

			it('returns the expected Imgix fetch URL', () => {
				assert.strictEqual(imgixUrl, 'https://foo-source.imgix.net/http%3A%2F%2Fexample.com%2F?fm=jpg&quality=70&fit=clip');
			});

		});

		describe('when `transform` has a `fit` property set to `cover`', () => {

			beforeEach(() => {
				transform.fit = 'cover';
				imgixUrl = imgixTransform(transform, options);
			});

			it('returns the expected Imgix fetch URL', () => {
				assert.strictEqual(imgixUrl, 'https://foo-source.imgix.net/http%3A%2F%2Fexample.com%2F?fm=jpg&quality=70&fit=crop');
			});

		});

		describe('when `transform` has a `fit` property set to `scale-down`', () => {

			beforeEach(() => {
				transform.fit = 'scale-down';
				imgixUrl = imgixTransform(transform, options);
			});

			it('returns the expected Imgix fetch URL', () => {
				assert.strictEqual(imgixUrl, 'https://foo-source.imgix.net/http%3A%2F%2Fexample.com%2F?fm=jpg&quality=70&fit=max');
			});

		});

		describe('when `transform` has a `format` property', () => {

			beforeEach(() => {
				transform.format = 'png';
				imgixUrl = imgixTransform(transform, options);
			});

			it('returns the expected Imgix fetch URL', () => {
				assert.strictEqual(imgixUrl, 'https://foo-source.imgix.net/http%3A%2F%2Fexample.com%2F?fm=png&quality=70&fit=crop');
			});

		});

		describe('when `transform` has a `quality` property', () => {

			beforeEach(() => {
				transform.quality = 'lowest';
				imgixUrl = imgixTransform(transform, options);
			});

			it('returns the expected Imgix fetch URL', () => {
				assert.strictEqual(imgixUrl, 'https://foo-source.imgix.net/http%3A%2F%2Fexample.com%2F?fm=jpg&quality=30&fit=crop');
			});

		});

		describe('when `transform` has a `bgcolor` property', () => {

			beforeEach(() => {
				transform.bgcolor = 'ff0000';
				imgixUrl = imgixTransform(transform, options);
			});

			it('returns the expected Imgix fetch URL', () => {
				assert.strictEqual(imgixUrl, 'https://foo-source.imgix.net/http%3A%2F%2Fexample.com%2F?fm=jpg&quality=70&fit=crop&bg=ff0000');
			});

		});

		describe('when `transform` is not an instance of ImageTransform', () => {

			it('throws an error', () => {
				assert.throws(() => imgixTransform('foo'), 'Invalid transform argument, expected an ImageTransform object');
			});

		});

	});

});
