const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

const formats = [
  { name: "umd", type: "umd" },
  { name: "cjs", type: "commonjs2" },
  { name: "esm", type: "module" },
];

/**
 * @type {import('webpack').Configuration[]}
 */
module.exports = formats.map(({ name, type }) =>
  merge(common, {
    mode: "production",
    entry: {
      plugin: path.resolve(__dirname, "src/index.ts"),
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: `index.${name}.js`,
      library: {
        type: type,
        name: type === "umd" ? "DragNDropPlugin" : undefined,
      },
    },
    devtool: "source-map",
    experiments: type === "module" ? { outputModule: true } : {},
  })
);
