// write your own vue global filters here

export default {
  install (Vue, options) {
    // filter capitalize
    Vue.filter('capitalize', (value) => {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    });
    // next filter
  },
};
