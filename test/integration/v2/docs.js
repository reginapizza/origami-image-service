/* global agent */
'use strict';

describe('GET /v2/', () => {
	let request;

	beforeEach(() => {
		request = agent.get('/v2/');
	});

	it('responds with a 200 status', done => {
		request.expect(200).end(done);
	});

	it('responds with HTML', done => {
		request.expect('Content-Type', 'text/html; charset=utf-8').end(done);
	});

});
