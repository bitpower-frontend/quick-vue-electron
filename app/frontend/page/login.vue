<template>
  <div id="login">
    <div class="wrapper">
      <Form>
        <img src="../../static/img/logo.png" alt="">
        <!-- 登录 -->
        <div class="login-panel" v-if="action==='login'">
          <Tabs v-model="loginType">
            <TabPane label="账号密码登录" name="accountLogin">
              <Input :maxlength='30' v-model="accountLogin.userName" placeholder="请输入用户名" @on-enter="login"></Input>
              <Input :maxlength='30' v-model="accountLogin.password" placeholder="请输入密码" type="password" @on-enter="login"></Input>
              <Button class="login-btn" type="primary" @click="login" long>登录</Button>
            </TabPane>
            <TabPane label="手机验证码登录" name="mobileLogin">
              <Input :maxlength='30' v-model="mobileLogin.mobile" placeholder="请输入手机号" @on-enter="login"></Input>
              <verify-code-input v-model="mobileLogin.verifyCode" :can-send="sendVerifyCode(mobileLogin.mobile)"></verify-code-input>
              <Button class="login-btn" type="primary" @click="login" long>登录</Button>
            </TabPane>
          </Tabs>
          <div class="action">
            <span class="left">
              <Checkbox label="remember-password" v-model="rememberPassword" v-show="loginType==='accountLogin'">记住密码</Checkbox>
            </span>
            <span class="right">
              <Button type="text" class="register-btn" @click="openLink('https://github.com/join?source=header-home')">立即注册</Button>
              <Button type="text" class="forget-password-btn" @click="openLink('https://github.com/password_reset')">忘记密码？</Button>
            </span>
          </div>
        </div>
      </Form>
      <div class="footer">
        <p class="slogan">Designed By Hisheng</p>
      </div>
    </div>
  </div>
</template>

<script>
  import verifyCodeInput from '../component/verify-code-input.vue';

  export default {
    name: 'login',
    components: {
      verifyCodeInput,
    },
    data () {
      return {
        // loginType
        loginType: 'accountLogin',
        // account login
        accountLogin: {
          userName: '',
          password: '',
        },
        // mobile login
        mobileLogin: {
          mobile: '',
          verifyCode: '',
        },
        // if save password
        rememberPassword: false,
        // 上次是否记住密码
        isPasswordSavedLastTime: false,
        // 忘记密码
        forgetPassword: {
          mobile: '',
          verifyCode: '',
          showNext: false,
          // password: '',
          newPassword: '',
        },
        isLogining: false,
      };
    },
    computed: {
      // 动作，登录或者忘记密码 login/forget-password
      action () {
        return this.$route.query.action || 'login';
      }
    },
    mounted () {
      // if from relogin, disable enter key login
      if (this.$route.query.from !== 'relogin') {
        document.addEventListener('keyup', this.onEnter);
      }
    },
    beforeDestroy () {
      document.removeEventListener('keyup', this.onEnter);
    },
    methods: {
      onEnter (e) {
        if (e.keyCode === 13) {
          this.login();
        }
        e.preventDefault();
      },
      login () {
        if (this.isLogining) return;
        if (this.loginType === 'accountLogin') { // 账号密码登录
          if (!this.accountLogin.userName.trim() || !this.accountLogin.password.trim()) {
            this.$Message.warning('请输入有效的账号密码');
            return;
          }
          this.isLogining = true;
          this.$store.commit('showLoadingMask', '登录中...');
          this.$api.common.login(this.accountLogin.userName, this.accountLogin.password, this.rememberPassword)
            .then(this.resolveRes)
            .then(data => {
              this.afterLogin(data);
              console.log('>>> login', data);
            })
            .catch(this.resolveError)
            .finally(() => {
              this.$store.commit('hideLoadingMask');
              this.isLogining = false;
          });
        } else if (this.loginType === 'mobileLogin') { // 手机验证码登录
          if (!this.mobileLogin.mobile.trim() || !this.mobileLogin.verifyCode.trim()) {
            this.$Message.warning('请输入有效的手机号码和验证码');
            return;
          }
          if (!this.$util.tool.isVerifyCodeValid(this.mobileLogin.verifyCode)) {
            this.$Message.error('验证码格式不正确');
            return;
          } else if (!this.$util.tool.isMobileValid(this.mobileLogin.mobile)) {
            this.$Message.error('手机号格式不正确');
            return;
          }
          this.isLogining = true;
          this.$store.commit('showLoadingMask', '登录中...');
          console.log('>>> 手机验证码登录', this.mobileLogin.mobile, this.mobileLogin.verifyCode);
          this.$api.common.mobileLogin(this.mobileLogin.mobile, this.mobileLogin.verifyCode)
            .then(this.resolveRes)
            .then(data => {
              this.afterLogin(data);
              console.log('>>> login', data);
            })
            .catch(this.resolveError)
            .finally(() => {
              this.$store.commit('hideLoadingMask');
              this.isLogining = false;
          });
        }
      },
      afterLogin (data) {
        this.$Message.success('登录成功');
        if (this.$config.device === 'desktop') {
          /* global ET */
          ET.ipcRenderer.send('login');
        }
        const user = {
          id: data.id,
          name: data.name,
          groupId: data.groupId,
          roles: data.roles,
        };
        this.$store.commit('setUserInfo', user);
        this.$eventHub.$emit('app/login@loginSuccess');
        this.$router.push('/home');
      },
      openLink (url) {
        if (this.$config.device === 'desktop') {
          ET.shell.openExternal(url);
        } else window.open(url);
      },
      // send verify code
      sendVerifyCode (mobile) {
        return function() {
          return new Promise((resolve, reject) => {
            if (!mobile.trim()) {
              reject(new Error('请先填写手机号'));
            } else if (!this.$util.tool.isMobileValid(mobile)) {
              reject(new Error('请输入有效的手机号'));
            } else {
              this.$Message.info('验证码发送中');
              // mock request
              setTimeout(() => {
                this.$Message.success('验证码已发送');
                resolve();
              }, 2000);
            }
          });
        };
      },
    },
  };
</script>

<style lang="less">
  #login {
    height: 100%;
    background-image: url('../../static/img/bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    position: relative;
    .wrapper {
      z-index: 2;
      background-color: transparent;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      form {
        z-index: 2;
        width: 300px;
        padding-top: 160px;
        margin: 0 auto;
        > img {
          width: 80px;
          height: 80px;
          display: block;
          margin: 0 auto;
          margin-bottom: 30px;
        }
        .ivu-tabs {
          .nav-text.ivu-tabs-nav {
            width: 100%;
          }
          .ivu-tabs-tab {
            color: #ffffff;
            margin-right: 0;
            width: 150px;
            text-align: center;
          }
        }
        .action {
          z-index: 100;
          margin-top: 10px;
          .ivu-btn {
            color: #666666;
            color: #ffffff;
            padding: 0;
            font-size: 14px;
            margin-left: 8px;
          }
          .ivu-checkbox-wrapper {
            color: #ffffff;
          }
          .right {
            float: right;
          }
        }
        label {
          display: inline-block;
          margin-bottom: 5px;
          color: #9ea7b4;
          font-size: 1.167em;
        }
        h2 {
          color: #000000;
          font-size: 28px;
          text-align: center;
          margin-bottom: 20px;
          font-weight: normal;
        }
        .ivu-input-wrapper {
          margin-bottom: 15px;
        }
        .ivu-input {
          text-align: center;
          &:focus, &:hover {
            outline: none;
            box-shadow: none;
          }
        }
      }
      .footer {
        position: absolute;
        bottom: 25px;
        width: 100%;
        padding-right: 10px;
        text-align: center;
        .slogan {
          color: #ffffff;
          letter-spacing: .5px;
          font-size: 12px;
        }
      }
    }
  }
</style>
