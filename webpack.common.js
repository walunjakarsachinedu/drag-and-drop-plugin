/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
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
    extensions: [".ts", ".js"],
  },
};
