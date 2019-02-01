/*
@author Hisheng
@since null
@last-update 2019/01/30
@description Application Startup Entry
*/

const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const router = require('./router.js');
const config = require('./config');
const Logger = require('./logger.js');
if (config.dllName) {
  const loadDll = require('./dll.js');
}
/* eslint-disable import/no-unresolved */
const { app, BrowserWindow, ipcMain, dialog, } = require('electron');

// const initSocket = require('./socket.js');

app.$mainWindow = null;
app.$server = null;
app.$config = config;

const logger = new Logger(config.appName);
app.$logger = logger;

app.setName(config.appName);
app.setAppUserModelId(config.appId);

// 线上、初始化、离线页面
const ONLINE_URL = `http://${config.host}:${config.env === 'production' ? config.port : config.devPort}`;
const INIT_URL = 'file://' + path.resolve(__dirname, './init.html');
const OFFLINE_URL = 'file://' + path.resolve(__dirname, './offline.html');

// 创建缓存目录
const CACHE_DIR = (config.cache && config.cache.folder) || path.join(__dirname, './cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

// start node server using express
const startNodeServer = function() {
  return new Promise((resolve, reject) => {
    try {
      app.$server = express();
      app.$server.use(compression());
      app.$server.use('/static', express.static(path.join(__dirname, 'static')));
      app.$server.use(bodyParser.json({ limit: config.jsonLimitSize + 'kb' }));
      app.$server.use(bodyParser.urlencoded({ extended: false }));
      // set router
      router(app.$server);
      // initSocket(app.$server);
      // start listen
      app.$server.listen(config.port, config.host, () => {
        logger.info(`Node server is running at ${config.host}:${config.port}`);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
};

// init app application
const initDesktop = function() {
  app.on('ready', () => {
    createMainWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (app.$mainWindow === null) {
      createMainWindow();
    }
  });

  app.on('gpu-process-crashed', (event) => {
    quitGracefully();
  });

  // close main window
  ipcMain.on('closeMainWindow', (event, arg) => {
    app.$mainWindow.close();
  });

  // maximize window
  ipcMain.on('maximizeMainWindow', (event, arg) => {
    if (app.$mainWindow.isMaximized()) {
      app.$mainWindow.restore();
      event.sender.send('maximizeMainWindowSuccess', 'restored');
    } else {
      app.$mainWindow.maximize();
      event.sender.send('maximizeMainWindowSuccess', 'maximized');
    }
  });

  // minimize window
  ipcMain.on('minimizeMainWindow', (event, arg) => {
    app.$mainWindow.minimize();
  });

  // 用于下载防止 window.open 导致的空白窗口
  ipcMain.on('create-download-window', (event, arg) => {
    console.log('>>> create-download-window', arg.url);
    app.$mainWindow.webContents.downloadURL(arg.url);
  });

  // 渲染界面通知主进程执行相关方法
  ipcMain.on('execute', (event, arg) => {
    const action = app.$mainWindow[arg.action];
    action.apply(app.$mainWindow, arg.params || []);
  });

  // 刷新界面
  ipcMain.on('reload', (event, arg) => {
    app.$mainWindow.webContents.reload();
  });

  // 退出程序
  ipcMain.on('exit', (event, arg) => {
    quitGracefully();
  });

  // 重启程序
  ipcMain.on('relaunch', (event, arg) => {
    app.relaunch();
    app.quit();
  });

  // 前端通过 H5 API：navigator.onLine 判断网络情况，ipcRender 发送事件到 ipcMain
  ipcMain.on('online-status-changed', function(event, online) {
    if (!config.offline.enabled) return;
    if (online) {
      // 加载线上 URL
      app.$mainWindow.loadURL(ONLINE_URL);
    } else {
      // 加载离线页面
      app.$mainWindow.loadURL(config.offline.page || OFFLINE_URL);
    }
  });

  // 通过主进程，渲染进程通信的方式（IPC）发起 dll 请求
  ipcMain.on('sendDllRequest', async (event, arg) => {
    try {
      const resData = await app.$server.dll.sendRequest(arg.data);
      event.sender.send('sendDllRequestRes', {
        id: arg.id,
        data: resData,
      });
    } catch (err) {
      event.sender.send('sendDllRequestRes', {
        id: arg.id,
        err,
      });
    }
  });

};

// 阻止界面默认行为
function preventDefault () {
  // 阻止文件拖拽进界面
  app.$mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());
  // 阻止界面缩放
  app.$mainWindow.webContents.setZoomFactor(1);
  app.$mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
  app.$mainWindow.webContents.setLayoutZoomLevelLimits(0, 0);
}

// 创建主渲染界面
function createMainWindow() {
  const windowConfig = {
    show: false,
    minWidth: 1440,
    minHeight: 940,
    width: 1440,
    height: 940,
    autoHideMenuBar: true,
    frame: false,
    icon: path.join(__dirname, '../app.ico'),
    backgroundColor: '#282c34',
    title: config.appName,
    /*webPreferences: {
      devTools: !(config.env === 'production'),
    }*/
  };
  app.$mainWindow = new BrowserWindow(windowConfig);
  // 加载 chrome 插件
  if (config.env === 'development') {
    BrowserWindow.addDevToolsExtension(path.join(__dirname, './extensions/vue-devtools/4.1.5_0'));
  }
  app.$mainWindow.once('ready-to-show', () => {
    logger.info('Main window is ready to show');
    app.$mainWindow.show();
    bootstrap();
  });
  // 界面加载完毕时
  app.$mainWindow.webContents.on('did-finish-load', () => {
    preventDefault();
  });
  app.$mainWindow.on('closed', () => {
    app.$mainWindow = null;
  });
  // 先显示初始化页面
  app.$mainWindow.loadFile(INIT_URL);
}

// 以一种优雅的方式退出程序
function quitGracefully () {
  try {
    app.$mainWindow.close();
    app.quit();
  } catch (e) {
    logger.info('Can not quit qracefully, trying to kill the process');
    process.exit();
  }
}

// 加入错误处理，解决端口占用等问题
process.on('uncaughtException', (err) => {
  console.log('>>> [Error]', err, err.code);
  if (err.code === 'EADDRINUSE') {
    console.error('>>> address has been used.');
    dialog.showErrorBox('端口占用', `端口 ${config.port} 已被其他程序占用，程序即将退出。`);
  } else {
    dialog.showErrorBox('程序出错', err.message + '\n' + err.stack);
  }
  quitGracefully();
});

// 启动顺序很重要
// 1. 判断设备是否是桌面程序，如果是，初始化桌面程序（Electron），此时暂不显示
// 2. 首先启动 Node 后台服务程序
// 3. 加载 C++ DLL 服务程序
// 4. 如果设备是桌面程序，则显示
logger.info('process.pid', process.pid);

if (config.device === 'desktop') {
  initDesktop();
  logger.info('Desktop inited');
}

async function bootstrap () {
  try {
    await startNodeServer();
    if (config.dllName) {
      logger.info('Loading dll');
      await loadDll(app);
      logger.info('Dll loaded');
    }
    if (config.device === 'desktop') {
      app.$mainWindow.loadURL(ONLINE_URL);
      app.$mainWindow.maximize();
      logger.info('Desktop shown');
    }
  } catch (err) {
    throw new Error(err.toString());
  }
}

