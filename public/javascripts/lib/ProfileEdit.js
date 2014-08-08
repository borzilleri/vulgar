/** @jsx React.DOM */
define(function(require) {
	var $ = require('jquery');
	var React = require('react');
	var vent = require('./EventBus');
	var routes = require('./Routes')

	var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

	/*
	 topics created ?
	 topics participated in ?
	 */

	var Token = React.createClass({
		getDefaultProps: function() {
			return {
				data: {},
				onRevoke: function() {
				}
			}
		},
		getInitialState: function() {
			return {
				btnActive: false
			}
		},
		handleClick: function() {
			this.setState({btnActive: !this.state.btnActive});
		},
		handleRevoke: function() {
			this.props.onRevoke(this.props.data.id);
		},
		render: function() {
			var actions = [];
			if( this.state.btnActive ) {
				actions[0] = <div className="btn-group" key="1">
					<button className="btn btn-danger" onClick={this.handleRevoke}>
						<i className="fa fa-trash-o fa-lg" />
					Revoke
					</button>
				</div>;
			}
			var tokenName = this.props.data.name ?
				this.props.data.name : this.props.data.browser;
			return (
				<li className="list-group-item" onClick={this.handleClick}>
				{tokenName}
					<ReactCSSTransitionGroup transitionName="example">
					{actions}
					</ReactCSSTransitionGroup>
				</li>
				);
		}
	});

	var UserTokens = React.createClass({
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
				tokens.push(<Token key={this.state.tokens[i].id}
				onRevoke={this.revokeToken} data={this.state.tokens[i]}/>);
			}

			return (<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Authentication Tokens</h3>
				</div>
				<ul className="list-group">{tokens}</ul>
			</div>);
		}
	});

	var Email = React.createClass({
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
				actions.push(<div className="btn-group" key="1">
					<button className="btn btn-primary" onClick={this.makePrimary}>Make Primary</button>
					<button className="btn btn-danger" onClick={this.handleRemove}>
						<i className="fa fa-trash-o fa-lg"/>
					</button>
				</div>);
			}
			if( this.props.isPrimary ) {
				primary = <span className="label label-success">Primary</span>;
			}
			return (
				<li className="list-group-item" onClick={this.handleClick}>
				{this.props.children} {primary}
					<ReactCSSTransitionGroup transitionName="example">
					{actions}
					</ReactCSSTransitionGroup>
				</li>
				);
		}
	});

	return React.createClass({
		componentDidMount: function() {
			vent.trigger('page:title', "Edit Your Profile");
		},
		render: function() {
			return (
				<div className="edit-profile row">
					<div className="col-md-8">
						<div className="display-name input-group">
							<input type="text" className="form-control" placeholder="Display Name"/>
							<span className="input-group-btn">
								<button className="btn btn-success" type="button">Save</button>
							</span>
						</div>
						<div className="panel panel-default">
							<div className="panel-heading">
								<h3 className="panel-title">Emails</h3>
							</div>
							<ul className="list-group">
								<Email isPrimary={true}>primary@example.com</Email>
								<Email>secondary1@example.com</Email>
								<Email>secondary1@example.com</Email>
								<li className="list-group-item">
									<div className="input-group">
										<input className="form-control" type="email" placeholder="add new email"/>
										<span className="input-group-btn">
											<button className="btn btn-success" type="button">Add</button>
										</span>
									</div>
								</li>
							</ul>
						</div>
						<UserTokens />
					</div>
					<div className="col-md-4 visible-md visible-lg">
						<img className="profile-avatar" src="http://gravatar.com/avatar/cd27466723d44baeab956c5157d22e00.png?s=150"/>
					</div>
				</div>
				);
		}
	});

});
