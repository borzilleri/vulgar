/** @jsx React.DOM */
define(function(require) {
	var $ = require('jquery');
	var React = require('react');
	var vent = require('./EventBus');
	var NavLink = require('./NavLink');
	var routes = require('./Routes');

	var PageTitle = React.createClass({
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
			return (<div className="page-header">
				<h1>{this.state.title}</h1>
			</div>);
		}
	});

	var MenuLink = React.createClass({
		render: function() {
			var menuClass = "list-group-item";
			return this.transferPropsTo(<NavLink className={menuClass}>{this.props.children}</NavLink>)
		}
	});

	var Sidebar = React.createClass({
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
				return <a className="list-group-item" href="/logout">Logout {this.state.currentUser.displayName}</a>;
			}
			else if( "form" === this.state.loginState ) {
				return <div className="list-group-item">
					<input type="text" className="form-control" onChange={this.onEmailChange}/>
					<div className="checkbox">
						<label>
							<input type="checkbox" onChange={this.onPersistChange}/>
						Stay Logged In</label>
					</div>
					<button className="btn btn-block btn-success" onClick={this.onLogin}>Login</button>
				</div>;
			}
			else if( "done" === this.state.loginState ) {
				return <div className="list-group-item">
					<p className="list-group-item-text">An email has been sent to
					'{this.state.email}', if you do not receive it, please contact the
					forum admin.</p>
				</div>;
			}
			else {
				return <a className="list-group-item" onClick={this.handleLoginLink}>Login</a>;
			}
		},
		makeProfileLink: function() {
			if( this.state.currentUser ) {
				return <NavLink className="list-group-item" href="/profile">Edit Profile</NavLink>;
			}
			return null;
		},
		render: function() {
			return (<div className="panel panel-default">
				<div className="panel-heading visible-xs">
					<h3 className="panel-title">Navigation</h3>
				</div>
				<div className="list-group">
					<NavLink className="list-group-item" href="/">All Discussions</NavLink>
					<NavLink className="list-group-item" href="/topic">Create Topic</NavLink>
					{this.makeProfileLink()}
					{this.makeLoginLink()}
				</div>
			</div>);
		}
	});

	return React.createClass({
		render: function() {
			return (
				<div className="container-fluid">
					<PageTitle />
					<div className="row">
						<div className="main-content col-sm-9 col-sm-push-3">{this.props.main}</div>
						<div className="sidebar col-sm-3 col-sm-pull-9">
							<Sidebar/>
						</div>
					</div>
				</div>
				);
		}
	});
});
