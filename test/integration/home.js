'use strict';

const itRespondsWithStatus = require('./helpers/it-responds-with-status');
const setupRequest = require('./helpers/setup-request');

describe('GET /', function() {

	setupRequest('GET', '/');
	itRespondsWithStatus(301);

	it('redirects the request to the v1 documentation page', function(done) {
		this.request.expect('Location', '/v1/').end(done);
	});

});
