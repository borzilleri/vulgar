/** @jsx React.DOM */
define(function(require) {
	var _ = require('underscore');
	var React = require('react');
	var marked = require('marked');
	var vent = require('./EventBus');
	var Editor = require('./Editor');

	var TopicTitle = React.createClass({
		render: function() {
			return (
				<div className="post-topic-title">
					<h1>{this.props.title}
						<a href="#" className="post-edit-title pull-right">
							<i className="fa fa-edit"></i>
						</a>
					</h1>
				</div>
				);
		}
	});

	var EditPostButton = React.createClass({
		render: function() {
			var cx = React.addons.classSet;
			var classes = cx({
				'fa': true,
				'fa-edit': !this.props.editMode,
				'fa-ban': this.props.editMode
			});
			return this.transferPropsTo(<a className="post-edit">
				<i className={classes}/>
			</a>);
		}
	});

	var DeletePostButton = React.createClass({
		getInitialState: function() {
			return {
				deleteInitiated: false
			};
		},
		handleDelete: function() {
			vent.trigger('post:delete', this.props.key);
		},
		handleIconClick: function() {
			this.setState({
				deleteInitiated: !this.state.deleteInitiated
			});
		},
		render: function() {
			var cx = React.addons.classSet;
			var iconClasses = cx({
				'fa text-danger': true,
				'fa-ban': this.state.deleteInitiated,
				'fa-trash-o': !this.state.deleteInitiated
			});
			var deleteButton = this.state.deleteInitiated ?
				<a onClick={this.handleDelete} className="btn btn-danger btn-xs">Delete</a> : null;
			return (<span>{deleteButton}
				<a className="post-delete" onClick={this.handleIconClick}>
					<i className={iconClasses} />
				</a>
			</span>);
		}
	});

	var PostBody = React.createClass({
		render: function() {
			return (<span dangerouslySetInnerHTML={{__html: this.props.children}}/>);
		}
	});

	var ReplyItem = React.createClass({
		getInitialState: function() {
			return {
				body: this.props.post.body,
				modifiedBy: this.props.post.modifiedBy,
				modifiedOn: this.props.post.modifiedOn,
				editMode: false
			}
		},
		onEditSubmit: function() {
			var result = this.editPostHandler();
			// Handle error.
		},
		onEditPost: function() {
			this.setState({
				editMode: !this.state.editMode
			});
		},
		onDeletePost: function() {
			//TODO: How do I handle this?
			console.log("deleting post");
		},
		render: function() {
			// We're in "editing mode" or "body mode"
			var bodyEl = this.state.editMode ?
				<Editor className="post-body" focus={true} submitHandler={this.onEditSubmit} /> :
				<PostBody className="post-body">{this.state.body}</PostBody>;

			return (
				<div className="post-item">
					<div className="post-topline">
						<span className="post-author">{this.props.post.author}</span>
						<span className="post-date">{this.props.createdOn}</span>
						<span className="post-actions pull-right">
							<EditPostButton onClick={this.onEditPost} editMode={this.state.editMode} />
							<DeletePostButton key={"post_" + this.props.key} />
						</span>
					</div>
					<div className="post-avatar pull-right">
						<img src="//placehold.it/75" />
					</div>
					{bodyEl}
					<div className="post-edited-line">last edited {this.state.modifiedOn} by {this.state.modifiedBy}</div>
				</div>
				);
		}
	});

	var ReplyList = React.createClass({
		getDefaultProps: function() {
			return {
				editPostHandler: function() {

				}
			}
		},
		render: function() {
			var self = this;
			var replies = _(this.props.posts).map(function(p, i) {
				return <ReplyItem key={i} post={p} editPostHandler={self.props.editPostHandler} />
			});
			return (
				<ul className="post-list">{replies}</ul>
				);
		}
	});

	return React.createClass({
		getDefaultProps: function() {
			return {
				slug: "error: missing title"
			}
		},
		getInitialState: function() {
			return {
				posts: {}
			}
		},
		componentDidMount: function() {
			// Load Topic by Slug from API.
			// todo: remove this placeholder code.
			var posts = [];
			for( var i = 0; i < 10; i++ ) {
				posts[i] = {
					author: 'Post Author ' + i,
					createdOn: new Date().getMilliseconds(),
					modifiedBy: "Modifying User " + i,
					modifiedOn: new Date().getMilliseconds(),
					body: 'Post Body ' + i
				}
			}
			this.setState({posts: posts});
			vent.trigger('page:title', this.props.slug);
			vent.on('post:delete', this.deletePostHandler, this);
		},
		replySubmitHandler: function(content) {
			// This will either be an update, or a new reply <- check the id.
			//
			// Submit AJAX request to create/update ->
			// On response -> add reply to state (either replace old reply, or
			// add to end.

			var newPost = {
				author: 'New Post Author',
				body: marked(content)
			};
			var newState = React.addons.update(this.state, {
				posts: {
					$push: [newPost]
				}
			});
			this.setState(newState);
			return true;
		},
		deletePostHandler: function(replyIndex) {
			console.log("deleting post: " + replyIndex);
			// Send DELETE request.
			// update State
			var newState = React.addons.update(this.state, {
				posts: {
					$splice: [
						[replyIndex, 1]
					]
				}
			});
			this.setState(newState);
		},
		render: function() {
			return (
				<div>
					<ReplyList posts={this.state.posts} editPostHandler={this.replySubmitHandler}/>
					<Editor className="post-reply-form" submitHandler={this.replySubmitHandler}/>
				</div>
				);
		}
	});
});
