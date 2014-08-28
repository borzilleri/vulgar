/** @jsx React.DOM */
var React = require('react');
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var vent = require('./lib/EventBus');

var Main = require('./lib/Main');
var TopicList = require('./lib/TopicList');
var TopicView = require('./lib/Topic');
var CreateTopic = require('./lib/TopicCreate');
var ProfileView = require('./lib/ProfileView');
var ProfileEdit = require('./lib/ProfileEdit');

$.ajaxSetup({
	converters: {
		'text json': function(text) {
			var result = $.parseJSON(text);
			if( result && result.hasOwnProperty("payload") ) {
				return result.payload;
			}
			return result;
		}
	}
});

$(function() {
	var Router = Backbone.Router.extend({
		routes: {
			'': 'listTopics',
			'topic': 'createTopic',
			'topic/:slug': 'showTopic',
			'profile': 'editProfile',
			'profile/:user': 'viewProfile'
		},
		initialize: function(options) {
			this.listenTo(vent, 'navigateTo', this.navTo);
			this.user = window.Vulgar.user
		},
		navTo: function(url) {
			//TODO: Do we do something if url is actually empty?
			if( url ) {
				this.navigate(url, {trigger: true});
			}
		},
		render: function(component) {
			React.renderComponent(<Main main={component} user={this.user}/>, document.body);
		},
		listTopics: function() {
			this.render(<TopicList />);
		},
		showTopic: function(slug) {
			this.render(<TopicView slug={slug}/>);
		},
		createTopic: function() {
			this.render(<CreateTopic />);
		},
		editProfile: function() {
			this.render(<ProfileEdit user={this.user}/>);
		},
		viewProfile: function() {
			this.render(<ProfileView />)

		}
	});

	var router = new Router();
	Backbone.history.start({pushState: true});
});
