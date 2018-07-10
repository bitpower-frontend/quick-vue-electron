module.exports = {
  "extends": ["bitpower"],
  "env": {
    "browser": true
  },
  "plugins": ["vue"],
  "rules": {
    // 要求函数必须要有返回值
    "consistent-return": "off",
  }
};
