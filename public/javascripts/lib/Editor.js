/** @jsx React.DOM */
define(function(require) {
	var React = require('react');
	var Ace = require('ace');
	var marked = require('marked');

	var AceEditor = React.createClass({
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
			return (<div style={style} className="edit-pane"/>);
		}
	});

	var PreviewPane = React.createClass({
		render: function() {
			var style = {
				display: this.props.preview ? "block" : "none"
			};
			return (<div style={style} className="preview-pane"
			dangerouslySetInnerHTML={{__html: this.props.children}}/>);
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
				topicEl = <input className="editor-title input-lg form-control"
				onChange={this.handleTopicChange} name="title"
				placeholder={this.props.titlePlaceholder}/>
			}
			return (
				<div className={this.props.className}>
					<div className="editor-actions">
						<span onClick={this.handlePreview} className={previewButtonCls} ></span>
						<button type="submit" onClick={this.handleSubmit}
						className="btn btn-sm btn-success post-submit"
						data-loading-text=" Posting...">Submit</button>
					</div>
					{topicEl}
					<div className="editor form-control">
						<AceEditor key={this.state.editorKey}
						initialContent={this.state.contentSource}
						preview={this.state.previewMode}
						changeHandler={this.handleEdit}
						autoFocus={this.props.focus}/>
						<PreviewPane preview={this.state.previewMode}>{this.state.contentPreview}</PreviewPane>
					</div>
					<div className="alert-region"></div>
				</div>
				);
		}
	});
});
