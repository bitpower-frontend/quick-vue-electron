const chalk = require('chalk');

module.exports = class Logger {

  constructor(flag = 'App') {
    this.color = {
      red: chalk.hex('#f04134'),
      orange: chalk.hex('#ffbf00'),
      green: chalk.hex('#00a854'),
      blue: chalk.hex('#108ee9')
    };
    this.padLeft = `>>> ${flag}: `;
  }

  static get chalk() {
    return chalk;
  }

  success(text) {
    console.log(this.color.green(this.padLeft) + (text));
  }

  info(text) {
    console.log(this.color.blue(this.padLeft) + (text));
  }

  warn(text) {
    console.log(this.color.orange(this.padLeft) + (text));
  }

  error(text) {
    console.log(this.color.red(this.padLeft) + (text));
  }

  fail(text) {
    this.error(text);
  }

};
