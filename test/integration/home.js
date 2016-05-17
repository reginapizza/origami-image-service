/* global agent */
'use strict';

describe('GET /', () => {
	let request;

	beforeEach(() => {
		request = agent.get('/');
	});

	it('responds with a 301 status', done => {
		request.expect(301).end(done);
	});

	it('redirects the request to the v1 documentation page', done => {
		request.expect('Location', '/v1/').end(done);
	});

});
