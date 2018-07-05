const mutations = {
  // set user info
  setUserInfo (state, user){
    state.user = user;
  },
  showLoadingMask (state, text = '加载中...'){
    state.loadingMaskText = text;
    state.loadingMaskVisible = true;
  },
  hideLoadingMask (state){
    state.loadingMaskVisible = false;
  },
};

export default mutations;
