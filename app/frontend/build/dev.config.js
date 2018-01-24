const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./base.config.js');
const buildConfig = require('./config.js');
const appConfig = require('../config');

baseConfig.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('development')
}));

// webpack analyse
if(buildConfig.analyse){
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  base.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = Object.assign(baseConfig, {
  devServer:{
    // host: appConfig.devServer.host,
    port: appConfig.devServer.port,
    inline: true,
    contentBase: path.join(__dirname, '../../'),
    proxy: {
      '/api/*': {
        target: `${appConfig.server.host}:${appConfig.server.port}`,
        secure: false,
        changeOrigin: true,
      }
    },
  }
});