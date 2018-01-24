const webpack = require('webpack');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const baseConfig = require('./base.config.js');
const buildConfig = require('./config.js');
const appConfig = require('../config');

baseConfig.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
}));

base.plugins.push(new MinifyPlugin({
  // removeConsole: true,
  // removeDebugger: true,
  // removeUndefined: true
}, {
  comments: false,
  sourceMap: true
}));

// webpack analyse
if(buildConfig.analyse){
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  base.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = Object.assign(baseConfig, {
  //
});