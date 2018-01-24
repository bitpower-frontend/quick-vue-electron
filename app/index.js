const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router.js');
const config = require('./config');
const Logger = require('./logger.js');
const { app, BrowserWindow, ipcMain } = require('electron');
let mainWindow = null;

const logger = new Logger(config.appName);

// start node server using express
const startServer = function(){
  const server = express();
  server.use('/static', express.static(path.join(__dirname, 'static')));
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));
  // set router
  router(server);
  // start listen
  server.listen(config.port, () => {
    logger.info(`server is running at port ${config.port}`);
    if(config.device === 'client'){
      startElectron();
    }else ;
  });
};

// start electron
const startElectron = function(){
  logger.info('electron is starting');

  app.on('ready', createMainWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createMainWindow();
    }
  });
  // 关闭主程序界面
  ipcMain.on('closeMainWindow', (event, arg) => {
    mainWindow.close();
  });
  // 最大化主程序界面
  ipcMain.on('maximizeMainWindow', (event, arg) => {
    if(mainWindow.isMaximized()){
      mainWindow.restore();
      event.sender.send('maximizeMainWindowSuccess', 'restored');
    }else {
      mainWindow.maximize();
      event.sender.send('maximizeMainWindowSuccess', 'maximized');
    }
  });
  // 最小化主程序界面
  ipcMain.on('minimizeMainWindow', (event, arg) => {
    mainWindow.minimize();
  });
};
// create main window
const createMainWindow = function(){
  logger.info('creating electron main window');

  const windowConfig = {
    show: false,
    minWidth: 1400,
    minHeight: 900,
    width: 1400,
    height: 900,
    autoHideMenuBar: true,
    frame: false,
    icon: path.join(__dirname, '../app.png'),
    /*webPreferences: {
      devTools: !(config.env === 'production'),
    }*/
  };
  mainWindow = new BrowserWindow(windowConfig);
  mainWindow.once('ready-to-show', () => {
    logger.info('main window is showed');
    // prevent default drag/drop action
    mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());
    mainWindow.show();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.loadURL(config.host + ':' +(config.env === 'production' ? config.port : config.devPort));
};

startServer();