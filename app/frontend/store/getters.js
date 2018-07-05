const getters = {
  // if user logined
  logined (state){
    if(state.user){
      return !!state.user.id;
    }else {
      return false;
    }
  },
};

export default getters;
