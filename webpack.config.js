const webpack = require("webpack");

module.exports = {
  resolve: {
    extensions: [".js"]
  },
  entry: { master: "./src/master/master.js", slave: "./src/slave/slave.js" },
  output: {
    path: __dirname + "/docs",
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  }
};
