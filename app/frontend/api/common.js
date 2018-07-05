import { http, api } from './config.js';

export default {
  login (username, password, rememberPassword = false) {
    return new Promise((resolve, reject) => {
      // send your request here
      // below it is a mock
      setTimeout(() => {
        resolve({
          data: {
            err: {
              level: 0,
              msg: '',
            },
            data: {
              name: 'Hisheng',
              id: 1234,
              groupId: 1,
              roles: [],
            },
          },
        });
      }, 2000);
    });
  },
  mobileLogin (mobile, verifyCode) {
    return new Promise((resolve, reject) => {
      // send your request here
      // below it is a mock
      setTimeout(() => {
        resolve({
          data: {
            err: {
              level: 0,
              msg: '',
            },
            data: {
              name: 'Hisheng',
              id: 1234,
              groupId: 1,
              roles: [],
            },
          },
        });
      }, 2000);
    });
  },
};
