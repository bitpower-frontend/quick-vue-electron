<template>
  <div id="page-design">
    <page-header name="页面快速定制"></page-header>
    <Tabs value="create-menu">
      <TabPane label="创建菜单" name="create-menu">
        <Form>
          <FormItem label="菜单文件夹名">
            <Input placeholder="菜单文件夹名"></Input>
          </FormItem>
          <FormItem label="菜单标题">
            <Input placeholder="菜单标题"></Input>
          </FormItem>
          <FormItem label="路由">
            <Input placeholder="路由"></Input>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="创建页面" name="create-page">
        <Form>
          <FormItem label="页面文件名">
            <Input placeholder="页面文件名"></Input>
          </FormItem>
          <FormItem label="页面标题">
            <Input placeholder="页面标题"></Input>
          </FormItem>
          <FormItem label="路由">
            <Input placeholder="路由"></Input>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import pageHeader from '../../component/page-header.vue';
  export default {
    name: 'page-design',
    components: {
      pageHeader,
    }
  }
</script>

<style lang= "less">
  #page-design {
    height: 100%;
    max-height: 100%;
  }
</style>