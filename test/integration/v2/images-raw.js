'use strict';

const itRespondsWithContentType = require('../helpers/it-responds-with-content-type');
const itRespondsWithStatus = require('../helpers/it-responds-with-status');
const setupRequest = require('../helpers/setup-request');

const testImageUris = {
	ftcms: 'ftcms:6c5a2f8c-18ca-4afa-80ff-7d56e41172b1',
	fthead: 'fthead:martin-wolf',
	fticon: 'fticon:brand-ft',
	ftlogo: 'ftlogo:brand-ft',
	ftpodcast: 'ftpodcast:arts',
	ftsocial: 'ftsocial:whatsapp',
	http: 'http://im.ft-static.com/content/images/a60ae24b-b87f-439c-bf1b-6e54946b4cf2.img',
	https: 'https://im.ft-static.com/content/images/a60ae24b-b87f-439c-bf1b-6e54946b4cf2.img'
};

describe('GET /v2/images/raw…', function() {

	describe('/http://… (HTTP scheme unencoded)', function() {
		setupRequest('GET', `/v2/images/raw/${testImageUris.http}?source=test`);
		itRespondsWithStatus(200);
	});

	describe('/https://… (HTTPS scheme unencoded)', function() {
		setupRequest('GET', `/v2/images/raw/${testImageUris.https}?source=test`);
		itRespondsWithStatus(200);
	});

	describe('/http%3A%2F%2F… (HTTP scheme encoded)', function() {
		setupRequest('GET', `/v2/images/raw/${encodeURIComponent(testImageUris.http)}?source=test`);
		itRespondsWithStatus(200);
	});

	describe('/https%3A%2F%2F… (HTTPS scheme encoded)', function() {
		setupRequest('GET', `/v2/images/raw/${encodeURIComponent(testImageUris.https)}?source=test`);
		itRespondsWithStatus(200);
	});

	describe('/ftcms:… (ftcms scheme)', function() {
		setupRequest('GET', `/v2/images/raw/${testImageUris.ftcms}?source=test`);
		itRespondsWithStatus(501);
	});

	describe('/fticon:… (fticon scheme)', function() {
		setupRequest('GET', `/v2/images/raw/${testImageUris.fticon}?source=test`);
		itRespondsWithStatus(501);
	});

	describe('/fthead:… (fthead scheme)', function() {
		setupRequest('GET', `/v2/images/raw/${testImageUris.fthead}?source=test`);
		itRespondsWithStatus(501);
	});

	describe('/ftsocial:… (ftsocial scheme)', function() {
		setupRequest('GET', `/v2/images/raw/${testImageUris.ftsocial}?source=test`);
		itRespondsWithStatus(501);
	});

	describe('/ftpodcast:… (ftpodcast scheme)', function() {
		setupRequest('GET', `/v2/images/raw/${testImageUris.ftpodcast}?source=test`);
		itRespondsWithStatus(501);
	});

	describe('/ftlogo:… (ftlogo scheme)', function() {
		setupRequest('GET', `/v2/images/raw/${testImageUris.ftlogo}?source=test`);
		itRespondsWithStatus(501);
	});

	describe('?imageset=… (image set)', function() {
		setupRequest('GET', '/v2/images/raw?imageset=%5B%7B%22uri%22%3A%22http%3A%2F%2Fexample.com%2Fimage.jpg%22%2C%22width%22%3A100%7D%5D&source=test');
		itRespondsWithStatus(501);
	});

	describe('without a `source` query parameter', function() {

		setupRequest('GET', `/v2/images/raw/${testImageUris.http}`);
		itRespondsWithStatus(400);
		itRespondsWithContentType('text/html');

		it('responds with a descriptive error message', function(done) {
			this.request.expect(/the source parameter is required/i).end(done);
		});

	});

	describe('when a transform query parameter is invalid', function() {

		setupRequest('GET', `/v2/images/raw/${testImageUris.http}?source=test&bgcolor=f0`);
		itRespondsWithStatus(400);
		itRespondsWithContentType('text/html');

		it('responds with a descriptive error message', function(done) {
			this.request.expect(/image bgcolor must be a valid hex code or color name/i).end(done);
		});

	});

});
