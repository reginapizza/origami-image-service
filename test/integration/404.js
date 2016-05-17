/* global agent */
'use strict';

describe('GET /404', () => {
	let request;

	beforeEach(() => {
		request = agent.get('/404');
	});

	it('responds with a 404 status', done => {
		request.expect(404).end(done);
	});

	it('responds with HTML', done => {
		request.expect('Content-Type', 'text/html; charset=utf-8').end(done);
	});

});
