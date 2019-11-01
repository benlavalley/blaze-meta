Package.describe({
	summary: 'Blaze-meta makes it super simple to manage SEO data.',
	version: '0.3.4',
	git: 'https://github.com/yasinuslu/blaze-meta.git',
	name: 'yasinuslu:blaze-meta',
});

Package.onUse(function (api) {
	api.use('ecmascript', 'client');
	api.use('underscore', 'client');
	api.use('tracker', 'client');
	api.use('reactive-dict', 'client');
	api.use('ui', 'client');
	api.use('templating', 'client');
	api.mainModule('lib/meta.js', 'client');
	api.versionsFrom('METEOR@1.8.1');
});

Package.onTest(function (api) {
	api.use(['yasinuslu:blaze-meta', 'tinytest', 'test-helpers', 'underscore', 'jquery', 'ecmascript'], 'client');

	api.addFiles('tests/test.js', 'client');
});
