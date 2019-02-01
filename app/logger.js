/*
@author Hisheng
@since null
@last-update 2019/01/30
@description 用于 Node 日志打印的简单工具
*/

const chalk = require('chalk');

module.exports = class Logger {

  constructor(flag = 'App') {
    this.color = {
      red: chalk.hex('#f04134'),
      orange: chalk.hex('#ffbf00'),
      green: chalk.hex('#00a854'),
      blue: chalk.hex('#108ee9'),
    };
    this.padLeft = `>>> ${flag}: `;
    this.lastTime = (new Date()).getTime();
  }

  static get chalk() {
    return chalk;
  }

  getTimeGap () {
    const cureentTime = (new Date()).getTime();
    const timeGap = cureentTime - this.lastTime;
    this.lastTime = cureentTime;
    return timeGap;
  }

  success(text, ...rest) {
    console.log(this.color.green(this.padLeft) + (text), ...rest, `+${this.getTimeGap()} ms`);
  }

  info(text, ...rest) {
    console.log(this.color.blue(this.padLeft) + (text), ...rest, `+${this.getTimeGap()} ms`);
  }

  warn(text, ...rest) {
    console.log(this.color.orange(this.padLeft) + (text), ...rest, `+${this.getTimeGap()} ms`);
  }

  error(text, ...rest) {
    console.log(this.color.red(this.padLeft) + (text), ...rest, `+${this.getTimeGap()} ms`);
  }

  fail(text, ...rest) {
    this.error(text, ...rest, `+${this.getTimeGap()} ms`);
  }

};
