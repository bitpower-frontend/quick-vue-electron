<template>
  <Menu :active-name="$route.path" id="side-menu" @on-select="selectMenu" width="150">
    <div v-for="(menu,i) in menus" :key="i">
      <Menu-item :name="menu.path" v-if="!(menu.subMenus && menu.subMenus.length)">
        {{ menu.name }}
      </Menu-item>
      <Submenu :name="menu.path" v-else>
        <template slot="title">
          {{ menu.name }}
        </template>
        <Menu-item :name="subMenu.path" v-for="(subMenu,j) in menu.subMenus" :key="subMenu.path">
          {{ subMenu.name }}
        </Menu-item>
      </Submenu>
    </div>
  </Menu>
</template>

<script>
  export default {
    name: 'side-menu',
    data () {
      return {
        menus: [
          {
            name: '数据管理',
            path: '/data-manage',
            subMenus: [
              {
                name: '行情数据',
                path: '/data-manage/quotes',
              },
              {
                name: '统计数据',
                path: '/data-manage/analysis',
              },
            ],
          },
          {
            name: '用户管理',
            path: '/user-manage',
            subMenus: [
              {
                name: '信息登记',
                path: '/user-manage/record',
              },
              {
                name: '权限设置',
                path: '/user-manage/privileges',
              },
            ],
          },
          {
            name: '页面快速定制',
            path: '/page-design',
          },
        ],
      };
    },
    methods: {
      selectMenu (name) {
        this.$router.push(name);
      },
    }
  };
</script>

<style lang= "less">
  #side-menu {
    box-shadow: 1px 2px 10px 1px rgba(0,0,0,.1);
  }
</style>
