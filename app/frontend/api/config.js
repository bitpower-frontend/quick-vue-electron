// API config
import axios from 'axios';
import _cloneDeep from 'lodash/cloneDeep';

export const http = axios.create({
  timeout: 30 * 1000,
  // headers: {'X-Token': 'blabla'},
});

// request interceptors
http.interceptors.request.use(config => {
  const msgType = config.data && config.data.msgType;
  if(msgType){
    return config;
  }else {
    console.log('\n\n');
    console.group('[REQUEST]');
    const info = [{
      请求名称: config.meta && config.meta.title,
      请求命令: config.data && config.data.msgType,
    }];
    console.table && console.table(info);
    console.log(config.data);
    console.groupEnd();
    return config;
  }
}, error => {
  return Promise.reject(error);
});

// response interceptors
http.interceptors.response.use(response => {
  let msgType = null;
  try {
    msgType = JSON.parse(response.config.data).msgType;
  }catch (e){
    //
  }

  if(!msgType){
    console.log('\n\n');
    console.group('[RESPONSE]');
    console.log(response.config.meta && response.config.meta.title, response.data.msgBody || response.data);
    console.groupEnd();
  }

  const level = Number(response.data.msgBody && response.data.msgBody.err.level);
  // 对警告、错误等级别上传日志
  if(level >= 2){
    const errMsg = response.data.msgBody.err.MSGInfo;
    if(level === 2){
      console.warn('>>> 上传日志[警告级别]', errMsg);
      uploadLog(response, 'warn');
    }else if(level === 3){
      console.warn('>>> 上传日志[错误级别]', errMsg);
      uploadLog(response, 'error');
    }
  }

  return response;
}, error => {
  return Promise.reject(error);
});

export const api = '/api';
export const dllApi = '/api/dll/invoke';

// 上传日志
function uploadLog(response, type = 'error'){
  return new Promise((resolve, reject) => {
    http.post(api + '/log/report', {
      type,
      log: {
        time: new Date().toLocaleString(),
        title: (response.config.meta && response.config.meta.title) || '',
        request: JSON.parse(response.config.data),
        response: _cloneDeep(response.data),
      },
    }).then(resolve).catch(reject);
  });
}
