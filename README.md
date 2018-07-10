# quick-vue-electron
A Tool for Building Typical Vue-Electron Project

## Get started

1. clone repo
`git clone https://github.com/bitpower-frontend/quick-vue-electron.git`

2. cd quick-vue-electron, then `npm install`

3. 复制 `app/config.demo.js` 为 `app/config.js`，按需要修改配置项

3. execute dev.bat

4. execute app.bat

that is all.

### 加载 dll
默认不加载 dll 服务，如果需要，填写 `config.js` 中 `dllName` 字段为需要加载的 dll 名称即可。

开启成功后，界面可以直接通过 POST 请求到 `/api/dll/invoke` 来调用 dll 方法。