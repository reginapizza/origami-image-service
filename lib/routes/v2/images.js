'use strict';

const httpError = require('http-errors');
const convertToCmsScheme = require('../../middleware/convert-to-cms-scheme');
const createResponseInterceptor = require('../../response-interceptor');
const getCmsUrl = require('../../middleware/get-cms-url');
const getImageMeta = require('../../middleware/get-image-meta');
const mapCustomScheme = require('../../middleware/map-custom-scheme');
const oneWeek = 60 * 60 * 24 * 7;
const processImageRequest = require('../../middleware/process-image-request');
const sourceParam = require('@financial-times/source-param-middleware');

module.exports = app => {

	const requireValidSourceParam = sourceParam({
		verifyUsingCmdb: false
	});

	// Map param numbers to named params
	function mapParams(request, response, next) {
		request.params.imageMode = request.params[0];
		request.params.schemeUrl = request.params[1].replace(/^(%20|\s)+/, '').replace(/(%20|\s)+$/, '');
		if (request.params.schemeUrl.match(/^(https?)(:|%3A)?(\/|%2F)([^/])/)) {
			request.params.schemeUrl = request.params.schemeUrl.replace(/^(https?)(:|%3A)?(\/|%2F)([^/])/, '$1$2//$4');
		}
		request.params.imageUrl = request.params.schemeUrl;
		next();
	}

	// Redirect the old now deleted domain to the correct domain for Live Blogs Images.
	// Conversation in Slack about this -- https://financialtimes.slack.com/archives/CPEETMY49/p1600188171025000
	// System in Biz-Ops -- https://biz-ops.in.ft.com/System/blogs
	function updateOldBlogsLinks(request, response, next) {
		if (request.params.schemeUrl.startsWith('https://blogs.r.ftdata.co.uk/')) {
			request.params.schemeUrl = request.params.schemeUrl.replace('https://blogs.r.ftdata.co.uk', 'https://blogs.ft.com');
			request.params.imageUrl = request.params.schemeUrl;
		} else if (request.params.schemeUrl.startsWith('http://blogs.r.ftdata.co.uk/')) {
			request.params.schemeUrl = request.params.schemeUrl.replace('http://blogs.r.ftdata.co.uk', 'https://blogs.ft.com');
			request.params.imageUrl = request.params.schemeUrl;
		}
		next();
	}

	function mapScheme(request, response, next) {
		request.params.scheme = request.params[2] || 'http'; // We make protocol-relative links use http.
		next();
	}

	// Handle an image request
	function handleImage(request, response, next) {
		switch (request.params.imageMode) {
			case 'raw':
				proxyImage(request, response, next);
				break;
			case 'debug':
				debug(request, response, next);
				break;
			case 'metadata':
				getImageMeta(request, response, next);
				break;
			case 'purge':
				response.redirect(`${request.basePath}v2/purge/url/?url=${encodeURIComponent(request.params.imageUrl)}`);
				break;
			default:
				next();
				break;
		}
	}

	// Proxy image middleware
	function proxyImage(request, response, next) {

		// We have to intercept the response so that we can
		// turn Cloudinary errors into useful HTML error
		// pages – normally they are returned as GIFs. So if
		// the response contains a cloudinary error, we call
		// `next` with it so that the default error handling
		// middleware can take over
		createResponseInterceptor(response, {
			condition: () => {
				return !!response.cloudinaryError;
			},
			end: () => {
				next(response.cloudinaryError);
			}
		});

		// Proxy to Cloudinary
		app.proxy.web(request, response, {
			target: request.appliedTransform,
			imageKey: request.params.imageUrl
		});
	}

	// Debug middleware to log transform information
	function debug(request, response) {
		response.set({
			'Cache-Control': `public, stale-while-revalidate=${oneWeek}, max-age=${oneWeek}`
		});
		response.send({
			transform: request.transform,
			appliedTransform: request.appliedTransform
		});
	}

	function markImageAsImmutable(request, response, next) {
		request.params.immutable = true;
		next();
	}

	// Request with no scheme at all
	app.get(
		/^\/v2\/images\/(raw|debug|metadata|purge)\/$/i, function() {
			const error = httpError(404, 'Image URI must be a string with a valid scheme');
			error.cacheMaxAge = '1y';
			error.skipSentry = true;
			throw error;
		}
	);

	// Image with a custom scheme, matches:
	// /v2/images/raw/fticon:...
	// /v2/images/raw/fthead:...
	// /v2/images/debug/ftlogo:...
	app.get(
		/^\/v2\/images\/(raw|debug|metadata|purge)\/((ftflag|fticon|fthead|ftsocial|ftpodcast|ftlogo|ftbrand|specialisttitle)(-v\d+)?(:|%3A).*)$/i,
		mapParams,
		mapScheme,
		mapCustomScheme(app.ft.options),
		requireValidSourceParam,
		processImageRequest(app.ft.options),
		handleImage
	);

	// Image with an HTTP or HTTPS scheme that should be an ftcms URL, matches:
	// /v2/images/raw/https://com.ft.imagepublish.prod.s3.amazonaws.com/...
	// /v2/images/raw/https://im.ft-static.com/...
	// /v2/images/debug/http://im.ft-static.com/...
	app.get(
		/^\/v2\/images\/(raw|debug|metadata|purge)\/((https?(:|%3A))?(\/|%2F)*(prod-upp-image-read\.ft\.com|com\.ft\.imagepublish|im\.ft-static\.com|d1e00ek4ebabms\.cloudfront\.net\/production|cct-images\.ft\.com\/production).+)$/i,
		mapParams,
		mapScheme,
		markImageAsImmutable,
		convertToCmsScheme(),
		getCmsUrl(app.ft.options),
		requireValidSourceParam,
		processImageRequest(app.ft.options),
		handleImage
	);

	// Image with a custom scheme, matches:
	// /v2/images/raw/ftcms:...
	// /v2/images/debug/ftcms:...
	app.get(
		/^\/v2\/images\/(raw|debug|metadata|purge)\/((ftcms)(:|%3A).*)$/i,
		mapParams,
		mapScheme,
		markImageAsImmutable,
		getCmsUrl(app.ft.options),
		requireValidSourceParam,
		processImageRequest(app.ft.options),
		handleImage
	);

	// Image with an HTTP or HTTPS scheme, matches:
	// /v2/images/raw/https://...
	// /v2/images/raw/http://...
	// /v2/images/debug/http://...
	app.get(
		/^\/v2\/images\/(raw|debug|metadata|purge)\/((https?(:|%3A))?(\/|%2F)*.*)$/i,
		mapParams,
		updateOldBlogsLinks,
		mapScheme,
		requireValidSourceParam,
		processImageRequest(app.ft.options),
		handleImage
	);

};
