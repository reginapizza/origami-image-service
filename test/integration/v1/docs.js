/* global agent */
'use strict';

describe('GET /v1/', () => {
	let request;

	beforeEach(() => {
		request = agent.get('/v1/');
	});

	it('responds with a 410 Gone status', done => {
		request.expect(410).end(done);
	});

	it('responds with HTML', done => {
		request.expect('Content-Type', 'text/html; charset=utf-8').end(done);
	});

});
