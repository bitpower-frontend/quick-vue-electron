// your global vue mixins

export default {
  data (){
    return {
      // 保存组件所有在 eventHub 上监听的事件回调，便于在组件销毁时移除
      hubEvents: [],
    };
  },
  beforeDestroy (){
    // 移除事件监听
    if(this.hubEvents && this.hubEvents.length){
      for(const event of this.hubEvents){
        this.$eventHub.$off(event.event, event.callback);
      }
    }
  },
  methods: {
    // 统一响应处理函数
    resolveRes (res, opt){
      opt = Object.assign({
        showInfo: false,      // 是否显示提示信息
        showWarn: true,       // 是否显示警告信息
        showError: true,      // 是否显示报错信息
        title: '',            // 显示的信息前缀
      }, opt || {});

      const level = Number(res.data.err.level);
      const msg = opt.title ? `[${opt.title}] ${res.data.err.msg}` : res.data.err.msg;
      const data = res.data.data;

      switch(level){
      case 0: // 成功
        break;
      case 1: // 提示
        if(opt.showInfo){
          this.$Message.info(msg);
          console.info(`[Info] ${msg}`);
        }
        break;
      case 2: // 警告
        if(opt.showWarn){
          this.$Message.warning(msg);
          console.warn(`[Warn] ${msg}`);
        }
        break;
      case 3: // 错误
        /* if(opt.showError){
          this.$Message.error(msg);
        } */
        // 把错误抛出让外层处理函数处理（如 resolveError）
        throw new Error(`${msg}`);
      default: // 其他
        throw new Error(`无效错误级别：${level}`);
      }
      return data;
    },
    // 统一错误处理函数
    resolveError (err, opt){
      opt = Object.assign({
        silent: false,      // 静默报错
        title: '',          // 显示的信息前缀
      }, opt || {});

      if(!opt.silence){
        this.$Message.error(`请求出错: ${err.message}`);
      }
      console.error(`[Error: resolveError] ${opt.title}: ${err.stack}`);
    },
    // 此事件监听会在组件销毁时自动移除所绑定的事件
    listen (event, callback){
      this.hubEvents.push({ event, callback });
      this.$eventHub.$on(event, callback);
    },
  },
};
