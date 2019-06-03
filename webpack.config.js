var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: ['./src/index.js'],
  },
  output: {
    filename: '[name].chunkhash.bundle.js',
    chunkFilename: '[name].chunkhash.bundle.js',
    publicPath: '/js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Thydo calendar',
      template: './src/index.html',
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    port: 80,
    allowedHosts: ['debian', 'thydo.com'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'all',
          name: 'vendor',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader?cacheDirectory=true'],
        exclude: /node_modules/,
      },
    ],
  },
  // devtool: 'source-map',
};
