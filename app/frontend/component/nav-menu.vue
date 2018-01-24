<template>
  <Menu mode="horizontal" theme="light" active-name="home" id="nav-menu" @on-select="selectMenu">
    <!-- 首页 -->
    <Menu-item name="home" class="home site-name">
      <div class="logo"></div>
      <span class="version">{{ config.appName }}</span>
    </Menu-item>
    <!-- 关闭 -->
    <Menu-item name="close" class="close right" title="关闭程序">
      <Icon type="close" />
    </Menu-item>
    <!-- 最大化/还原 -->
    <Menu-item name="maximize" class="maximize right" :title="maximized?'还原':'最大化'">
      <Icon :type="maximized?'arrow-shrink':'arrow-expand'" size="17" />
    </Menu-item>
    <!-- 最小化 -->
    <Menu-item name="minimize" class="minimize right" title="最小化">
      <Icon type="minus" />
    </Menu-item>
    <!-- 退出登录 -->
    <Menu-item name="logout" class="logout right" title="登出" v-if="logined">
      <Icon type="power" size="17"></Icon>
    </Menu-item>
    <!-- 登录 -->
    <Menu-item name="login" class="login right" v-if="!logined">
      登录
    </Menu-item>
    <!-- 返回按钮 -->
    <Menu-item name="back" class="back right" title="返回" v-show="showBackBtn">
      <Icon type="android-arrow-back" size="21"></Icon>
    </Menu-item>
  </Menu>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'nav-menu',
    data (){
      return {
        currentMenuName: 'home',
        maximized: false,
      };
    },
    computed: {
      ...mapGetters(['logined']),
      // 是否显示返回按钮
      showBackBtn (){
        return false;
      },
    },
    methods: {
      selectMenu (menuName){
        console.log('selectMenu', menuName);
        if(['close', 'maximize', 'minimize'].includes(menuName)){
          if(!window.ET){
            this.$Message.warning('浏览器环境下无法执行此操作');
            return;
          }
        }
        switch(menuName){
          // 关闭
          case 'close':
            this.logout('close');
            this.$store.commit('showLoadingMask', '正在退出登录，请稍等...');
            setTimeout(() => {
              this.$store.commit('hideLoadingMask');
              ET.ipcRenderer.send('closeMainWindow');
            }, 1000);
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
                this.logout();
              }
            });
            break;
          // 返回
          case 'back':
            this.$router.go(-1);
            break;
          default:
            this.currentMenuName = menuName;
            this.$router.push('/'+menuName);
            break;
        };
      },
      // 退出登录
      logout (){
        this.$router.push('/login');
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
    -webkit-app-region: drag;
    -webkit-user-select: none;
    .ivu-menu-item {
      -webkit-app-region: no-drag;
    }
    .right {
      float: right;
    }
    .site-name.ivu-menu-item-selected,
    .right.ivu-menu-item-selected {
      color: inherit;
      border-bottom: none;
    }
    .site-name.ivu-menu-item-selected:hover,
    .right.ivu-menu-item-selected:hover {
      color: #ff6600;
      border-bottom: 2px solid #ff6600;
    }
    .site-name {
      /*color: #ff6600;*/
      opacity: .95;
      display: flex;
      align-items: center;
      /* background: -webkit-linear-gradient(top, #ff6600 , #dd4400);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent; */
      .logo {
        width: 40px;
        height: 40px;
        background-image: url('../../static/img/logo.png');
        background-repeat: no-repeat;
        background-size: contain;
      }
      .version {
        margin-left: 10px;
        font-size: 18px;
        font-weight: bold;
      }
      .username {
        font-size: 12px;
        margin-left: 15px;
      }
    }
  }
</style>