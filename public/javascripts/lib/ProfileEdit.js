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
				return <div className="list-group-item">
					<div className="input-group">
						<input className="form-control" type="text" onChange={this.handleNameChange}
						placeholder={this.state.data.browser} value={tokenName} onKeyPress={this.onKeyPress}/>
						<span className="input-group-btn">
							<button className="btn btn-success" type="button" onClick={this.onSaveRename}>Save</button>
							<button className="btn btn-danger" type="button" onClick={this.onCancelRename}>Cancel</button>
						</span>
					</div>
				</div>;
			}
			else {
				tokenName = tokenName ? tokenName : this.state.data.browser;
				return (<li className="list-group-item">
					<span className="list-group-item-text">{tokenName}</span>
					<div className="btn-group action-group">
						<button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown">
							<span className="fa fa-lg fa-caret-left"></span>
							<span className="sr-only">Toggle Dropdown</span>
						</button>
						<ul className="dropdown-menu dropdown-menu-right" role="menu">
							<li className="bg-info">
								<a onClick={this.onStartRename}>
									<i className="fa fa-lg fa-fw fa-edit"/>
								&nbsp;Rename</a>
							</li>
							<li className="bg-danger">
								<a onClick={this.onRevoke}>
									<i className="fa fa-lg fa-fw fa-trash-o"/>
								&nbsp;Revoke</a>
							</li>
						</ul>
					</div>
				</li>);
			}
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
				actions = <div className="btn-group action-group">
					<button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown">
						<span className="fa fa-lg fa-caret-left"></span>
						<span className="sr-only">Toggle Dropdown</span>
					</button>
					<ul className="dropdown-menu dropdown-menu-right" role="menu">
						<li className="bg-success">
							<a>
								<i className="fa fa-lg fa-fw fa-check"/>
							&nbsp;Make Primary</a>
						</li>
						<li className="bg-info">
							<a>
								<i className="fa fa-lg fa-fw fa-envelope"/>
							&nbsp;Resend Confirmation Email</a>
						</li>
						<li className="bg-danger">
							<a>
								<i className="fa fa-lg fa-fw fa-trash-o"/>
							&nbsp;Remove</a>
						</li>
					</ul>
				</div>;
			}
			return (
				<li className="list-group-item" onClick={this.handleClick}>
					<span className="list-group-item-text">{this.props.data.email}</span>
					{actions}
				</li>
				);
		}
	});

	var UserEmails = React.createClass({
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
				emails.push(<Email key={this.state.emails[i].id}
				onRemove={this.removeEmail} data={this.state.emails[i]}/>);
			}

			return (<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Emails</h3>
				</div>
				<ul className="list-group">{emails}
					<li className="list-group-item">
						<div className="input-group">
							<input className="form-control" type="email" placeholder="add new email"/>
							<span className="input-group-btn">
								<button className="btn btn-success" type="button">Add</button>
							</span>
						</div>
					</li>
				</ul>
			</div>);
		}
	});

	var DisplayName = React.createClass({
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
				cancelBtn = <button className="btn btn-danger" type="button" onClick={this.handleCancel}>Cancel</button>;
				if( this.state.name ) {
					saveBtn = <button className="btn btn-success" type="button" onClick={this.handleSave}>Save</button>;
				}
			}
			return (
				<div className="display-name input-group">
					<input type="text" className="form-control" onChange={this.handleNameChange}
					placeholder="Display Name" value={this.state.name}/>
					<span className="input-group-btn">
					{cancelBtn}
					{saveBtn}
					</span>
				</div>);
		}
	});

	return React.createClass({
		componentDidMount: function() {
			vent.trigger('page:title', "Edit Your Profile");
		},
		render: function() {
			return (<div className="edit-profile row">
				<div className="col-md-8">
					<DisplayName initialName={this.props.user.displayName}/>
					<UserEmails />
					<UserTokens />
				</div>
				<div className="col-md-4 visible-md visible-lg">
					<img className="profile-avatar" src="http://gravatar.com/avatar/cd27466723d44baeab956c5157d22e00.png?s=150"/>
				</div>
			</div>);
		}
	});

});
