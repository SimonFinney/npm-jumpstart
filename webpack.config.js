/**
 * @file webpack configuration.
 */

const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

const { resolve } = require('path');

const { name } = require('./package.json');

// Entry point.
const entry = 'index';

/**
 * Creates an object for maintaining paths throughout the webpack configuration.
 */
const paths = new function paths() {
  this.src = resolve(__dirname, 'src');
  this.dist = resolve(__dirname, 'dist');
}();

/**
 * Exports the webpack configuration for the library.
 * @param {Object.<string, boolean>} env Environment variables defined in the package manifest.
 */
module.exports = ({ development } = false) => ({
  devtool: development && 'cheap-module-eval-source-map',
  entry: development && [paths.src, resolve(paths.src, `${entry}.scss`)],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        }),
      },
    ],
  },
  output: {
    filename: `${name}.js`,
    library: name
      .split('-')
      .map(str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`)
      .join(''), // Converts the package name to uppercase to expose public methods from.
  },
  plugins: [
    new CleanPlugin([paths.dist]),
    new ExtractTextPlugin(`${entry}.css`),
    development &&
      new HtmlPlugin({
        template: resolve(paths.src, `${entry}.html`),
        title: name,
      }),
  ].filter(Boolean),
});
