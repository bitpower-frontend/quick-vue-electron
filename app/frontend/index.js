import Vue from 'vue';
import iview from 'iview';
import api from './api';
import util from './util';
import config from './config';
import store from './store';
import filters from './filter';
import { router, routes } from './router.js';
import App from './page/app.vue';
import './style/index.less';

if(config.device === 'client' && window.require){
  // 获取 electron 相关实例方法
  const ET = {
    ipcRenderer: window.require('electron').ipcRenderer,
    dialog: window.require('electron').remote.dialog,
  };
  window.ET = ET;
}

function installPlugin(plugin, name){
  window[name] = plugin;
  plugin.install = function(Vue, options){
    Vue.prototype[name] = this;
  };
  Vue.use(plugin);
}

installPlugin(api, 'api');
installPlugin(util, 'util');
installPlugin(config, 'config');
// use iview
Vue.use(iview);
// global event hub
Vue.use(new Vue(), 'eventHub');
// register filters
Object.keys(filters).forEach(name => {
  Vue.filter(name, filters[name]);
});

const app = new Vue({
  el: '#app',
  store,
  router,
  render: h => {
    return h(App);
  }
});

window.app = app;