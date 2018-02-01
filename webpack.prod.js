/* eslint-env node */
const HtmlPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/docs`,
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(`${__dirname}/docs`),
    new ExtractTextPlugin('styles.css'),
    new HtmlPlugin({ template: './src/index.html' }),
    new UglifyJsPlugin({ sourceMap: true })
  ],
  module: {
    rules: [
      {
        test: /.html$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: { 
                importLoaders: 1, 
                sourceMap: true,
                minimize: true 
              }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true }

            }
          ]
        })
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 5000,
          },
        },
      }
    ]
  }
};