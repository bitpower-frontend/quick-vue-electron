const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve (xpath) {
  return path.join(__dirname, '../../', xpath);
}

const distPath = resolve('./static/dist');

const plugins = [
  new CleanWebpackPlugin([distPath], {
    allowExternal: true,
  }),
  new VueLoaderPlugin(),
];

const rules = [
  {
    test: /\.vue$/,
    loader: 'vue-loader',
  },
  // { test: /iview.src.*?js$/, loader: 'babel-loader' }, // iview 按需引用必须加这句
  {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
  },
  {
    test: /-worker\.js$/,
    loader: 'worker-loader',
  },
  {
    test: /\.svg$/,
    loader: 'svg-sprite-loader',
    include: [resolve('./static/icon')],
    options: {
      symbolId: 'x-icon-[name]',
    },
  },
  {
    test: /\.(png|jpg|gif|svg|ttf|eot|woff|otf)$/,
    loader: 'file-loader',
    exclude: [resolve('./static/icon')],
    options: {
      name: '[name].[hash:8].[ext]',
    },
  },
  { test: /\.css$/, loader: 'style-loader!css-loader' },
  { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
];

module.exports = {
  mode: 'development',
  entry: {
    app: resolve('./frontend/index.js'),
  },
  output: {
    path: distPath,
    filename: '[name].bundle.js',
    // chunkFilename: '[name].[chunkhash:4].piece.js',
    publicPath: '/static/dist/',
    globalObject: 'this'
  },
  // devtool: 'inline-source-map',
  optimization: {
    // runtimeChunk: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          reuseExistingChunk: true,
        },
        /* commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2,
          reuseExistingChunk: true,
        }, */
      },
    },
  },
  plugins,
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    /* alias: {
      vue: 'vue/dist/vue.esm.js'
    } */
  }
};
