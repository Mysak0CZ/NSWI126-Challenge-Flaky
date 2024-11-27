const { join } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
require("webpack-dev-server");

const WEBPACK_PORT = 8083;

const SRC_DIR = join(__dirname, "src");
const OUT_DIR = join(__dirname, "out");

module.exports = function GenerateConfiguration(env) {
	return {
		devServer: {
			historyApiFallback: {
				rewrites: [
					{ from: /./, to: "/index.html" },
				],
			},
			hot: true,
			open: false,
			host: "127.0.0.1",
			client: {
				webSocketURL: `ws://127.0.0.1:${WEBPACK_PORT}/ws`,
			},
			devMiddleware: {
				writeToDisk: true,
			},
			port: WEBPACK_PORT,
		},
		devtool: env.prod ? "source-map" : "inline-source-map",
		entry: {
			index: join(SRC_DIR, "index.tsx"),
		},
		mode: env.prod ? "production" : "development",
		module: {
			rules: GenerateRules(),
		},
		output: {
			path: OUT_DIR,
			filename: `[name]${env.prod ? ".[chunkhash]" : ""}.js`,
			publicPath: "/",
		},
		plugins: GeneratePlugins(),
		resolve: {
			extensionAlias: {
				".js": [".ts", ".tsx", ".js"],
			},
			extensions: [".ts", ".tsx", ".js"],
		},
		infrastructureLogging: {
			level: "log",
		},
	};
}

function GeneratePlugins() {
	const plugins = [
		new CleanWebpackPlugin({ verbose: true }),
		new HtmlWebpackPlugin({
			template: join(SRC_DIR, "index.ejs"),
			title: "Test",
			chunks: ["index"],
		}),
	];

	return plugins;
}

function GenerateRules() {
	const moduleRules = [
		{
			test: /\.tsx?$/i,
			exclude: /node_modules/,
			use: [{
				loader: "ts-loader",
				options: {
					configFile: "tsconfig.json",
				},
			}],
		},
		{
			test: /\.(png|jpe?g|gif|svg|eot|ttf|woff2?)$/i,
			loader: "url-loader",
			issuer: /\.[jt]sx?$/,
			options: {
				limit: 8192,
				esModule: false,
				name: "assets/[contenthash].[ext]",
			},
		},
		{
			test: /\.s?css$/i,
			use: GenerateStyleLoaders(),
		},
		{
			enforce: "pre",
			test: /\.js$/i,
			exclude: /node_modules/,
			loader: "source-map-loader",
		},
	];

	return moduleRules;
}

function GenerateStyleLoaders() {
	const styleLoaders = [
		{ loader: "style-loader" },
		{ loader: "css-loader" },
		{ loader: "sass-loader" },
	];

	return styleLoaders;
}
