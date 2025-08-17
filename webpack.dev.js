const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require("./webpack.common.js");
const path = require("path");

/**
 * @type {import('webpack').Configuration}
 */
module.exports = merge(common, {
  mode: "development",
  entry: {
    plugin: path.resolve(__dirname, "src/example/script.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  devtool: "cheap-module-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/example/index.html",
    }),
  ],
});
