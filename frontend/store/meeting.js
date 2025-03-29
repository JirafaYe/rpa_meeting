import api from '../utils/api.js'

export default {
  namespaced: true,
  state: {
    meetingList: [],
    currentMeeting: null,
    meetingRooms: [],
    meetingForm: {
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      roomId: '',
      description: '',
      attendees: []
    }
  },
  mutations: {
    SET_MEETING_LIST(state, list) {
      state.meetingList = list;
    },
    SET_CURRENT_MEETING(state, meeting) {
      state.currentMeeting = meeting;
    },
    SET_MEETING_ROOMS(state, rooms) {
      state.meetingRooms = rooms;
    },
    SET_MEETING_FORM(state, form) {
      state.meetingForm = form;
    },
    RESET_MEETING_FORM(state) {
      state.meetingForm = {
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        roomId: '',
        description: '',
        attendees: []
      };
    }
  },
  actions: {
    // 获取会议列表
    getMeetingList({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.meeting.getMeetingList(params)
          .then(res => {
            if (res.code === 200) {
              commit('SET_MEETING_LIST', res.data.list || []);
              resolve(res.data);
            } else {
              reject(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    
    // 获取会议详情
    getMeetingDetail({ commit }, id) {
      return new Promise((resolve, reject) => {
        api.meeting.getMeetingDetail(id)
          .then(res => {
            if (res.code === 200) {
              commit('SET_CURRENT_MEETING', res.data);
              resolve(res.data);
            } else {
              reject(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    
    // 创建会议
    createMeeting({ commit }, meetingData) {
      return new Promise((resolve, reject) => {
        api.meeting.createMeeting(meetingData)
          .then(res => {
            if (res.code === 200) {
              commit('RESET_MEETING_FORM');
              resolve(res.data);
            } else {
              reject(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    
    // 更新会议
    updateMeeting({ commit }, { id, data }) {
      return new Promise((resolve, reject) => {
        api.meeting.updateMeeting(id, data)
          .then(res => {
            if (res.code === 200) {
              resolve(res.data);
            } else {
              reject(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    
    // 获取会议室列表
    getMeetingRooms({ commit }) {
      return new Promise((resolve, reject) => {
        api.room.getRoomList()
          .then(res => {
            if (res.code === 200) {
              commit('SET_MEETING_ROOMS', res.data);
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
    meetingList: state => state.meetingList,
    currentMeeting: state => state.currentMeeting,
    meetingRooms: state => state.meetingRooms,
    meetingForm: state => state.meetingForm,
    pendingMeetings: state => state.meetingList.filter(m => m.status === 'pending'),
    approvedMeetings: state => state.meetingList.filter(m => m.status === 'approved'),
    completedMeetings: state => state.meetingList.filter(m => m.status === 'completed')
  }
}; 