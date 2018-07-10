<template>
  <div id="app" :style="paddingStyle">
    <nav-menu></nav-menu>
    <side-menu v-show="!fullScreen" v-if="logined"></side-menu>
    <keep-alive :exclude="keepAliveComponents.exclude" :include="keepAliveComponents.include">
      <router-view></router-view>
    </keep-alive>
    <!-- loading mask -->
    <div id="loading-mask" v-show="loadingMaskVisible">
      <div class="inner">
        <Spin size="large"></Spin>
        <div class="msg" v-html="loadingMaskText"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import navMenu from '../component/nav-menu.vue';
  import sideMenu from '../component/side-menu.vue';
  import { mapState, mapGetters } from 'vuex';

  export default {
    name: 'app',
    components: {
      navMenu,
      sideMenu,
    },
    data () {
      return {
        //
      };
    },
    computed: {
      ...mapState(['loadingMaskVisible', 'loadingMaskText', 'keepAliveComponents']),
      ...mapGetters(['logined']),
      fullScreen () {
        return ['login'].includes(this.$route.name);
      },
      paddingStyle () {
        return this.fullScreen ? {
          paddingTop: '50px',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
        } : {
          paddingTop: '60px', 
          paddingLeft: '150px',
          paddingRight: '10px',
          paddingBottom: '10px',
        };
      },
    },
    created () {
      this.listen('app/login@loginSuccess', () => {
        this.addRoutesDynamically();
      });
    },
    methods: {
      addRoutesDynamically () {
        this.$router.addRoutes(this.$routesAfterLogin);
      },
    },
  };
</script>

<style lang= "less">
  #app {
    height: 100%;
    position: relative;
    padding: 10px;
    #nav-menu {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
    }
    #side-menu {
      position: absolute;
      top: 51px;
      left: 0;
      bottom: 0;
    }
    #loading-mask {
      position: fixed;
      top: -50px;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,.55);
      z-index: 99999;
      text-align: center;
      .inner {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        margin-top: -100px;
        text-align: center;
        .ivu-spin {
          display: inline-block;
        }
        .msg {
          color: #eee;
          margin-top: 10px;
          font-size: 14px;
          line-height: 2.0;
        }
      }
    }
  }
</style>
