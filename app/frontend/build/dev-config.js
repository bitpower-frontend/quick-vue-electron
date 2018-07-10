const path = require('path');
const baseConfig = require('./base-config.js');
const buildConfig = require('./config.js');
const appConfig = require('../../config.js');

// webpack analyse
if (buildConfig.analyse) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  baseConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = Object.assign(baseConfig, {
  devServer:{
    port: appConfig.devPort,
    inline: true,
    contentBase: path.join(__dirname, '../../'),
    proxy: {
      '/api/*': {
        target: `http://${appConfig.host}:${appConfig.port}`,
        secure: false,
        changeOrigin: true,
      }
    },
  }
});
