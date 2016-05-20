'use strict';

module.exports = itRespondsWithContentType;

function itRespondsWithContentType(contentType) {
	it(`responds with a Content-Type of "${contentType}"`, function(done) {
		this.request.expect('Content-Type', `${contentType}; charset=utf-8`).end(done);
	});
}
