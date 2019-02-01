/*
@author Hisheng
@since null
@last-update 2019/02/01
@description 应用全局配置文件
*/

module.exports = {
  // 应用ID
  appId: 'com.anysitename.desktop',
  // 应用名称
  appName: 'Meow',
  // 应用简短名称
  shortName: 'QUE',
  // 应用本地后台服务地址
  host: 'localhost',
  // 应用本地后台服务端口
  port: 828,
  // 应用本地后台服务端口（开发时 dev-server 请求转发）
  devPort: 826,
  // 应用当前环境（development 开发环境 / production 生产环境）
  env: 'development',
  // 应用当前使用的设备类型（desktop 桌面 / broswer 浏览器）
  device: 'desktop',
  // 加载的 DLL 名称
  dllName: '',
  // 限制的 JSON 大小，KB
  jsonLimitSize: 100 * 1024,
  // 离线设置
  offline: {
    enabled: true,
    // 自定义离线页面
    page: null,
  },
  // 缓存设置
  cache: {
    // 缓存文件夹
    folder: null,
  },
};
