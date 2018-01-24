<template>
  <div id="user-manage">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'user-manage'
  }
</script>

<style lang= "less">
  #user-manage {
    height: 100%;
    max-height: 100%;
  }
</style>