import Vue from 'vue';
import iView from 'iview';
import api from './api';
import util from './util';
import config from '../config.js';
import store from './store';
import filters from './filter';
import mixin from './mixin';
import { router } from './router.js';
import App from './page/app.vue';
import './style/index.less';

if (config.device === 'desktop' && window.require) {
  const ET = {
    ipcRenderer: window.require('electron').ipcRenderer,
    remote: window.require('electron').remote,
    shell: window.require('electron').shell,
  };
  window.ET = ET;
}

function installPlugin(plugin, name) {
  // exposed to global
  window[name] = plugin;
  plugin.install = function(Vue, options) {
    Vue.prototype[name] = this;
  };
  Vue.use(plugin);
}

installPlugin(api, '$api');
installPlugin(util, '$util');
installPlugin(config, '$config');
installPlugin(new Vue(), '$eventHub');

// register filters
Vue.use(filters);
// global mixin
Vue.mixin(mixin);
// use iview
Vue.use(iView);

const app = new Vue({
  el: '#app',
  store,
  router,
  render: h => {
    return h(App);
  }
});

window.app = app;
