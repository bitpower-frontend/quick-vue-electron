<template>
  <div id="home">
    <page-header name="首页"></page-header>
  </div>
</template>

<script>
  import pageHeader from '../component/page-header.vue';
  export default {
    name: 'home',
    components: {
      pageHeader,
    },
    data (){
      return {
        //
      };
    },
  };
</script>

<style lang= "less">
  #home {
    height: 100%;
  }
</style>