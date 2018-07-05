import Vue from "vue";
import VueRouter from "vue-router";
import store from './store';

// pages
import login from './page/login.vue';
import home from './page/home.vue';
// data manage
const dataManage = resolve => require(['./page/data-manage/index.vue'], resolve);
const dataManageQuotes = resolve => require(['./page/data-manage/quotes.vue'], resolve);
const dataManageAnalysis = resolve => require(['./page/data-manage/analysis.vue'], resolve);
// user manage
const userManage = resolve => require(['./page/user-manage/index.vue'], resolve);
const userManageRecord = resolve => require(['./page/user-manage/record.vue'], resolve);
const userManagePrivileges = resolve => require(['./page/user-manage/privileges.vue'], resolve);
// page design
const pageDesign = resolve => require(['./page/page-design/index.vue'], resolve);

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: 'hash',
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', name: 'login', component: login },
  ]
});

// router hooks
router.beforeEach((to, from, next) => {
  if(window.app && window.app.$Loading){
    window.app.$Loading.start();
  }
  if(!store.getters.logined){
    if(to.path !== '/login'){
      next('/login');
    }else next();
  }else {
    if(to.path === '/login'){
      next('/');
    }else next();
  }
});

router.afterEach((to, from) => {
  if(window.app && window.app.$Loading){
    window.app.$Loading.finish();
  }
});

// routes loaded after login
const routesAfterLogin = [
  { path: '/home', name: 'home', component: home },
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
  { path: '/page-design', name: 'page-design', component: pageDesign },
];

Vue.prototype.$routesAfterLogin = routesAfterLogin;
