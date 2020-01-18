const webpack = require("webpack");
const path = require("path");

const config = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "linter.js"
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        use: ["awesome-typescript-loader"],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    port: 9000
  }
};

module.exports = config;
