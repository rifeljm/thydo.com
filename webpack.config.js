// var HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    index: ['./src/index.js'],
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/js',
  },
  // plugins: [new BundleAnalyzerPlugin({ analyzerHost: '0.0.0.0' })],
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     title: 'Thydo calendar',
  //     template: './src/index.html',
  //   }),
  // ],
  devServer: {
    host: '0.0.0.0',
    port: 80,
    allowedHosts: ['debian', 'thydo.com', 'dev.thydo.com'],
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
  // devtool: 'source-map',
};
