// tool functions

export default {
  /*
  * @desc is mobile number valid
  * @return {Boolean}
  */
  isMobileValid (mobile) {
    return (/^1[3|5|7|8][0-9]{9}$/g).test(mobile);
  },
  /*
  * @desc is password number valid
  * @return {Boolean}
  */
  isPasswordValid (password) {
    return password.trim() && password.trim().length >= 6;
  },
  /*
  * @desc is verify code valid
  * @return {Boolean}
  */
  isVerifyCodeValid (code) {
    return (/^\d{6}$/g).test(code);
  },
  /*
  * @desc generate a uid with or without a prefix flag
  * @return {String}
  */
  getUID (flag) {
    return (flag ? (flag + '-') : '') + `${new Date().getTime()}-${Math.random().toString().split('.')[1]}`;
  },
  /*
  * @desc number fixed to spicified bits
  * @return {Number}
  */
  toFixed (num, bit = 2) {
    if (['string', 'number'].indexOf(typeof num) !== -1) {
      if (num !== num) { // if it is NaN
        return num;
      } else return Number(Number(num).toFixed(bit));
    } else return num;
  },
};
