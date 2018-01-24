<template>
  <div class="page-header">
    <h1 class="title">
      {{ name || '--' }}
      <span class="right">
        <slot name="right"></slot>
      </span>
    </h1>
  </div>
</template>

<script>
  export default {
    name: 'page-header',
    props: ['name']
  };
</script>

<style lang= "less">
  .page-header {
    h1 {
      &.title {
        padding-bottom: 5px;
        border-bottom: 1px solid #eee;
        margin-bottom: 20px;
        font-weight: normal;
        &:before {
          content: '';
          color: #ff6600;
          border-right: 4px solid #ff6600;
          margin-right: 10px;
        }
        .right {
          float: right;
        }
      }
    }
  }
</style>
