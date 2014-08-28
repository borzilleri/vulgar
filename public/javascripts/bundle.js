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
				React.renderComponent(Main({main: component, user: this.user}), document.body);
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
				this.render(ProfileEdit({user: this.user}));
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
		var routes = __webpack_require__(14);
	
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
			getDefaultProps: function() {
				return {
					user: null
				}
			},
			getInitialState: function() {
				return {
					/**
					 * Valid Values for loginState:
					 * "form": Show the Login Form
					 * "done": Show the "An email has been sent" message.
					 * null: (or any other value) Show the login link.
					 */
					loginState: null,
					email: null,
					persist: false
				}
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
				var data = {
					email: this.state.email,
					persist: this.state.persist
				};
				$.ajax({
					type: r.method,
					url: r.url,
					contentType: "application/json",
					data: JSON.stringify(data)
				}).done(this.onLoginSuccess);
			},
			onLoginSuccess: function() {
				this.setState({loginState: "done"});
			},
			makeLoginLink: function() {
				if( this.props.user ) {
					// TODO: Replace this with a route entry.
					return React.DOM.a({className: "list-group-item", href: "/logout"}, "Logout ", this.props.user.displayName);
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
			render: function() {
				var profileLink = null, createTopicLink = null;
				if( this.props.user ) {
					profileLink = NavLink({className: "list-group-item", href: "/profile"}, "Edit Profile");
					createTopicLink = NavLink({className: "list-group-item", href: "/topic"}, "Create Topic");
				}
				return (React.DOM.div({className: "panel panel-default"}, 
					React.DOM.div({className: "panel-heading visible-xs"}, 
						React.DOM.h3({className: "panel-title"}, "Navigation")
					), 
					React.DOM.div({className: "list-group"}, 
						NavLink({className: "list-group-item", href: "/"}, "All Discussions"), 
						createTopicLink, 
						profileLink, 
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
								Sidebar({user: this.props.user})
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
		var Editor = __webpack_require__(15);
	
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
		var Editor = __webpack_require__(15);
	
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
		var Editor = __webpack_require__(15);
	
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
		var $ = __webpack_require__(2);
		var React = __webpack_require__(1);
		var vent = __webpack_require__(5);
		var routes = __webpack_require__(14)
	
		var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
	
		/*
		 topics created ?
		 topics participated in ?
		 */
	
		var Token = React.createClass({displayName: 'Token',
			getDefaultProps: function() {
				return {
					data: {},
					onRevoke: function() {
					}
				}
			},
			getInitialState: function() {
				return {
					data: this.props.data,
					tokenName: this.props.data.name,
					renaming: false
				}
			},
			onRevoke: function() {
				this.props.onRevoke(this.state.data.id);
			},
			handleNameChange: function(e) {
				this.setState({tokenName: e.target.value});
			},
			onStartRename: function() {
				this.setState({renaming: true});
			},
			onCancelRename: function() {
				this.onStopRename(null);
			},
			onStopRename: function(data) {
				if( data ) {
					this.setState({data: data});
				}
				this.setState({renaming: false});
			},
			onSaveRename: function() {
				var r = routes.controllers.api.Tokens.rename(this.state.data.id);
				$.ajax({
					type: r.method,
					url: r.url,
					contentType: "application/json",
					data: JSON.stringify({"name": this.state.tokenName})
				})
					.done(this.onStopRename);
				//TODO: Handle fail.
			},
			onKeyPress: function(e) {
				if( "enter" === e.key.toLowerCase() ) {
					this.onSaveRename();
				}
			},
			render: function() {
				var tokenName = this.state.tokenName;
				if( this.state.renaming ) {
					return React.DOM.div({className: "list-group-item"}, 
						React.DOM.div({className: "input-group"}, 
							React.DOM.input({className: "form-control", type: "text", onChange: this.handleNameChange, 
							placeholder: this.state.data.browser, value: tokenName, onKeyPress: this.onKeyPress}), 
							React.DOM.span({className: "input-group-btn"}, 
								React.DOM.button({className: "btn btn-success", type: "button", onClick: this.onSaveRename}, "Save"), 
								React.DOM.button({className: "btn btn-danger", type: "button", onClick: this.onCancelRename}, "Cancel")
							)
						)
					);
				}
				else {
					tokenName = tokenName ? tokenName : this.state.data.browser;
					return (React.DOM.li({className: "list-group-item"}, 
						React.DOM.span({className: "list-group-item-text"}, tokenName), 
						React.DOM.div({className: "btn-group action-group"}, 
							React.DOM.button({type: "button", className: "btn btn-info dropdown-toggle", 'data-toggle': "dropdown"}, 
								React.DOM.span({className: "fa fa-lg fa-caret-left"}), 
								React.DOM.span({className: "sr-only"}, "Toggle Dropdown")
							), 
							React.DOM.ul({className: "dropdown-menu dropdown-menu-right", role: "menu"}, 
								React.DOM.li({className: "bg-info"}, 
									React.DOM.a({onClick: this.onStartRename}, 
										React.DOM.i({className: "fa fa-lg fa-fw fa-edit"}), 
									" Rename")
								), 
								React.DOM.li({className: "bg-danger"}, 
									React.DOM.a({onClick: this.onRevoke}, 
										React.DOM.i({className: "fa fa-lg fa-fw fa-trash-o"}), 
									" Revoke")
								)
							)
						)
					));
				}
			}
		});
	
		var UserTokens = React.createClass({displayName: 'UserTokens',
			getInitialState: function() {
				return {
					tokens: []
				}
			},
			componentDidMount: function() {
				var r = routes.controllers.api.Tokens.list();
				$.ajax({
					type: r.method,
					url: r.url
				}).done((function(data) {
					this.setState({tokens: data});
				}).bind(this));
			},
			revokeToken: function(tokenId) {
				console.log("revoking token: " + tokenId);
				var r = routes.controllers.api.Tokens.delete(tokenId);
				$.ajax({
					type: r.method,
					url: r.url
				}).done((function() {
					this.setState({
						tokens: _(this.state.tokens).reject(function(t) {
							return t.id === tokenId;
						})
					});
				}).bind(this));
			},
			render: function() {
				var tokens = [];
				for( var i in this.state.tokens ) {
					tokens.push(Token({key: this.state.tokens[i].id, 
					onRevoke: this.revokeToken, data: this.state.tokens[i]}));
				}
	
				return (React.DOM.div({className: "panel panel-default"}, 
					React.DOM.div({className: "panel-heading"}, 
						React.DOM.h3({className: "panel-title"}, "Authentication Tokens")
					), 
					React.DOM.ul({className: "list-group"}, tokens)
				));
			}
		});
	
		var Email = React.createClass({displayName: 'Email',
			getDefaultProps: function() {
				return {
					data: {},
					onRemove: function() {
					}
				}
			},
			onRemove: function() {
				this.props.onRemove(this.props.data.id);
			},
			makePrimary: function() {
				return false;
			},
			render: function() {
				var actions = null;
				if( !this.props.data.primary ) {
					actions = React.DOM.div({className: "btn-group action-group"}, 
						React.DOM.button({type: "button", className: "btn btn-info dropdown-toggle", 'data-toggle': "dropdown"}, 
							React.DOM.span({className: "fa fa-lg fa-caret-left"}), 
							React.DOM.span({className: "sr-only"}, "Toggle Dropdown")
						), 
						React.DOM.ul({className: "dropdown-menu dropdown-menu-right", role: "menu"}, 
							React.DOM.li({className: "bg-success"}, 
								React.DOM.a(null, 
									React.DOM.i({className: "fa fa-lg fa-fw fa-check"}), 
								" Make Primary")
							), 
							React.DOM.li({className: "bg-info"}, 
								React.DOM.a(null, 
									React.DOM.i({className: "fa fa-lg fa-fw fa-envelope"}), 
								" Resend Confirmation Email")
							), 
							React.DOM.li({className: "bg-danger"}, 
								React.DOM.a(null, 
									React.DOM.i({className: "fa fa-lg fa-fw fa-trash-o"}), 
								" Remove")
							)
						)
					);
				}
				return (
					React.DOM.li({className: "list-group-item", onClick: this.handleClick}, 
						React.DOM.span({className: "list-group-item-text"}, this.props.data.email), 
						actions
					)
					);
			}
		});
	
		var UserEmails = React.createClass({displayName: 'UserEmails',
			getInitialState: function() {
				return {
					emails: []
				}
			},
			componentDidMount: function() {
				var r = routes.controllers.api.Emails.list();
				$.ajax({
					type: r.method,
					url: r.url
				}).done((function(data) {
					this.setState({emails: data});
				}).bind(this));
			},
			removeEmail: function() {
	
			},
			confirmEmail: function() {
	
			},
			makePrimary: function() {
	
			},
			render: function() {
				var emails = [];
				for( var i in this.state.emails ) {
					emails.push(Email({key: this.state.emails[i].id, 
					onRemove: this.removeEmail, data: this.state.emails[i]}));
				}
	
				return (React.DOM.div({className: "panel panel-default"}, 
					React.DOM.div({className: "panel-heading"}, 
						React.DOM.h3({className: "panel-title"}, "Emails")
					), 
					React.DOM.ul({className: "list-group"}, emails, 
						React.DOM.li({className: "list-group-item"}, 
							React.DOM.div({className: "input-group"}, 
								React.DOM.input({className: "form-control", type: "email", placeholder: "add new email"}), 
								React.DOM.span({className: "input-group-btn"}, 
									React.DOM.button({className: "btn btn-success", type: "button"}, "Add")
								)
							)
						)
					)
				));
			}
		});
	
		var DisplayName = React.createClass({displayName: 'DisplayName',
			getDefaultProps: function() {
				return {
					initialName: ""
				}
			},
			getInitialState: function() {
				return {
					name: this.props.initialName
				}
			},
			handleNameChange: function(e) {
				this.setState({name: e.target.value})
			},
			handleCancel: function(e) {
				this.setState({name: this.props.initialName});  
			},
			handleSave: function(e) {
	
			},
			render: function() {
				var saveBtn = null, cancelBtn = null;
				if( this.state.name !== this.props.initialName ) {
					cancelBtn = React.DOM.button({className: "btn btn-danger", type: "button", onClick: this.handleCancel}, "Cancel");
					if( this.state.name ) {
						saveBtn = React.DOM.button({className: "btn btn-success", type: "button", onClick: this.handleSave}, "Save");
					}
				}
				return (
					React.DOM.div({className: "display-name input-group"}, 
						React.DOM.input({type: "text", className: "form-control", onChange: this.handleNameChange, 
						placeholder: "Display Name", value: this.state.name}), 
						React.DOM.span({className: "input-group-btn"}, 
						cancelBtn, 
						saveBtn
						)
					));
			}
		});
	
		return React.createClass({
			componentDidMount: function() {
				vent.trigger('page:title', "Edit Your Profile");
			},
			render: function() {
				return (React.DOM.div({className: "edit-profile row"}, 
					React.DOM.div({className: "col-md-8"}, 
						DisplayName({initialName: this.props.user.displayName}), 
						UserEmails(null), 
						UserTokens(null)
					), 
					React.DOM.div({className: "col-md-4 visible-md visible-lg"}, 
						React.DOM.img({className: "profile-avatar", src: "http://gravatar.com/avatar/cd27466723d44baeab956c5157d22e00.png?s=150"})
					)
				));
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

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
		return window.jsroutes;
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = ace;

/***/ }
/******/ ])
//# sourceMappingURL=bundle.js.map