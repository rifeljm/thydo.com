// var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: ['./src/index.js'],
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/js',
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     title: 'Thydo calendar',
  //     template: './src/index.html',
  //   }),
  // ],
  devServer: {
    host: '0.0.0.0',
    port: 80,
    allowedHosts: ['debian', 'thydo'],
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
  resolve: {
    alias: { 'react-dom': '@hot-loader/react-dom' },
  },
  devtool: 'source-map',
};
