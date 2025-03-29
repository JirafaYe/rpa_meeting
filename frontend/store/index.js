import { createStore } from 'vuex'
import user from './user.js'
import meeting from './meeting.js'

// 创建Vuex store
const store = createStore({
  state: {
    // 全局状态
    loading: false,
    appVersion: '1.0.0'
  },
  mutations: {
    // 修改loading状态
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    }
  },
  actions: {
    // 异步操作
    toggleLoading({ commit }, isLoading) {
      commit('SET_LOADING', isLoading);
    }
  },
  getters: {
    // 全局计算属性
    isLoading: state => state.loading,
    appVersion: state => state.appVersion
  },
  // 模块
  modules: {
    user,
    meeting
  }
});

export default store; 