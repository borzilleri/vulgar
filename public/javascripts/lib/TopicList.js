/** @jsx React.DOM */
define(function(require) {
	var React = require('react');
	var vent = require('./EventBus');

	var NavLink = require('./NavLink');

	var TopicListItem = React.createClass({
		render: function() {
			var topicUrl = "/topic/" + this.props.slug;
			return (
				<li>
					<div className="topic-iconline pull-right">
						<i className="fa fa-eye fa-2x topic-watched"></i>
						<i className="fa fa-star fa-2x topic-saved"></i>
					</div>
					<div className="topic-titleline">
						<i className="fa fa-dot-circle-o topic-unread"></i>
						<NavLink className="topic-title" href={topicUrl}>{this.props.title}</NavLink>
					</div>
					<div className="topic-dateline text-muted">
					updated on: {this.props.date.toTimeString()}
					</div>
				</li>
				);
		}
	});

	return React.createClass({
		componentDidMount: function() {
			vent.trigger('page:title', "All Discussions");
		},
		render: function() {
			var topics = [];
			for( var i = 0; i < 5; i++ ) {
				var title = "topic" + i;
				topics[i] = <TopicListItem key={i}
				title={title}
				slug={title}
				date={new Date()}/>
			}
			return (<ul className="topic-list">{topics}</ul>);
		},
		openModal: function() {
			this.refs.modal.open();
		},
		closeModal: function() {
			this.refs.modal.close();
		}
	});
});
