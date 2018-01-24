// API config
import axios from 'axios';

// use if you need
/*axios.interceptors.request.use(config => {
  console.log('\n\n');
  console.group('[REQUEST]');
  const info = [{
    '请求名称': config.meta && config.meta.title,
    '请求命令': config.data.msgType,
  }];
  console.table(info);
  console.log(config.data);
  console.groupEnd();

  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  console.log('\n\n');
  console.group('[RESPONSE]');
  const ifof = window.ifof;
  const level = Number(response.data.msgBody.err.level);
  const msg = response.data.msgBody.err.MSGInfo;
  const info = [{
    '请求名称': response.config.meta && response.config.meta.title,
    '请求命令': response.data.msgType,
    '错误级别': level,
    '错误信息': msg,
    // '数据': response.data.msgBody.data,
  }];
  console.table(info);
  console.log(response.data.msgBody.data || response.data.msgBody);
  console.groupEnd();

  if(level < 3){
    if(level === 1){
      ifof && ifof.$Message.info(msg);
    }else if(level === 2){
      ifof && ifof.$Message.warning({
        content: msg,
        duration: 3
      });
    }
    return response;
  }
  return response;
}, error => {
  return Promise.reject(error);
});*/

module.exports = {
  http: axios,
  api: '/api',
  dllApi: '/api/dll/invoke',
};