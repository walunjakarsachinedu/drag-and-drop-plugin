const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    plugin: path.resolve(__dirname, "src/drag-n-drop-plugin.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },

  devtool: "cheap-module-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Path to your HTML template
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ts?$/,
        use: [
          // step 2: convert javascript to backward compatible
          {
            loader: 'babel-loader',
            options: {
              "presets": [ 
                [
                  "@babel/preset-env",
                  {
                    "targets": {
                      "browsers": [
                        "last 2 versions",
                        "ie >= 11"
                      ]
                    }
                  }
                ]
              ]
            },
          },
          // step 1: convert typescript to javascript
          {
            loader: "ts-loader",
          }
        ],
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
}