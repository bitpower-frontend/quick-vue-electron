const fs = require('fs');
const path = require('path');
const config = require('./config.js');

module.exports = app => {
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  // 获取配置文件
  app.get('/api/config', (req, res) => {
    res.json(config);
  });

  if (config.dllName) {
    // 直接调用 dll 请求
    app.post('/api/dll/invoke', (req, res) => {
      app.dll.sendRequest(req.body).then((result) => {
        res.json(result);
      }).catch((err) => {
        res.json(err);
      });
    });
  }

  // 接受前端上传的错误报告
  app.post('/api/log/report', (req, res) => {
    // 错误类型：warn, error
    const { type } = req.body;
    const logsPath = path.resolve(__dirname, `./logs/${type}`);
    if (!fs.existsSync(logsPath)) {
      fs.mkdirSync(logsPath);
    }
    const logFiles = fs.readdirSync(logsPath);
    const log = `${JSON.stringify(req.body.log, null, 2)}\n\n`;
    if (!logFiles.length) {
      fs.writeFileSync(path.resolve(logsPath, './log-0.txt'), log);
    } else {
      // 获取最后的log文件
      const stat = fs.statSync(path.resolve(logsPath, `./log-${logFiles.length - 1}.txt`));
      if ((stat.size / (1024 * 1024)) >= 0.5) { // 超过0.5M
        fs.writeFileSync(path.resolve(logsPath, `./log-${logFiles.length}.txt`), log);
      } else fs.appendFileSync(path.resolve(logsPath, `./log-${logFiles.length - 1}.txt`), log);
    }
    res.end();
  });
};
