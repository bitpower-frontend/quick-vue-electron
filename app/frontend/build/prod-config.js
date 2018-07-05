const baseConfig = require('./base-config.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const buildConfig = require('./config.js');
const appConfig = require('../../config.js');

baseConfig.plugins.push(new UglifyJsPlugin({
  parallel: true,
  sourceMap: true,
  uglifyOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },
  extractComments: true,
}));

// webpack analyse
if(buildConfig.analyse){
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  baseConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = Object.assign(baseConfig, {
  mode: 'production',
});
