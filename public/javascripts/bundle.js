/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/javascripts/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */
	var React = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var _ = __webpack_require__(3);
	var Backbone = __webpack_require__(4);
	var vent = __webpack_require__(5);
	
	var Main = __webpack_require__(6);
	var TopicList = __webpack_require__(7);
	var TopicView = __webpack_require__(8);
	var CreateTopic = __webpack_require__(9);
	var ProfileView = __webpack_require__(10);
	var ProfileEdit = __webpack_require__(11);
	
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
			},
			navTo: function(url) {
				//TODO: Do we do something if url is actually empty?
				if( url ) {
					this.navigate(url, {trigger: true});
				}
			},
			render: function(component) {
				React.renderComponent(Main({main: component}), document.body);
			},
			listTopics: function() {
				this.render(TopicList(null));
			},
			showTopic: function(slug) {
				this.render(TopicView({slug: slug}));
			},
			createTopic: function() {
				this.render(CreateTopic(null));
			},
			editProfile: function() {
				this.render(ProfileEdit(null));
			},
			viewProfile: function() {
				this.render(ProfileView(null))
	
			}
		});
	
		var router = new Router();
		Backbone.history.start({pushState: true});
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = jQuery;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = _;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Backbone;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
		var _ = __webpack_require__(3);
		var Backbone = __webpack_require__(4);
	
		return _.extend({}, Backbone.Events);
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @jsx React.DOM */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
		var $ = __webpack_require__(2);
		var React = __webpack_require__(1);
		var vent = __webpack_require__(5);
		var NavLink = __webpack_require__(13);
		var routes = __webpack_require__(15);
	
		var PageTitle = React.createClass({displayName: 'PageTitle',
			getInitialState: function() {
				return {
					title: ''
				}
			},
			updateTitle: function(title) {
				this.setState({title: title});
				window.document.title = title;
			},
			componentDidMount: function() {
				vent.on('page:title', this.updateTitle, this);
			},
			componentWillUnmount: function() {
				vent.off('page:title', this.updateTitle, this);
			},
			render: function() {
				return (React.DOM.div({className: "page-header"}, 
					React.DOM.h1(null, this.state.title)
				));
			}
		});
	
		var MenuLink = React.createClass({displayName: 'MenuLink',
			render: function() {
				var menuClass = "list-group-item";
				return this.transferPropsTo(NavLink({className: menuClass}, this.props.children))
			}
		});
	
		var Sidebar = React.createClass({displayName: 'Sidebar',
			getInitialState: function() {
				return {
					/**
					 * Valid Values for loginState:
					 * "form": Show the Login Form
					 * "done": Show the "An email has been sent" message.
					 * null: (or any other value) Show the login link.
					 */
					loginState: null,
					currentUser: null,
					email: null,
					persist: false
				}
			},
			componentDidMount: function() {
				var r = routes.controllers.api.Root.whoami();
				$.ajax({
					type: r.method,
					url: r.url
				}).done((function(data) {
					this.setState({currentUser: data});
				}).bind(this));
			},
			handleLoginLink: function() {
				this.setState({loginState: "form"});
			},
			onEmailChange: function(e) {
				this.setState({email: e.target.value});
			},
			onPersistChange: function(e) {
				this.setState({persist: e.target.checked});
			},
			onLogin: function() {
				var r = routes.controllers.api.Tokens.create();
				$.ajax({
					type: r.method,
					url: r.url,
					data: {
						email: this.state.email,
						persist: this.state.persist
					}
				}).done(this.onLoginSuccess);
			},
			onLoginSuccess: function() {
				this.setState({loginState: "done"});
			},
			makeLoginLink: function() {
				if( this.state.currentUser ) {
					// TODO: Replace this with a route entry.
					return React.DOM.a({className: "list-group-item", href: "/logout"}, "Logout ", this.state.currentUser.displayName);
				}
				else if( "form" === this.state.loginState ) {
					return React.DOM.div({className: "list-group-item"}, 
						React.DOM.input({type: "text", className: "form-control", onChange: this.onEmailChange}), 
						React.DOM.div({className: "checkbox"}, 
							React.DOM.label(null, 
								React.DOM.input({type: "checkbox", onChange: this.onPersistChange}), 
							"Stay Logged In")
						), 
						React.DOM.button({className: "btn btn-block btn-success", onClick: this.onLogin}, "Login")
					);
				}
				else if( "done" === this.state.loginState ) {
					return React.DOM.div({className: "list-group-item"}, 
						React.DOM.p({className: "list-group-item-text"}, "An email has been sent to" + ' ' +
						"'", this.state.email, "', if you do not receive it, please contact the" + ' ' +
						"forum admin.")
					);
				}
				else {
					return React.DOM.a({className: "list-group-item", onClick: this.handleLoginLink}, "Login");
				}
			},
			makeProfileLink: function() {
				if( this.state.currentUser ) {
					return NavLink({className: "list-group-item", href: "/profile"}, "Edit Profile");
				}
				return null;
			},
			render: function() {
				return (React.DOM.div({className: "panel panel-default"}, 
					React.DOM.div({className: "panel-heading visible-xs"}, 
						React.DOM.h3({className: "panel-title"}, "Navigation")
					), 
					React.DOM.div({className: "list-group"}, 
						NavLink({className: "list-group-item", href: "/"}, "All Discussions"), 
						NavLink({className: "list-group-item", href: "/topic"}, "Create Topic"), 
						this.makeProfileLink(), 
						this.makeLoginLink()
					)
				));
			}
		});
	
		return React.createClass({
			render: function() {
				return (
					React.DOM.div({className: "container-fluid"}, 
						PageTitle(null), 
						React.DOM.div({className: "row"}, 
							React.DOM.div({className: "main-content col-sm-9 col-sm-push-3"}, this.props.main), 
							React.DOM.div({className: "sidebar col-sm-3 col-sm-pull-9"}, 
								Sidebar(null)
							)
						)
					)
					);
			}
		});
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @jsx React.DOM */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
		var React = __webpack_require__(1);
		var vent = __webpack_require__(5);
	
		var NavLink = __webpack_require__(13);
	
		var TopicListItem = React.createClass({displayName: 'TopicListItem',
			render: function() {
				var topicUrl = "/topic/" + this.props.slug;
				return (
					React.DOM.li(null, 
						React.DOM.div({className: "topic-iconline pull-right"}, 
							React.DOM.i({className: "fa fa-eye fa-2x topic-watched"}), 
							React.DOM.i({className: "fa fa-star fa-2x topic-saved"})
						), 
						React.DOM.div({className: "topic-titleline"}, 
							React.DOM.i({className: "fa fa-dot-circle-o topic-unread"}), 
							NavLink({className: "topic-title", href: topicUrl}, this.props.title)
						), 
						React.DOM.div({className: "topic-dateline text-muted"}, 
						"updated on: ", this.props.date.toTimeString()
						)
					)
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
					topics[i] = TopicListItem({key: i, 
					title: title, 
					slug: title, 
					date: new Date()})
				}
				return (React.DOM.ul({className: "topic-list"}, topics));
			},
			openModal: function() {
				this.refs.modal.open();
			},
			closeModal: function() {
				this.refs.modal.close();
			}
		});
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @jsx React.DOM */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
		var _ = __webpack_require__(3);
		var React = __webpack_require__(1);
		var marked = __webpack_require__(12);
		var vent = __webpack_require__(5);
		var Editor = __webpack_require__(14);
	
		var TopicTitle = React.createClass({displayName: 'TopicTitle',
			render: function() {
				return (
					React.DOM.div({className: "post-topic-title"}, 
						React.DOM.h1(null, this.props.title, 
							React.DOM.a({href: "#", className: "post-edit-title pull-right"}, 
								React.DOM.i({className: "fa fa-edit"})
							)
						)
					)
					);
			}
		});
	
		var EditPostButton = React.createClass({displayName: 'EditPostButton',
			render: function() {
				var cx = React.addons.classSet;
				var classes = cx({
					'fa': true,
					'fa-edit': !this.props.editMode,
					'fa-ban': this.props.editMode
				});
				return this.transferPropsTo(React.DOM.a({className: "post-edit"}, 
					React.DOM.i({className: classes})
				));
			}
		});
	
		var DeletePostButton = React.createClass({displayName: 'DeletePostButton',
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
					React.DOM.a({onClick: this.handleDelete, className: "btn btn-danger btn-xs"}, "Delete") : null;
				return (React.DOM.span(null, deleteButton, 
					React.DOM.a({className: "post-delete", onClick: this.handleIconClick}, 
						React.DOM.i({className: iconClasses})
					)
				));
			}
		});
	
		var PostBody = React.createClass({displayName: 'PostBody',
			render: function() {
				return (React.DOM.span({dangerouslySetInnerHTML: {__html: this.props.children}}));
			}
		});
	
		var ReplyItem = React.createClass({displayName: 'ReplyItem',
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
					Editor({className: "post-body", focus: true, submitHandler: this.onEditSubmit}) :
					PostBody({className: "post-body"}, this.state.body);
	
				return (
					React.DOM.div({className: "post-item"}, 
						React.DOM.div({className: "post-topline"}, 
							React.DOM.span({className: "post-author"}, this.props.post.author), 
							React.DOM.span({className: "post-date"}, this.props.createdOn), 
							React.DOM.span({className: "post-actions pull-right"}, 
								EditPostButton({onClick: this.onEditPost, editMode: this.state.editMode}), 
								DeletePostButton({key: "post_" + this.props.key})
							)
						), 
						React.DOM.div({className: "post-avatar pull-right"}, 
							React.DOM.img({src: "//placehold.it/75"})
						), 
						bodyEl, 
						React.DOM.div({className: "post-edited-line"}, "last edited ", this.state.modifiedOn, " by ", this.state.modifiedBy)
					)
					);
			}
		});
	
		var ReplyList = React.createClass({displayName: 'ReplyList',
			getDefaultProps: function() {
				return {
					editPostHandler: function() {
	
					}
				}
			},
			render: function() {
				var self = this;
				var replies = _(this.props.posts).map(function(p, i) {
					return ReplyItem({key: i, post: p, editPostHandler: self.props.editPostHandler})
				});
				return (
					React.DOM.ul({className: "post-list"}, replies)
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
					React.DOM.div(null, 
						ReplyList({posts: this.state.posts, editPostHandler: this.replySubmitHandler}), 
						Editor({className: "post-reply-form", submitHandler: this.replySubmitHandler})
					)
					);
			}
		});
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @jsx React.DOM */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
		var React = __webpack_require__(1);
		var vent = __webpack_require__(5);
		var Editor = __webpack_require__(14);
	
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
					Editor({className: "topic-create-form", focus: true, showTitle: true, 
					submitHandler: this.onTopicSubmit})
					);
			}
	
		});
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @jsx React.DOM */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
		var _ = __webpack_require__(3);
		var React = __webpack_require__(1);
		var marked = __webpack_require__(12);
		var vent = __webpack_require__(5);
		var Editor = __webpack_require__(14);
	
		/**
		 * name
		 * avatar
		 *
		 * emails (public only?)
		 *
		 * topics created
		 * topics posted in?
		 *
		 */
	
		return React.createClass({
			render: function() {
				return (
					React.DOM.div(null)
					);
			}
		});
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @jsx React.DOM */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
		var React = __webpack_require__(1);
		var vent = __webpack_require__(5);
		var routes = __webpack_require__(15)
	
		var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
		/*
		 gravatar (readonly)
	
	
		 topics created ?
		 topics participated in ?
		 */
	
		var Token = React.createClass({displayName: 'Token',
			getInitialState: function() {
				return {
					btnActive: false
				}
			},
			handleClick: function() {
				this.setState({btnActive: !this.state.btnActive});
			},
			handleRevoke: function() {
				console.log("revoking token");
				/**
				 * Send AJAX Request.
				 */
	
			},
			render: function() {
				var actions = [];
				if( this.state.btnActive ) {
					actions[0] = React.DOM.div({className: "btn-group", key: "1"}, 
						React.DOM.button({className: "btn btn-danger", onClick: this.handleRevoke}, 
							React.DOM.i({className: "fa fa-trash-o fa-lg"}), " Revoke"
						)
					);
				}
				return (
					React.DOM.li({className: "list-group-item", onClick: this.handleClick}, 
					this.props.children, 
						ReactCSSTransitionGroup({transitionName: "example"}, 
						actions
						)
					)
					);
			}
		});
	
		var UserTokens = React.createClass({displayName: 'UserTokens',
			componentDidMount: function() {
	
			},
			render: function() {
				return (React.DOM.div({className: "panel panel-default"}, 
					React.DOM.div({className: "panel-heading"}, 
						React.DOM.h3({className: "panel-title"}, "Authentication Tokens")
					), 
					React.DOM.ul({className: "list-group"}, 
						Token(null, "Mac OS X / Safari"), 
						Token(null, "Windows 8.1 Pro / Chrome")
					)
				));
			}
		});
	
		var Email = React.createClass({displayName: 'Email',
			getDefaultProps: function() {
				return {
					isPrimary: false
				}
			},
			getInitialState: function() {
				return {
					actionsEnabled: false
				}
			},
			handleClick: function() {
				this.setState({actionsEnabled: !this.state.actionsEnabled});
			},
			handleRemove: function(e) {
				return false;
			},
			makePrimary: function(e) {
				return false;
			},
			render: function() {
				var primary, actions = [];
				if( this.state.actionsEnabled && !this.props.isPrimary ) {
					actions.push(React.DOM.div({className: "btn-group", key: "1"}, 
						React.DOM.button({className: "btn btn-primary", onClick: this.makePrimary}, "Make Primary"), 
						React.DOM.button({className: "btn btn-danger", onClick: this.handleRemove}, 
							React.DOM.i({className: "fa fa-trash-o fa-lg"})
						)
					));
				}
				if( this.props.isPrimary ) {
					primary = React.DOM.span({className: "label label-success"}, "Primary");
				}
				return (
					React.DOM.li({className: "list-group-item", onClick: this.handleClick}, 
					this.props.children, " ", primary, 
						ReactCSSTransitionGroup({transitionName: "example"}, 
						actions
						)
					)
					);
			}
		});
	
		return React.createClass({
			componentDidMount: function() {
				vent.trigger('page:title', "Edit Your Profile");
			},
			render: function() {
				return (
					React.DOM.div({className: "edit-profile row"}, 
						React.DOM.div({className: "col-md-8"}, 
							React.DOM.div({className: "display-name input-group"}, 
								React.DOM.input({type: "text", className: "form-control", placeholder: "Display Name"}), 
								React.DOM.span({className: "input-group-btn"}, 
									React.DOM.button({className: "btn btn-success", type: "button"}, "Save")
								)
							), 
							React.DOM.div({className: "panel panel-default"}, 
								React.DOM.div({className: "panel-heading"}, 
									React.DOM.h3({className: "panel-title"}, "Emails")
								), 
								React.DOM.ul({className: "list-group"}, 
									Email({isPrimary: true}, "primary@example.com"), 
									Email(null, "secondary1@example.com"), 
									Email(null, "secondary1@example.com"), 
									React.DOM.li({className: "list-group-item"}, 
										React.DOM.div({className: "input-group"}, 
											React.DOM.input({className: "form-control", type: "email", placeholder: "add new email"}), 
											React.DOM.span({className: "input-group-btn"}, 
												React.DOM.button({className: "btn btn-success", type: "button"}, "Add")
											)
										)
									)
								)
							), 
	
							React.DOM.div({className: "panel panel-default"}, 
								React.DOM.div({className: "panel-heading"}, 
									React.DOM.h3({className: "panel-title"}, "Authentication Tokens")
								), 
								React.DOM.ul({className: "list-group"}, 
									Token(null, "Mac OS X / Safari"), 
									Token(null, "Windows 8.1 Pro / Chrome")
								)
							)
						), 
						React.DOM.div({className: "col-md-4 visible-md visible-lg"}, 
							React.DOM.img({className: "profile-avatar", src: "http://gravatar.com/avatar/cd27466723d44baeab956c5157d22e00.png?s=150"})
						)
					)
					);
			}
		});
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = marked;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @jsx React.DOM */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
		var React = __webpack_require__(1);
		var vent = __webpack_require__(5);
	
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
					React.DOM.a({onClick: this.navOnClick}, this.props.children)
				)
			}
		});
	
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/** @jsx React.DOM */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
		var React = __webpack_require__(1);
		var Ace = __webpack_require__(16);
		var marked = __webpack_require__(12);
	
		var AceEditor = React.createClass({displayName: 'AceEditor',
			getInitialState: function() {
				return {
					content: this.props.initialContent
				}
			},
			handleChange: function() {
				this.props.changeHandler(this.editor.getValue());
			},
			componentDidMount: function() {
				this.editor = Ace.edit(this.getDOMNode());
				this.editor.setOptions({
					minLines: 5,
					maxLines: 20
				});
				this.editor.setFontSize(16);
				this.editor.renderer.setShowGutter(false);
				this.editor.getSession().setMode('ace/mode/markdown');
				this.editor.getSession().setUseWrapMode(true);
				this.editor.getSession().setTabSize(2);
				this.editor.getSession().on('change', this.handleChange);
				this.editor.setValue(this.state.content, -1);
				if( this.props.autoFocus ) {
					this.editor.focus();
				}
			},
			render: function() {
				var style = {
					display: this.props.preview ? "none" : "block"
				};
				return (React.DOM.div({style: style, className: "edit-pane"}));
			}
		});
	
		var PreviewPane = React.createClass({displayName: 'PreviewPane',
			render: function() {
				var style = {
					display: this.props.preview ? "block" : "none"
				};
				return (React.DOM.div({style: style, className: "preview-pane", 
				dangerouslySetInnerHTML: {__html: this.props.children}}));
			}
		});
	
		return React.createClass({
			getDefaultProps: function() {
				return {
					initialContent: "",
					showTitle: false,
					titlePlaceholder: "Topic Title",
					submitHandler: function() {
					}
				};
			},
			getInitialState: function() {
				return {
					previewMode: false,
					title: "",
					contentSource: this.props.initialContent,
					contentPreview: "",
					editorKey: 1
				};
			},
			handlePreview: function() {
				this.setState({previewMode: !this.state.previewMode});
			},
			handleEdit: function(newContent) {
				this.setState({
					contentSource: newContent,
					contentPreview: marked(newContent)
				});
			},
			handleTopicChange: function(event) {
				this.setState({
					title: event.target.value
				});
			},
			handleSubmit: function() {
				var result = this.props.submitHandler(this.state.contentSource, this.state.title);
				//TODO: Need to handle failure here.
				this.setState({
					contentSource: "",
					contentPreview: "",
					previewMode: false,
					editorKey: this.state.editorKey + 1
				});
			},
			render: function() {
				var cx = React.addons.classSet;
				var previewButtonCls = cx({
					'editor-preview-button pull-right fa fa-2x': true,
					'fa-eye': !this.state.previewMode,
					'fa-eye-slash': this.state.previewMode
				});
				var topicEl;
				if( this.props.showTitle ) {
					topicEl = React.DOM.input({className: "editor-title input-lg form-control", 
					onChange: this.handleTopicChange, name: "title", 
					placeholder: this.props.titlePlaceholder})
				}
				return (
					React.DOM.div({className: this.props.className}, 
						React.DOM.div({className: "editor-actions"}, 
							React.DOM.span({onClick: this.handlePreview, className: previewButtonCls}), 
							React.DOM.button({type: "submit", onClick: this.handleSubmit, 
							className: "btn btn-sm btn-success post-submit", 
							'data-loading-text': " Posting..."}, "Submit")
						), 
						topicEl, 
						React.DOM.div({className: "editor form-control"}, 
							AceEditor({key: this.state.editorKey, 
							initialContent: this.state.contentSource, 
							preview: this.state.previewMode, 
							changeHandler: this.handleEdit, 
							autoFocus: this.props.focus}), 
							PreviewPane({preview: this.state.previewMode}, this.state.contentPreview)
						), 
						React.DOM.div({className: "alert-region"})
					)
					);
			}
		});
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
		return window.jsroutes;
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = ace;

/***/ }
/******/ ])
//# sourceMappingURL=bundle.js.map