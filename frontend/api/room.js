import { get, post, put, del, Models } from './index'
import { roomMock, getRoomList, getRoomDetail, checkRoomAvailable, getAvailableList } from './room-mock'
import mockDataJson from '../data/mock-data.json'
import meetingApi from './meeting.js'  // 导入会议API模块

// 创建一个可修改的数据副本
const mockData = JSON.parse(JSON.stringify(mockDataJson));

// 创建会议室
const createRoom = (data) => {
  // 格式化请求数据
  return post('/api/rooms', data);
};

// 更新会议室
const updateRoom = (id, data) => {
  // 格式化请求数据
  return put(`/api/rooms/${id}`, data);
};

// 删除会议室
const deleteRoom = (id) => {
  return del(`/api/rooms/${id}`);
};

// 更新会议室状态
const updateRoomStatus = (id, status) => {
  return put(`/api/rooms/${id}/status`, { status });
};

// 获取会议室设备
const getRoomEquipment = () => {
  return get('/api/rooms/equipment');
};

// 获取会议室日程
const getRoomSchedule = (roomId, date) => {
  return get(`/api/rooms/${roomId}/schedule`, { date });
};

// 获取会议室详情
const getMeeting = (meetingId) => {
  console.log('获取会议详情API', meetingId);
  
  // 使用会议API模块的getMeetingById函数
  return meetingApi.getMeetingDetail(meetingId)
    .then(result => {
      console.log('从meeting API获取的会议数据：', result);
      return result;
    })
    .catch(error => {
      console.error('获取会议数据失败：', error);
      return {
        code: 500,
        data: null,
        msg: '获取会议数据失败'
      };
    });
};

// 获取会议文件列表
const getMeetingFiles = (meetingId) => {
  console.log('获取会议文件API', meetingId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = {
        code: 200,
        data: {
          list: mockData.files.filter(f => f.meetingId == meetingId) || []
        },
        msg: ''
      };
      resolve(result);
    }, 200);
  });
};

// 获取会议参会者
const getMeetingParticipants = (meetingId) => {
  console.log('获取会议参会者API', meetingId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const meeting = mockData.meetings.find(m => m.id == meetingId);
      const result = {
        code: 200,
        data: {
          list: meeting ? meeting.participants : []
        },
        msg: ''
      };
      resolve(result);
    }, 200);
  });
};

// 获取会议聊天记录
const getMeetingChat = (meetingId) => {
  console.log('获取会议聊天记录API', meetingId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = {
        code: 200,
        data: {
          list: mockData.messages.filter(m => m.meetingId == meetingId) || []
        },
        msg: ''
      };
      resolve(result);
    }, 200);
  });
};

// 发送会议聊天消息
const sendMeetingChatMessage = (params) => {
  console.log('发送会议消息API', params);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // 生成消息ID和时间戳
      const newMessage = {
        id: 'msg_' + Date.now(),
        meetingId: params.meetingId,
        senderId: mockData.currentUser.id,
        senderName: mockData.currentUser.name,
        senderAvatar: mockData.currentUser.avatar,
        content: params.content,
        createTime: new Date().toISOString(),
        isSystem: false
      };
      
      // 添加到模拟数据中
      mockData.messages.push(newMessage);
      
      const result = {
        code: 200,
        data: newMessage,
        msg: '发送成功'
      };
      resolve(result);
    }, 300);
  });
};

// 获取会议纪要
const getMeetingMinutes = (meetingId) => {
  console.log('获取会议纪要API', meetingId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = {
        code: 200,
        data: {
          list: mockData.minutes.filter(m => m.meetingId == meetingId) || []
        },
        msg: ''
      };
      resolve(result);
    }, 200);
  });
};

// 结束会议
const endMeeting = (meetingId) => {
  console.log('结束会议API', meetingId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const meetingIndex = mockData.meetings.findIndex(m => m.id == meetingId);
      if (meetingIndex !== -1) {
        mockData.meetings[meetingIndex].status = 'completed';
        mockData.meetings[meetingIndex].endTime = new Date().toISOString();
      }
      
      const result = {
        code: 200,
        data: {
          id: meetingId,
          status: 'completed'
        },
        msg: '会议已结束'
      };
      resolve(result);
    }, 300);
  });
};

// 上传会议纪要
const uploadMeetingMinutes = (meetingId, data) => {
  console.log('上传会议纪要API', meetingId, data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMinutes = {
        id: 'minutes_' + Date.now(),
        meetingId: meetingId,
        title: data.title,
        content: data.content || '',
        creatorId: mockData.currentUser.id,
        creatorName: mockData.currentUser.name,
        createTime: new Date().toISOString()
      };
      
      mockData.minutes.push(newMinutes);
      
      const result = {
        code: 200,
        data: newMinutes,
        msg: '纪要已保存'
      };
      resolve(result);
    }, 300);
  });
};

const roomAPI = {
  getRoomList,
  getRoomDetail,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus,
  getRoomEquipment,
  getRoomSchedule,
  checkRoomAvailable,
  getAvailableList,
  roomMock,
  getMeeting,
  getMeetingFiles,
  getMeetingParticipants,
  getMeetingChat,
  sendMeetingChatMessage,
  getMeetingMinutes,
  endMeeting,
  uploadMeetingMinutes
};

export default roomAPI; 