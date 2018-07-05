<template>
  <div id="nav-menu">
    <a href='javascript:;' class="logo" @click='showModal = true'>
      <img src="../../static/img/logo.png" alt="">
      <span class="title">{{ $config.appName }}</span>
    </a>
    <div class="right">
      <!-- 用户头像 -->
      <a href="javascript:;" class="nav-button user" v-if="user && false">
        <img :src="user.avatar" alt="">
        <Icon type="arrow-down-b" size="13"></Icon>
        <Icon type="arrow-up-b" size="13"></Icon>
        <!-- 下拉面板 -->
        <ul class="more">
          <a href="javascript:;" @click="execute('logout')">
            <li><Icon type="power" size="17"></Icon> 退出账号</li>
          </a>
        </ul>
      </a>
      <!-- 最小化 -->
      <a href="javascript:;" @click="execute('minimize')" class="nav-button"><Icon type="minus" size="17"></Icon></a>
      <!-- 最大化/还原 -->
      <a href="javascript:;" @click="execute('maximize')" class="nav-button"><Icon :type="maximized?'arrow-shrink':'arrow-expand'" size="20"></Icon></a>
      <!-- 关闭软件 -->
      <a href="javascript:;" @click="execute('close')" class="nav-button"><Icon type="close" size="17"></Icon></a>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex';
import { setTimeout } from 'timers';
  export default {
    name: 'nav-menu',
    data (){
      return {
        currentMenuName: 'home',
        maximized: false,
        showModal: false,
      };
    },
    computed: {
      ...mapState(['user']),
      ...mapGetters(['logined']),
      isDeskTop (){
        return this.$config.device === 'desktop';
      },
    },
    created (){
      if(this.isDeskTop){
        window.ET.ipcRenderer.on('maximizeMainWindowSuccess', (event, args) => {
          this.maximized = args === 'maximized';
        });
      }
      this.$eventHub.$on('windowResize', () => {
        this.maximized = (screen.availWidth === window.outerWidth);
      });
    },
    methods: {
      execute (action){
        console.log('execute', action);
        if(['close', 'maximize', 'minimize'].includes(action) && !this.isDeskTop){
          this.$Message.warning('浏览器环境下无法执行此操作');
          return;
        }
        switch(action){
          // 关闭
          case 'close':
            this.$Modal.confirm({
              title: '关闭程序',
              content: '您确定要关闭程序？',
              onOk: () => {
                if(this.logined){
                  this.$store.commit('showLoadingMask', '正在退出登录，请稍等...');
                  this.logout().then(() => {
                    ET.ipcRenderer.send('exit');
                  }).catch(err => {
                    this.$Message.error(`登出失败：${err.message}`);
                  }).finally(() => {
                    this.$store.commit('hideLoadingMask');
                  });
                }else {
                  ET.ipcRenderer.send('exit');
                }
              },
            });
            break;
          // 最大化/还原
          case 'maximize':
            ET.ipcRenderer.send('maximizeMainWindow');
            break;
          // 最小化
          case 'minimize':
            ET.ipcRenderer.send('minimizeMainWindow');
            break;
          // 登出
          case 'logout':
            this.$Modal.confirm({
              title: '登出',
              content: '您确定要登出？',
              onOk: () => {
                this.logout().then(() => {
                  if(this.isDeskTop){
                    ET.ipcRenderer.send('logout');
                  }else window.location.reload(true);
                }).catch(err => {
                  this.$Message.error(`登出失败：${err.message}`);
                });
              }
            });
            break;
          // 返回
          case 'back':
            this.$router.go(-1);
            break;
          default:
            break;
        };
      },
      // 退出登录
      logout (from = 'normal'){
        if(this.logined){
          // mock
          return new Promise((resolve, reject) => {
            setTimeout(resolve, 2000);
          });
        }else return Promise.reject(new Error('用户尚未登录'));
      },
    }
  };
</script>

<style lang= "less">
  #nav-menu {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    line-height: 50px;
    box-sizing: content-box;
    /* background-color: #1c1e1e;
    color: #ffffff; */
    box-shadow: 0 1px 10px 1px rgba(0,0,0,.1);
    padding-left: 20px;
    padding-right: 6px;
    .logo {
      display: inline-block;
      -webkit-app-region: no-drag;
      /* color: #ffffff; */
      img {
        display: inline-block;
        vertical-align: middle;
        margin-top: -8px;
        width: 24px;
        height: 24px;
      }
      .title {
        padding-left: 10px;
        font-size: 16px;
      }
    }
    .right {
      display: inline-block;
      float: right;
      -webkit-app-region: no-drag;
      .nav-button {
        display: inline-block;
        height: 100%;
        padding: 0 14px;
        font-weight: normal;
        /* color: #9c9c9c;
        &:hover {
          color: #c63a3a;
        } */
      }
      .nav-button.user {
        position: relative;
        margin-right: 35px;
        img {
          display: inline-block;
          vertical-align: middle;
          margin-top: -5px;
          width: 30px;
          height: 30px;
        }
        .ivu-icon {
          color: #ffffff;
          margin-left: 5px;
        }
        .ivu-icon-arrow-down-b {
          display: inline-block;
        }
        .ivu-icon-arrow-up-b {
          display: none;
        }
        &:hover {
          background-color: #262626;
          /* height: 168px; */
          height: 118px;
          .more {
            display: block;
          }
          .ivu-icon-arrow-down-b {
            display: none;
          }
          .ivu-icon-arrow-up-b {
            display: inline-block;
          }
        }
        .more {
          position: absolute;
          display: none;
          z-index: 999;
          top: 68px;
          left: 0;
          width: 200px;
          background-color: #262626;
          color: #ffffff;
          list-style: none;
          &:hover {
            display: block !important;
          }
          a {
            display: block;
            color: inherit;
            height: 50px;
            line-height: 50px;
            padding-left: 15px;
            font-size: 14px;
            .ivu-icon {
              margin-right: 5px;
              font-weight: 400;
            }
            &:hover {
              background-color: #1c1e1e;
            }
          }
        }
      }
    }
    -webkit-app-region: drag;
    -webkit-user-select: none;
  }
</style>