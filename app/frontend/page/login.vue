<template>
  <div id="login">
    <Form>
      <h2>{{ config.appName }}</h2>
      <Input :maxlength='30' v-model="userName" placeholder="请输入用户名" :autofocus="!this.userName" @on-enter="login"></Input>
      <Input :maxlength='30' v-model="password" placeholder="请输入密码" type="password" @on-enter="login" :autofocus="!!this.userName"></Input>
      <Button class="login-btn" type="primary" @click="login" long>登录</Button>
    </Form>
    <div class="footer">
      <p class="company">BITPOWER</p>
      <p class="slogan">科技驱动&nbsp;&nbsp;创新金融</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data (){
      return {
        userName: '',
        password: '',
      };
    },
    methods: {
      login (){},
    },
  };
</script>

<style lang="less">
  #login {
    height: 100%;
    background-image: url('../../static/img/bg.jpg');
    form {
      width: 300px;
      padding-top: 200px;
      margin: 0 auto;
      label {
        display: inline-block;
        margin-bottom: 5px;
        color: #9ea7b4;
        font-size: 1.167em;
      }
      h2 {
        /*color: #999;*/
        color: #fff;
        font-size: 22px;
        text-align: center;
        margin-bottom: 20px;
      }
      .ivu-input-wrapper {
        margin-bottom: 15px;
      }
      .ivu-input {
        border-radius: 0px;
        // background-color: rgba(0,0,0,.2);
        border: none;
        text-align: center;
        // color: #ffffff;
        &:focus, &:hover {
          border: none;
          /*border-color: transparent;*/
          /*border-color: #dddee1;*/
          outline: none;
          box-shadow: none;
        }
        /*&::-webkit-input-placeholder {
          color: #f2f2f2;
        }*/
      }
      .login-btn {
        border-radius: 0;
        opacity: .8;
      }
    }
    .footer {
      position: absolute;
      bottom: 25px;
      width: 100%;
      padding-right: 10px;
      text-align: center;
      .company, .slogan {
        text-align: center;
        font-weight: 600;
        color: #fff;
      }
      .company {
        margin-top: 15px;
        font-size: 20px;
      }
      .slogan {
        margin-top: 5px;
        font-size: 14px;
      }
    }
  }
</style>