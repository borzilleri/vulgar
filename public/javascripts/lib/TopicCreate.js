/** @jsx React.DOM */
define(function(require) {
	var React = require('react');
	var vent = require('./EventBus');
	var Editor = require('./Editor');

	return React.createClass({
		componentDidMount: function() {
			vent.trigger('page:title', "Create Topic");
		},
		onTopicSubmit: function(contentSource, title) {
			// Submit ajax request
			// On success.. trigger a navigate event.
			// TODO: Obviously replace this with the proper url.
			var href = "/topic/" + title.replace(/ +/g, '-');
			vent.trigger('navigateTo', href);
		},
		render: function() {
			return (
				<Editor className="topic-create-form" focus={true} showTitle={true}
				submitHandler={this.onTopicSubmit}/>
				);
		}

	});
});
