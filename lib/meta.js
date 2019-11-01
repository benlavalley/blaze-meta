import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Blaze } from 'meteor/blaze';
import { HTML } from 'meteor/htmljs';

import './meta.html';

export const Meta = {
	options: {
		title: 'Default Title',
		suffix: 'Suffix for title',
		separator: ' | ',
	},

	dict: new ReactiveDict(),

	converters: {
		title(title) {
			if (_.isFunction(title)) {
				title = title();
			}

			if (_.isEmpty(title)) {
				return Meta.options.title || '';
			}

			if (!_.isEmpty(Meta.options.suffix)) {
				title = title + Meta.options.separator + Meta.options.suffix;
			}

			return title;
		},

		meta(property, content) {
			const options = _.isObject(property) ? property : {
				name: 'property',
				property,
				content,
			};

			return options;
		},
	},

	init() {
		Meta.setTitle('');
	},

	config(opts) {
		_.extend(Meta.options, opts.options);
		_.extend(Meta.converters, opts.converters);
	},

	setVar(key, value) {
		Meta.dict.set(key, value);
	},

	getVar(key) {
		return Meta.dict.get(key);
	},

	set(property, content) {
		let properties = property;
		if (!_.isArray(property)) {
			properties = new Array(property);
		}

		properties.forEach(function (property) {
			let meta;
			Tracker.nonreactive(function () {
				meta = Meta.getVar('tag') || {};
			});
			const m = Meta.converters.meta(property, content);
			meta[m.property] = m;
			Meta.setVar('tag', meta);
		});
	},

	unset(property) {
		let meta;
		Tracker.nonreactive(function () {
			meta = Meta.getVar('tag') || {};
		});
		const m = Meta.converters.meta(property);
		delete meta[m.property];
		Meta.setVar('tag', meta);
	},

	unsetAll() {
		_.each(Meta.arr(), function (item) {
			Meta.unset(item.property);
		});
	},

	setTitle(title) {
		Meta.setVar('title', Meta.converters.title(title));
	},

	getTitle() {
		return Meta.getVar('title');
	},

	arr() {
		const meta = Meta.getVar('tag');
		return _.toArray(meta);
	},

	hash() {
		return Meta.getVar('tag');
	},
};

Template.MetaTags.helpers({ // eslint-disable-line meteor/template-names

	tags() {
		return Meta.arr();
	},

	_MetaTag() {
		const attrs = {};
		attrs[this.name] = this.property;
		attrs.content = this.content;
		return Blaze.Template(function () {
			return HTML.META(attrs);
		});
	},
});

Meteor.startup(function () {
	Meta.init();

	Blaze.render(Template.MetaTags, document.head);

	Tracker.autorun(function () {
		document.title = Meta.getTitle();
	});
});
