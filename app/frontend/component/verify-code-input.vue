// 验证码输入框
<template>
  <Input :maxlength='30' :value="value" placeholder="请输入验证码" @on-change="onValueChange">
    <span slot="append">
      <Button class="send-verify-code-btn" @click="send" :disabled="sending">{{ promptText }}</Button>
    </span>
  </Input>
</template>

<script>
  export default {
    name: 'veify-code-input',
    props: {
      value: String,
      waitingTime: {
        type: Number,
        default: 60,
      },
      canSend: {
        type: Function,
        default: () => Promise.resolve(),
      },
    },
    data () {
      return {
        sending: false,
        promptText: '获取验证码',
      };
    },
    methods: {
      send () {
        if (this.sending) return;
        this.sending = true;
        this.canSend().then(() => {
          let waitingTime = this.waitingTime;
          // this.sending = true;
          this.promptText = `验证码已发送(${waitingTime})`;
          const sendVerifyCodeIns = setInterval(() => {
            if (waitingTime <= 0) {
              clearInterval(sendVerifyCodeIns);
              this.sending = false;
              this.promptText = '获取验证码';
            } else this.promptText = `验证码已发送(${--waitingTime})`;
          }, 1000);
          this.$emit('send');
        }).catch(err => {
          this.$Message.warning(err.message);
          this.sending = false;
        });
      },
      onValueChange (e) {
        // console.log('>>> veify-code-input value change', e.target.value);
        this.$emit('input', e.target.value);
      },
    },
  };
</script>

