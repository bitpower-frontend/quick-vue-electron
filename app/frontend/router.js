import Vue from "vue";
import VueRouter from "vue-router";
// pages
import login from './page/login.vue';
import home from './page/home.vue';
// data manage
import dataManage from './page/data-manage/index.vue';
import dataManageQuotes from './page/data-manage/quotes.vue';
import dataManageAnalysis from './page/data-manage/analysis.vue';
// user manage
import userManage from './page/user-manage/index.vue';
import userManageRecord from './page/user-manage/record.vue';
import userManagePrivileges from './page/user-manage/privileges.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', name: 'home', component: home },
    { path: '/login', name: 'login', component: login },
    {
      path: '/data-manage',
      component: dataManage,
      children: [
        {
          path: '',
          name: 'data-manage/index',
          redirect: 'quotes',
        },
        {
          path: 'quotes',
          name: 'data-manage/quotes',
          component: dataManageQuotes,
        },
        {
          path: 'analysis',
          name: 'data-manage/analysis',
          component: dataManageAnalysis,
        },
      ]
    },
    {
      path: '/user-manage',
      component: userManage,
      children: [
        {
          path: '',
          name: 'user-manage/index',
          redirect: 'record',
        },
        {
          path: 'record',
          name: 'user-manage/record',
          component: userManageRecord,
        },
        {
          path: 'privileges',
          name: 'user-manage/privileges',
          component: userManagePrivileges,
        },
      ]
    },
  ]
});

const routes = [];

module.exports.routes = routes;

module.exports.router = router;