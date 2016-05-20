'use strict';

module.exports = setupRequest;

function setupRequest(method, endpoint) {
	method = method.toLowerCase();
	beforeEach(function() {
		this.request = this.agent[method](endpoint);
	});
}
