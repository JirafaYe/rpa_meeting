import api from '../utils/api.js'

export default {
  namespaced: true,
  state: {
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('userInfo') || null,
    isLoggedIn: !!uni.getStorageSync('token')
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      uni.setStorageSync('token', token);
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
      uni.setStorageSync('userInfo', userInfo);
    },
    SET_LOGIN_STATE(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    LOGOUT(state) {
      state.token = '';
      state.userInfo = null;
      state.isLoggedIn = false;
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
    }
  },
  actions: {
    // 登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        api.user.login(userInfo)
          .then(res => {
            if (res.code === 200 && res.data) {
              commit('SET_TOKEN', res.data.token);
              commit('SET_USER_INFO', res.data.userInfo);
              commit('SET_LOGIN_STATE', true);
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    
    // 登出
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('LOGOUT');
        resolve();
      });
    },
    
    // 获取用户信息
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        api.user.getUserInfo()
          .then(res => {
            if (res.code === 200 && res.data) {
              commit('SET_USER_INFO', res.data);
              resolve(res.data);
            } else {
              reject(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  },
  getters: {
    token: state => state.token,
    userInfo: state => state.userInfo,
    isLoggedIn: state => state.isLoggedIn,
    userName: state => state.userInfo ? state.userInfo.name : '',
    userRole: state => state.userInfo ? state.userInfo.role : ''
  }
}; 