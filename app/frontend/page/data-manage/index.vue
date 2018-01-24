<template>
  <div id="data-manage">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'data-manage'
  }
</script>

<style lang= "less">
  #data-manage {
    height: 100%;
    max-height: 100%;
  }
</style>