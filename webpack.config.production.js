var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: ['./src/index.js'],
  },
  output: {
    filename: 'js/[name].[contenthash].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Thydo calendar',
      template: './src/index.html',
    }),
  ],
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
  devtool: 'source-map',
};
