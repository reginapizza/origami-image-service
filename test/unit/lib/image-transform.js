'use strict';

const assert = require('chai').assert;
const mockery = require('mockery');
const sinon = require('sinon');

describe('lib/image-transform', () => {
	let colornames;
	let ImageTransform;

	beforeEach(() => {
		colornames = sinon.stub();
		mockery.registerMock('colornames', colornames);

		ImageTransform = require('../../../lib/image-transform');
	});

	it('exports a function', () => {
		assert.isFunction(ImageTransform);
	});

	describe('new ImageTransform(properties)', () => {
		let instance;

		beforeEach(() => {
			instance = new ImageTransform({
				uri: 'http://example.com/'
			});
		});

		it('sets all of the expected properties', () => {
			const properties = {
				uri: 'http://example.com/',
				width: 123,
				height: 456,
				dpr: 2,
				fit: 'scale-down',
				quality: 'lossless',
				format: 'png',
				bgcolor: '00ff00'
			};
			instance = new ImageTransform(properties);
			assert.strictEqual(instance.uri, properties.uri);
			assert.strictEqual(instance.width, properties.width);
			assert.strictEqual(instance.height, properties.height);
			assert.strictEqual(instance.dpr, properties.dpr);
			assert.strictEqual(instance.fit, properties.fit);
			assert.strictEqual(instance.quality, ImageTransform.qualityValueMap[properties.quality]);
			assert.strictEqual(instance.format, properties.format);
			assert.strictEqual(instance.bgcolor, properties.bgcolor);
		});

		describe('.uri', () => {

			beforeEach(() => {
				sinon.stub(ImageTransform, 'sanitizeUriValue').returns('sanitized');
				instance.uri = 'http://foo/';
			});

			it('[set] calls the `sanitizeUriValue` static method with `value`', () => {
				assert.calledOnce(ImageTransform.sanitizeUriValue);
				assert.calledWithExactly(ImageTransform.sanitizeUriValue, 'http://foo/', 'Image URI must be a string with a valid scheme');
			});

			it('[get] returns the sanitized `value`', () => {
				assert.strictEqual(instance.uri, 'sanitized');
			});

		});

		describe('.width', () => {

			beforeEach(() => {
				sinon.stub(ImageTransform, 'sanitizeNumericValue').returns('sanitized');
				instance.width = 123;
			});

			it('[set] calls the `sanitizeNumericValue` static method with `value`', () => {
				assert.calledOnce(ImageTransform.sanitizeNumericValue);
				assert.calledWithExactly(ImageTransform.sanitizeNumericValue, 123, 'Image width must be a positive whole number');
			});

			it('[get] returns the sanitized `value`', () => {
				assert.strictEqual(instance.width, 'sanitized');
			});

		});

		describe('.height', () => {

			beforeEach(() => {
				sinon.stub(ImageTransform, 'sanitizeNumericValue').returns('sanitized');
				instance.height = 123;
			});

			it('[set] calls the `sanitizeNumericValue` static method with `value`', () => {
				assert.calledOnce(ImageTransform.sanitizeNumericValue);
				assert.calledWithExactly(ImageTransform.sanitizeNumericValue, 123, 'Image height must be a positive whole number');
			});

			it('[get] returns the sanitized `value`', () => {
				assert.strictEqual(instance.height, 'sanitized');
			});

		});

		describe('.dpr', () => {

			beforeEach(() => {
				sinon.stub(ImageTransform, 'sanitizeNumericValue').returns('sanitized');
				instance.dpr = 2;
			});

			it('[set] calls the `sanitizeNumericValue` static method with `value`', () => {
				assert.calledOnce(ImageTransform.sanitizeNumericValue);
				assert.calledWithExactly(ImageTransform.sanitizeNumericValue, 2, 'Image DPR must be a positive whole number');
			});

			it('[get] returns the sanitized `value`', () => {
				assert.strictEqual(instance.dpr, 'sanitized');
			});

		});

		describe('.fit', () => {

			beforeEach(() => {
				sinon.stub(ImageTransform, 'sanitizeEnumerableValue').returns('sanitized');
				instance.fit = 'foo';
			});

			it('[set] calls the `sanitizeEnumerableValue` static method with `value`', () => {
				assert.calledOnce(ImageTransform.sanitizeEnumerableValue);
				assert.calledWithExactly(
					ImageTransform.sanitizeEnumerableValue,
					'foo',
					ImageTransform.validFits,
					`Image fit must be one of ${ImageTransform.validFits.join(', ')}`
				);
			});

			it('[set] defaults `value` to "cover"', () => {
				instance.fit = undefined;
				assert.calledWith(ImageTransform.sanitizeEnumerableValue, 'cover');
			});

			it('[get] returns the sanitized `value`', () => {
				assert.strictEqual(instance.fit, 'sanitized');
			});

		});

		describe('.format', () => {

			beforeEach(() => {
				sinon.stub(ImageTransform, 'sanitizeEnumerableValue').returns('sanitized');
				instance.format = 'foo';
			});

			it('[set] calls the `sanitizeEnumerableValue` static method with `value`', () => {
				assert.calledOnce(ImageTransform.sanitizeEnumerableValue);
				assert.calledWithExactly(
					ImageTransform.sanitizeEnumerableValue,
					'foo',
					ImageTransform.validFormats,
					`Image format must be one of ${ImageTransform.validFormats.join(', ')}`
				);
			});

			it('[set] defaults `value` to "auto"', () => {
				instance.format = undefined;
				assert.calledWith(ImageTransform.sanitizeEnumerableValue, 'auto');
			});

			it('[get] returns the sanitized `value`', () => {
				assert.strictEqual(instance.format, 'sanitized');
			});

			describe('when `value` is "auto"', () => {

				it('[get] returns "jpg"', () => {
					ImageTransform.sanitizeEnumerableValue.restore();
					instance.quality = undefined;
					instance.format = undefined;
					assert.strictEqual(instance.format, 'jpg');
				});

			});

			describe('when `value` is "auto" and the `quality` property is set to "lossless"', () => {

				it('[get] returns "png"', () => {
					ImageTransform.sanitizeEnumerableValue.restore();
					instance.quality = 'lossless';
					instance.format = undefined;
					assert.strictEqual(instance.format, 'png');
				});

			});

		});

		describe('.quality', () => {

			beforeEach(() => {
				sinon.stub(ImageTransform, 'sanitizeEnumerableValue').returns('sanitized');
				ImageTransform.qualityValueMap.sanitized = 123;
				instance.quality = 'foo';
			});

			it('[set] calls the `sanitizeEnumerableValue` static method with `value`', () => {
				assert.calledOnce(ImageTransform.sanitizeEnumerableValue);
				assert.calledWithExactly(
					ImageTransform.sanitizeEnumerableValue,
					'foo',
					ImageTransform.validQualities,
					`Image quality must be one of ${ImageTransform.validQualities.join(', ')}`
				);
			});

			it('[set] defaults `value` to "medium"', () => {
				instance.quality = undefined;
				assert.calledWith(ImageTransform.sanitizeEnumerableValue, 'medium');
			});

			it('[get] returns a numeric representation of the sanitized `value`', () => {
				assert.strictEqual(instance.quality, 123);
			});

		});

		describe('.bgcolor', () => {

			beforeEach(() => {
				sinon.stub(ImageTransform, 'sanitizeColorValue').returns('sanitized');
				instance.bgcolor = 'foo';
			});

			it('[set] calls the `sanitizeColorValue` static method with `value`', () => {
				assert.calledOnce(ImageTransform.sanitizeColorValue);
				assert.calledWithExactly(
					ImageTransform.sanitizeColorValue,
					'foo',
					'Image bgcolor must be a valid hex code or color name'
				);
			});

			it('[get] returns the sanitized `value`', () => {
				assert.strictEqual(instance.bgcolor, 'sanitized');
			});

		});

		it('has a `toJSON` method', () => {
			assert.isFunction(instance.toJSON);
		});

		describe('.toJSON()', () => {

			it('returns a JSON representation of the object properties', () => {
				const properties = {
					uri: 'http://example.com/',
					width: 123,
					height: 456,
					dpr: 2,
					fit: 'scale-down',
					quality: 'lossless',
					format: 'png',
					bgcolor: '00ff00'
				};
				instance = new ImageTransform(properties);
				properties.quality = 100;
				assert.deepEqual(instance.toJSON(), properties);
			});

		});

		it('has an `inspect` method', () => {
			assert.isFunction(instance.inspect);
		});

		describe('.inspect()', () => {

			it('returns the result of `.toJSON()`', () => {
				const json = {};
				instance = new ImageTransform({
					uri: 'http://example.com/'
				});
				sinon.stub(instance, 'toJSON').returns(json);
				const returnValue = instance.inspect();
				assert.calledOnce(instance.toJSON);
				assert.strictEqual(returnValue, json);
			});

		});

	});

	it('has a `sanitizeUriValue` static method', () => {
		assert.isFunction(ImageTransform.sanitizeUriValue);
	});

	describe('.sanitizeUriValue(value)', () => {

		describe('when `value` is a string with a valid scheme', () => {

			it('returns `value`', () => {
				const testSources = [
					'ftcms:foo',
					'fthead:foo',
					'fticon:foo',
					'ftlogo:foo',
					'ftpodcast:foo',
					'ftsocial:foo',
					'http://foo/',
					'https://foo/'
				];
				testSources.forEach(source => {
					assert.strictEqual(ImageTransform.sanitizeUriValue(source), source);
				});
			});

		});

		describe('when `value` is URL-encoded', () => {

			it('returns `value` decoded', () => {
				assert.strictEqual(ImageTransform.sanitizeUriValue('http%3A%2F%2Ffoo%2F'), 'http://foo/');
			});

		});

		describe('when `value` is a string with an invalid scheme', () => {

			it('throws an error', () => {
				assert.throws(() => ImageTransform.sanitizeUriValue('notascheme:foo'), 'Expected a URI string with a valid scheme');
			});

		});

		describe('when `value` is not a string', () => {

			it('throws an error', () => {
				assert.throws(() => ImageTransform.sanitizeUriValue(), 'Expected a URI string with a valid scheme');
				assert.throws(() => ImageTransform.sanitizeUriValue(123), 'Expected a URI string with a valid scheme');
				assert.throws(() => ImageTransform.sanitizeUriValue(null), 'Expected a URI string with a valid scheme');
				assert.throws(() => ImageTransform.sanitizeUriValue({}), 'Expected a URI string with a valid scheme');
			});

		});

		describe('when an error is thrown', () => {

			it('the message can be set with a second parameter', () => {
				assert.throws(() => ImageTransform.sanitizeUriValue(null, 'foo'), 'foo');
			});

		});

	});

	it('has a `sanitizeNumericValue` static method', () => {
		assert.isFunction(ImageTransform.sanitizeNumericValue);
	});

	describe('.sanitizeNumericValue(value)', () => {

		describe('when `value` is a whole positive number', () => {

			it('returns `value`', () => {
				assert.strictEqual(ImageTransform.sanitizeNumericValue(123), 123);
			});

		});

		describe('when `value` is a numeric string', () => {

			it('returns `value` converted into a number', () => {
				assert.strictEqual(ImageTransform.sanitizeNumericValue('123'), 123);
			});

		});

		describe('when `value` is `undefined`', () => {

			it('returns `undefined`', () => {
				assert.isUndefined(ImageTransform.sanitizeNumericValue());
			});

		});

		describe('when `value` is smaller than `1`', () => {

			it('throws an error', () => {
				assert.throws(() => ImageTransform.sanitizeNumericValue(0), 'Expected a whole positive number');
				assert.throws(() => ImageTransform.sanitizeNumericValue(-1), 'Expected a whole positive number');
			});

		});

		describe('when `value` is not a whole number', () => {

			it('throws an error', () => {
				assert.throws(() => ImageTransform.sanitizeNumericValue(1.5), 'Expected a whole positive number');
			});

		});

		describe('when `value` is not a number, numeric string, or `undefined`', () => {

			it('throws an error', () => {
				assert.throws(() => ImageTransform.sanitizeNumericValue('foo'), 'Expected a whole positive number');
				assert.throws(() => ImageTransform.sanitizeNumericValue(null), 'Expected a whole positive number');
				assert.throws(() => ImageTransform.sanitizeNumericValue({}), 'Expected a whole positive number');
			});

		});

		describe('when an error is thrown', () => {

			it('the message can be set with a second parameter', () => {
				assert.throws(() => ImageTransform.sanitizeNumericValue(null, 'foo'), 'foo');
			});

		});

	});

	it('has a `sanitizeEnumerableValue` static method', () => {
		assert.isFunction(ImageTransform.sanitizeEnumerableValue);
	});

	describe('.sanitizeEnumerableValue(value, allowedValues)', () => {

		describe('when `value` is an allowed value', () => {

			it('returns `value`', () => {
				assert.strictEqual(ImageTransform.sanitizeEnumerableValue('foo', ['foo']), 'foo');
			});

		});

		describe('when `value` is `undefined`', () => {

			it('returns `undefined`', () => {
				assert.isUndefined(ImageTransform.sanitizeEnumerableValue());
			});

		});

		describe('when `value` is not in `allowedValues`', () => {

			it('throws an error', () => {
				assert.throws(() => ImageTransform.sanitizeEnumerableValue('foo', ['bar', 'baz']), 'Expected one of bar, baz');
			});

		});

		describe('when an error is thrown', () => {

			it('the message can be set with a third parameter', () => {
				assert.throws(() => ImageTransform.sanitizeEnumerableValue('foo', ['bar', 'baz'], 'qux'), 'qux');
			});

		});

	});

	it('has a `sanitizeColorValue` static method', () => {
		assert.isFunction(ImageTransform.sanitizeColorValue);
	});

	describe('.sanitizeColorValue(value)', () => {

		describe('when `value` is a valid hex code', () => {

			it('returns `value`', () => {
				assert.strictEqual(ImageTransform.sanitizeColorValue('ff0000'), 'ff0000');
			});

		});

		describe('when `value` is a short hex code', () => {

			it('returns the full hex code', () => {
				assert.strictEqual(ImageTransform.sanitizeColorValue('0f0'), '00ff00');
			});

		});

		describe('when `value` is "transparent"', () => {

			it('returns "ffffff"', () => {
				assert.strictEqual(ImageTransform.sanitizeColorValue('transparent'), 'ffffff');
			});

		});

		describe('when `value` is a named color', () => {

			it('returns the full hex code', () => {
				colornames.withArgs('red').returns('#ff0000');
				assert.strictEqual(ImageTransform.sanitizeColorValue('red'), 'ff0000');
			});

		});

		describe('when `value` is a hex code including the preceeding hash', () => {

			it('returns `value` with the hash removed', () => {
				assert.strictEqual(ImageTransform.sanitizeColorValue('#ff0000'), 'ff0000');
			});

		});

		describe('when `value` is `undefined`', () => {

			it('returns `undefined`', () => {
				assert.isUndefined(ImageTransform.sanitizeColorValue());
			});

		});

		describe('when `value` is not a valid hex color or named color', () => {

			it('throws an error', () => {
				assert.throws(() => ImageTransform.sanitizeColorValue('0f'), 'Expected a valid color');
				assert.throws(() => ImageTransform.sanitizeColorValue('ff00000'), 'Expected a valid color');
				assert.throws(() => ImageTransform.sanitizeColorValue('hello'), 'Expected a valid color');
			});

		});

		describe('when an error is thrown', () => {

			it('the message can be set with a third parameter', () => {
				assert.throws(() => ImageTransform.sanitizeColorValue('0f', 'foo'), 'foo');
			});

		});

	});

	it('has a `validFits` static property', () => {
		assert.deepEqual(ImageTransform.validFits, [
			'contain',
			'cover',
			'scale-down'
		]);
	});

	it('has a `validFormats` static property', () => {
		assert.deepEqual(ImageTransform.validFormats, [
			'auto',
			'jpg',
			'png',
			'svg'
		]);
	});

	it('has a `validQualities` static property', () => {
		assert.deepEqual(ImageTransform.validQualities, [
			'lowest',
			'low',
			'medium',
			'high',
			'highest',
			'lossless'
		]);
	});

	it('has a `validUriSchemes` static property', () => {
		assert.deepEqual(ImageTransform.validUriSchemes, [
			'ftcms',
			'fthead',
			'fticon',
			'ftlogo',
			'ftpodcast',
			'ftsocial',
			'http',
			'https'
		]);
	});

	it('has a `qualityValueMap` static property', () => {
		assert.deepEqual(ImageTransform.qualityValueMap, {
			lowest: 30,
			low: 50,
			medium: 70,
			high: 80,
			highest: 90,
			lossless: 100
		});
	});

});
