/* global agent */
'use strict';

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

describe('GET /v2/images/raw…', () => {

	describe('/http://… (HTTP scheme unencoded)', () => {
		let request;

		beforeEach(() => {
			request = agent.get(`/v2/images/raw/${testImageUris.http}?source=test`);
		});

		it('responds with a 200 OK status', done => {
			request.expect(200).end(done);
		});

	});

	describe('/https://… (HTTPS scheme unencoded)', () => {
		let request;

		beforeEach(() => {
			request = agent.get(`/v2/images/raw/${testImageUris.https}?source=test`);
		});

		it('responds with a 200 OK status', done => {
			request.expect(200).end(done);
		});

	});

	describe('/http%3A%2F%2F… (HTTP scheme encoded)', () => {
		let request;

		beforeEach(() => {
			request = agent.get(`/v2/images/raw/${encodeURIComponent(testImageUris.http)}?source=test`);
		});

		it('responds with a 200 OK status', done => {
			request.expect(200).end(done);
		});

	});

	describe('/https%3A%2F%2F… (HTTPS scheme encoded)', () => {
		let request;

		beforeEach(() => {
			request = agent.get(`/v2/images/raw/${encodeURIComponent(testImageUris.https)}?source=test`);
		});

		it('responds with a 200 OK status', done => {
			request.expect(200).end(done);
		});

	});

	describe('/ftcms:… (ftcms scheme)', () => {
		let request;

		beforeEach(() => {
			request = agent.get(`/v2/images/raw/${testImageUris.ftcms}?source=test`);
		});

		it('responds with a 501 Not Implemented status', done => {
			request.expect(501).end(done);
		});

	});

	describe('/fticon:… (fticon scheme)', () => {
		let request;

		beforeEach(() => {
			request = agent.get(`/v2/images/raw/${testImageUris.fticon}?source=test`);
		});

		it('responds with a 501 Not Implemented status', done => {
			request.expect(501).end(done);
		});

	});

	describe('/fthead:… (fthead scheme)', () => {
		let request;

		beforeEach(() => {
			request = agent.get(`/v2/images/raw/${testImageUris.fthead}?source=test`);
		});

		it('responds with a 501 Not Implemented status', done => {
			request.expect(501).end(done);
		});

	});

	describe('/ftsocial:… (ftsocial scheme)', () => {
		let request;

		beforeEach(() => {
			request = agent.get(`/v2/images/raw/${testImageUris.ftsocial}?source=test`);
		});

		it('responds with a 501 Not Implemented status', done => {
			request.expect(501).end(done);
		});

	});

	describe('/ftpodcast:… (ftpodcast scheme)', () => {
		let request;

		beforeEach(() => {
			request = agent.get(`/v2/images/raw/${testImageUris.ftpodcast}?source=test`);
		});

		it('responds with a 501 Not Implemented status', done => {
			request.expect(501).end(done);
		});

	});

	describe('/ftlogo:… (ftlogo scheme)', () => {
		let request;

		beforeEach(() => {
			request = agent.get(`/v2/images/raw/${testImageUris.ftlogo}?source=test`);
		});

		it('responds with a 501 Not Implemented status', done => {
			request.expect(501).end(done);
		});

	});

	describe('?imageset=… (image set)', () => {
		let request;

		beforeEach(() => {
			request = agent.get('/v2/images/raw?imageset=%5B%7B%22uri%22%3A%22http%3A%2F%2Fexample.com%2Fimage.jpg%22%2C%22width%22%3A100%7D%5D&source=test');
		});

		it('responds with a 501 Not Implemented status', done => {
			request.expect(501).end(done);
		});

	});

});
