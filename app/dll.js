/*
@author Hisheng
@since null
@last-update 2019/01/30
@description 用于加载后台 dll 并提供向 dll 发起请求的方法
*/

const ffi = require('ffi');

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
function loadDll(app) {
  const server = app.$server;
  const logger = app.$logger;
  const config = app.$config;

  server.dll = {
    service: ffi.Library(config.dllName, {
      InitDll: ['void', ['string']],
      registJsCallback: ['void', ['pointer']],
      JsInvokeCppFunc: ['void', ['int', 'string', 'int']],
      SubscribeJsCallback: ['void', ['pointer']],
      EndDll: ['void', ['pointer']]
    }),
    requestMap: {}, // 请求回调栈
    requestId: 0,   // 请求标识ID
  };
  // 当 C++ 需要返回数据给 node 时，会调用此方法，通过 requestId 执行对应的回调函数
  server.dll.requestCallback = ffi.Callback('void', ['int', 'string', 'int'], (requestId, msg, msgLen) => {
    console.log(`>>> [${requestId}] dll requestCallback trigged`);
    if (requestId && server.dll.requestMap[requestId]) {
      server.dll.requestMap[requestId](msg);
      delete server.dll.requestMap[requestId];
    }
  });
  // 注册 C++ 普通消息回调
  server.dll.service.registJsCallback(server.dll.requestCallback);
  // 将 C++ 推送的消息通过 socket 转发给界面
  server.dll.DllPushCallback = ffi.Callback('void', ['string'], (msg) => {
    server.socket.broadcast(msg);
  });
  // 注册 C++ 推送回调
  server.dll.service.SubscribeJsCallback(server.dll.DllPushCallback);
  // 向 C++ 发送请求
  global.sendDllRequest = server.dll.sendRequest = function (data) {
    return new Promise((xresolve, xreject) => {
      // 检查入参是否是有效的 json 对象
      if (typeof data !== 'object') xreject(new TypeError(`无效的请求数据格式：${typeof data}`));
      try {
        // 注册回调函数
        ++server.dll.requestId;
        server.dll.requestMap[server.dll.requestId] = function (content) {
          content = JSON.parse(content);
          console.log(`============ [${config.shortName}] [${server.dll.requestId}] request callback invoked ============\n`/* , JSON.stringify(content, null, 2) */, '\n');
          xresolve(content);
        };
        data = JSON.stringify(data);
        console.log(`\n============ [${config.shortName}] [${server.dll.requestId}] request send to dll ============\n`, data, '\n');
        // 调用 C++ 相关方法
        server.dll.service.JsInvokeCppFunc(server.dll.requestId, data, getStringBytes(data));
      } catch (e) {
        console.log('>>> sendRequest error:', e);
        xreject(e);
      }
    });
  };
  // DLL 初始化
  logger.info('Dll initing');
  // C++ DLL 初始化，这是一个同步的操作
  server.dll.service.InitDll(config.shortName);
  logger.info('Dll inited');
}

module.exports = loadDll;
