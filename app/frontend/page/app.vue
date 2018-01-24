<template>
  <div id="app" :style="paddingStyle">
    <nav-menu v-show="!fullScreen"></nav-menu>
    <side-menu v-show="!fullScreen"></side-menu>
    <keep-alive :exclude="excludePages">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import navMenu from '../component/nav-menu.vue';
  import sideMenu from '../component/side-menu.vue';
  export default {
    name: 'app',
    components: {
      navMenu,
      sideMenu,
    },
    data (){
      return {
        excludePages: [],
      };
    },
    computed: {
      fullScreen (){
        return ['login'].includes(this.$route.name);
      },
      paddingStyle (){
        return this.fullScreen ? {
          paddingTop: 0, 
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
        } : {
          paddingTop: '60px', 
          paddingLeft: '250px',
          paddingRight: '10px',
          paddingBottom: '10px',
        };
      },
    },
    created (){
      this.api.test.sayHi().then(res => {
        console.log(res);
        this.$Message.info(res.data.data);
      });
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
    }
    #side-menu {
      position: absolute;
      top: 50px;
      left: 0;
      bottom: 0;
    }
  }
</style>