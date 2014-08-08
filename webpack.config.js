module.exports = {
	entry: "./public/javascripts/app.js",
	devtool: "source-map",
	output: {
		path: __dirname + "/public/javascripts/",
		filename: "bundle.js",
		publicPath: "/assets/javascripts/"
	},
	module: {
		loaders: [
			{ test: /\.js$/, loader: "jsx-loader" }
		]
	},
	externals: {
		"react": "React",
		"jquery": "jQuery",
		"underscore": "_",
		"backbone": "Backbone",
		"ace": "ace",
		"marked": "marked"
	}
};
