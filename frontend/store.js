import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    token: null,
    isAdmin: false,
    notifications: [],
    meetings: [],
    rooms: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setToken(state, token) {
      state.token = token
    },
    setIsAdmin(state, isAdmin) {
      state.isAdmin = isAdmin
    },
    setNotifications(state, notifications) {
      state.notifications = notifications
    },
    setMeetings(state, meetings) {
      state.meetings = meetings
    },
    setRooms(state, rooms) {
      state.rooms = rooms
    }
  },
  actions: {
    login({ commit }, { user, token, isAdmin }) {
      commit('setUser', user)
      commit('setToken', token)
      commit('setIsAdmin', isAdmin)
    },
    logout({ commit }) {
      commit('setUser', null)
      commit('setToken', null)
      commit('setIsAdmin', false)
    }
  },
  getters: {
    isLoggedIn(state) {
      return !!state.token
    },
    currentUser(state) {
      return state.user
    }
  }
}) 