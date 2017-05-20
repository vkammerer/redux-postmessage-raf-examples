const webpack = require("webpack");

module.exports = {
  devtool: "cheap-module-source-map",
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development" // use 'development' unless process.env.NODE_ENV is defined
    })
  ],
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
