/** @jsx React.DOM */
define(function(require) {
	var React = require('react');
	var vent = require('./EventBus');

	return React.createClass({
		propTypes: {
			href: React.PropTypes.string.isRequired
		},
		navOnClick: function(e) {
			e.preventDefault();
			vent.trigger('navigateTo', this.props.href)
		},
		render: function() {
			return this.transferPropsTo(
				<a onClick={this.navOnClick}>{this.props.children}</a>
			)
		}
	});

});
