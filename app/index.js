/*
@author Hisheng
@since null
@last-update 2018/04/13
@description 应用启动文件
*/

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const router = require('./router.js');
const config = require('./config');
const Logger = require('./logger.js');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const desktop = app;
let mainWindow = null;
let server = null;
const URL = 'http://' + config.host + ':' + (config.env === 'production' ? config.port : config.devPort);
const logger = new Logger(config.appName);

desktop.setName(config.appName);
desktop.setAppUserModelId('com.yoursite.desktop');

// start node server using express
const startNodeServer = function(){
  return new Promise((resolve, reject) => {
    try {
      server = express();
      server.use(compression());
      server.use('/static', express.static(path.join(__dirname, 'static')));
      server.use(bodyParser.json({ limit: (8 * 1024) + 'kb' }));
      server.use(bodyParser.urlencoded({ extended: false }));
      // set router
      router(server);
      // start listen
      server.listen(config.port, config.host, () => {
        logger.info(`Node server is running at ${config.host}:${config.port}`);
        resolve(server);
      });
    }catch (err){
      reject(err);
    }
  });
};

// init desktop application
const initDesktop = function(){
  desktop.on('ready', () => {
    createMainWindow();
  });

  desktop.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      desktop.quit();
    }
  });

  desktop.on('activate', () => {
    if (mainWindow === null) {
      createMainWindow();
    }
  });

  // informed to close main window
  ipcMain.on('closeMainWindow', (event, arg) => {
    mainWindow.close();
  });

  // maximize window
  ipcMain.on('maximizeMainWindow', (event, arg) => {
    if(mainWindow.isMaximized()){
      mainWindow.restore();
      event.sender.send('maximizeMainWindowSuccess', 'restored');
    }else {
      mainWindow.maximize();
      event.sender.send('maximizeMainWindowSuccess', 'maximized');
    }
  });

  // minimize window
  ipcMain.on('minimizeMainWindow', (event, arg) => {
    mainWindow.minimize();
  });

  // asked to download
  ipcMain.on('download', (event, arg) => {
    mainWindow.webContents.downloadURL(arg.url);
  });

  // informed to execute specified method
  ipcMain.on('execute', (event, arg) => {
    const method = mainWindow[arg.method];
    if(method){
      method.apply(mainWindow, arg.params || []);
    }
  });

  // asked to reload main window webcontents
  ipcMain.on('reload', (event, arg) => {
    mainWindow.webContents.reload();
  });

  // asked to exit application
  ipcMain.on('exit', (event, arg) => {
    quitGracefully();
  });

  // asked to relaunch application
  ipcMain.on('relaunch', (event, arg) => {
    desktop.relaunch();
    desktop.quit();
  });

  // informed login
  ipcMain.on('login', (event, arg) => {
    // do something when user login
  });

  // informed logout
  ipcMain.on('logout', (event, arg) => {
    // do something when user logout
  });

  // asked to open devtools
  ipcMain.on('openDevTools', (event, arg) => {
    mainWindow.webContents.openDevTools();
  });

  // 前端通过 H5 API：navigator.onLine 判断网络情况，ipcRender 发送事件到 ipcMain
  /* ipcMain.on('online-status-changed', function(event, status) {
    if (status === 'online') {
      // 加载线上 URL
    } else {
      // 加载离线页面
    }
  }); */
};

// show desktop
function showDesktop (){
  mainWindow.show();
  mainWindow.maximize();
}

// create main window
function createMainWindow(){
  const windowConfig = {
    show: false,
    minWidth: 1440,
    minHeight: 940,
    width: 1440,
    height: 940,
    autoHideMenuBar: true,
    frame: false,
    icon: path.join(__dirname, '../logo.png'),
    backgroundColor: '#454545',
    title: config.appName,
    /*webPreferences: {
      devTools: !(config.env === 'production'),
    }*/
  };
  mainWindow = new BrowserWindow(windowConfig);
  mainWindow.once('ready-to-show', () => {
    logger.info('main window is ready to show');
  });
  mainWindow.webContents.on('did-finish-load', () => {
    preventDefault();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.loadURL(URL);
}

// prevent default behavior than not allowed on desktop
function preventDefault (){
  // disable drag file into window
  mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());
  // disable user zoom page
  mainWindow.webContents.setZoomFactor(1);
  mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
  mainWindow.webContents.setLayoutZoomLevelLimits(0, 0);
}

// quit application gracefully
function quitGracefully (){
  try {
    mainWindow.close();
    desktop.quit();
  }catch (e){
    logger.info('can not quit qracefully, trying to kill the process');
    process.exit();
  }
}

// for global uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('>>> [Error]', err, err.code);
  if(err.code === 'EADDRINUSE'){
    dialog.showErrorBox('端口占用', `端口 ${config.port} 已被其他程序占用，程序即将退出。`);
  }else {
    dialog.showErrorBox('程序出错', err.message);
  }
  quitGracefully();
});


// start application
if(config.device === 'desktop'){
  initDesktop();
  logger.info('desktop inited');
}

startNodeServer().then(server => {
  // load dll if need
  /* logger.info('loading dll');
  return loadDll(server); */
}).then(() => {
  // logger.info('dll loaded');
  if(config.device === 'desktop'){
    showDesktop();
    logger.info('desktop shown');
  }
}).catch(err => {
  throw new Error(err.toString());
});