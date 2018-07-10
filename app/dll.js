/*
@author Hisheng
@since null
@last-update 2018/07/10
@description 用于加载后台 dll 并提供向 dll 发起请求的方法
*/

const ffi = require('ffi');
const cuid = require('cuid');
const config = require('./config.js');
const Logger = require('./logger.js');

const logger = new Logger(config.appName);

// 获取传递的字符串长度
function getStringBytes(str) {
  let total = 0;
  let charCode;
  let i;
  let len;
  for (i = 0, len = str.length; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode <= 0x007f) {
      total += 1;
    } else if (charCode <= 0x07ff) {
      total += 2;
    } else if (charCode <= 0xffff) {
      total += 3;
    } else {
      total += 4;
    }
  }
  return total;
}

// 加载 dll
function loadDll(nodeServer, dllName) {
  const server = nodeServer;
  server.dll = {
    service: ffi.Library(dllName, {
      InitDll: ['void', ['string']],
      registJsCallback: ['void', ['pointer']],
      JsInvokeCppFunc: ['void', ['int', 'string', 'int']],
      // SubscribeJsCallback: ['void', ['pointer']],
    }),
    requestMap: {}, // 请求回调栈
  };
  // 当 C++ 需要返回数据给 node 时，会调用此方法，通过 requestId 执行对于的回调函数
  server.dll.requestCallback = ffi.Callback('void', ['int', 'string', 'int'], (requestId, msg) => {
    logger.info(`[${requestId}] dll requestCallback trigged`);
    if (requestId && server.dll.requestMap[requestId]) {
      server.dll.requestMap[requestId](msg);
      delete server.dll.requestMap[requestId];
    }
  });
  server.dll.service.registJsCallback(server.dll.requestCallback);
  // C++ 向 Node 主动发消息
  /* server.dll.service.SubscribeJsCallback(ffi.Callback('void', ['string'], (msg) => {
    console.log('>>>>>>>>>>>>>>>>');
    console.log(msg);
    console.log('>>>>>>>>>>>>>>>>');
  })); */
  // 向 C++ 发送请求
  server.dll.sendRequest = function (data) {
    return new Promise((resolve, reject) => {
      try {
        // 注册回调函数
        const reqId = cuid();
        server.dll.requestMap[reqId] = function (content) {
          console.log(`============ [${config.shortName}] [${reqId}] request callback invoked. ============\n`, '\n');
          resolve(JSON.parse(content));
        };
        data = JSON.stringify(data);
        console.log(`\n============ [${config.shortName}] [${reqId}] request sent to dll ============\n`, data, '\n');
        // 调用 C++ 相关方法
        server.dll.service.JsInvokeCppFunc(reqId, data, getStringBytes(data));
      } catch (e) {
        console.log('>>> sendRequest error:', e);
        reject(e);
      }
    });
  };
  // dll 初始化
  logger.info('dll initing');
  server.dll.service.InitDll(config.shortName);
  logger.info('dll inited');
}

module.exports = loadDll;
