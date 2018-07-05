import { http, dllApi } from './config.js';

export default {
  sayHi () {
    return new Promise((resolve, reject) => {
      const postData = {
        msgType: 'Test',
        msgBody: {
          // write your params here
        },
      };
      http.post(dllApi, postData, {
        meta: {
          title: 'this is just a test',
        }
      }).then(resolve).catch(reject);
    });
  },
};
