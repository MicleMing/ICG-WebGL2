const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = env => ({
  entry: {
    index: './ui/index.tsx',
  },
  output: {
    filename: "ui/[name].js",
    path: path.resolve(__dirname, "./dist")
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      { test: /\.(swf|ttf|eot|svg|woff(2))(\?[a-z0-9]+)?$/, use: ['file-loader'] },
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: './ui/index.html',
        to: './ui'
      }
    ])
  ]

});
