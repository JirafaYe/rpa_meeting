import { get, post, put, del, Models } from './index'
import { getMessageListAPI, sendMessageAPI } from './message.js';
import { getMeetingById, getMeetingsByType, getAgendaByMeetingId } from '../data/meetings.js';
import { getAgendaList } from '../data/agendas.js'
import { getMessagesByMeetingId } from '../data/messages.js'
import { getFilesByMeetingId, uploadFile as dataUploadFile } from '../data/files.js';
import { getRecordingsByMeetingId } from '../data/recordings.js';
import { 
  getMeetingList, 
  generateMeetingMinutes, 
  createMeeting, 
  updateMeeting, 
  cancelMeeting, 
  rejectParticipation,
  getScheduleData
} from '../data/meetings.js'
import { loadJsonData } from '../data/utils/jsonDataLoader.js'
import { getRecordingList, uploadRecording as dataUploadRecording } from '../data/recordings.js'
import { getFileList } from '../data/files.js'

// 判断是否是mock环境
const isMockEnv = () => {
  // 这里可以通过环境变量或者其他方式判断是否是mock环境
  return true;
};

// 获取会议列表API
export const getMeetingListAPI = (params) => {
  console.log('获取会议列表API:', params);
  
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      if (isMockEnv()) {
        // 使用模拟数据
        const { type, status, pageNum, pageSize } = params || {};
        try {
          const meetings = getMeetingsByType(type, status, pageNum, pageSize);
          resolve({
            code: 200,
            message: '获取会议列表成功',
            data: meetings
          });
        } catch (error) {
          console.error('获取会议列表错误:', error);
          resolve({
            code: 500,
            message: error.message || '获取会议列表失败',
            data: { list: [], total: 0 }
          });
        }
      } else {
        // 真实环境下调用后端API
        // 这里应该调用真实的后端API获取会议列表
        resolve({
          code: 200,
          message: '获取会议列表成功',
          data: { list: [], total: 0 }
        });
      }
    }, 300);
  });
};

// 获取会议详情API
export const getMeetingDetailAPI = (meetingId) => {
  console.log('获取会议详情API:', meetingId);
  
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      if (isMockEnv()) {
        // 使用模拟数据
        try {
          const meeting = getMeetingById(meetingId);
          resolve({
            code: 200,
            message: '获取会议详情成功',
            data: meeting
          });
        } catch (error) {
          console.error('获取会议详情错误:', error);
          resolve({
            code: 500,
            message: error.message || '获取会议详情失败',
            data: null
          });
        }
      } else {
        // 真实环境下调用后端API
        // 这里应该调用真实的后端API获取会议详情
        resolve({
          code: 500,
          message: '后端API暂未实现',
          data: null
        });
      }
    }, 500);
  });
};

// 获取会议议题API
export const getMeetingAgendasAPI = (meetingId) => {
  console.log('获取会议议题API:', meetingId);
  
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      if (isMockEnv()) {
        // 使用模拟数据
        try {
          const agendas = getAgendaByMeetingId(meetingId);
          resolve({
            code: 200,
            message: '获取会议议题成功',
            data: agendas
          });
        } catch (error) {
          console.error('获取会议议题错误:', error);
          resolve({
            code: 500,
            message: error.message || '获取会议议题失败',
            data: []
          });
        }
      } else {
        // 真实环境下调用后端API
        // 这里应该调用真实的后端API获取会议议题
        resolve({
          code: 500,
          message: '后端API暂未实现',
          data: []
        });
      }
    }, 300);
  });
};

// 获取会议文件API
export const getMeetingFilesAPI = (meetingId) => {
  console.log('获取会议文件API:', meetingId);
  
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      if (isMockEnv()) {
        // 使用模拟数据
        try {
          const files = getFilesByMeetingId(meetingId);
          resolve({
            code: 200,
            message: '获取会议文件成功',
            data: files
          });
        } catch (error) {
          console.error('获取会议文件错误:', error);
          resolve({
            code: 500,
            message: error.message || '获取会议文件失败',
            data: []
          });
        }
      } else {
        // 真实环境下调用后端API
        // 这里应该调用真实的后端API获取会议文件
        resolve({
          code: 500,
          message: '后端API暂未实现',
          data: []
        });
      }
    }, 300);
  });
};

// 获取会议录音API
export const getMeetingRecordingsAPI = (meetingId) => {
  console.log('获取会议录音API:', meetingId);
  
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      if (isMockEnv()) {
        // 使用模拟数据
        try {
          const recordings = getRecordingsByMeetingId(meetingId);
          resolve({
            code: 200,
            message: '获取会议录音成功',
            data: recordings
          });
        } catch (error) {
          console.error('获取会议录音错误:', error);
          resolve({
            code: 500,
            message: error.message || '获取会议录音失败',
            data: []
          });
        }
      } else {
        // 真实环境下调用后端API
        // 这里应该调用真实的后端API获取会议录音
        resolve({
          code: 500,
          message: '后端API暂未实现',
          data: []
        });
      }
    }, 300);
  });
};

// 获取会议消息API
export const getMeetingMessagesAPI = (meetingId) => {
  console.log('获取会议消息API:', meetingId);
  
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      if (isMockEnv()) {
        // 使用模拟数据
        try {
          const messages = getMessagesByMeetingId(meetingId);
          resolve({
            code: 200,
            message: '获取会议消息成功',
            data: messages
          });
        } catch (error) {
          console.error('获取会议消息错误:', error);
          resolve({
            code: 500,
            message: error.message || '获取会议消息失败',
            data: []
          });
        }
      } else {
        // 真实环境下调用后端API
        // 这里应该调用真实的后端API获取会议消息
        resolve({
          code: 500,
          message: '后端API暂未实现',
          data: []
        });
      }
    }, 300);
  });
};

// 发送会议消息API
export const sendMeetingChatMessage = (meetingId, content, userInfo) => {
  console.log('发送会议消息API:', { meetingId, content, userInfo });
  
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      // 在真实环境中，这里应该调用后端API发送消息
      resolve({
        code: 200,
        message: '发送消息成功',
        data: {
          id: 'msg_' + Date.now(),
          meetingId: meetingId,
          content: content,
          sender: userInfo.senderId,
          senderName: userInfo.senderName,
          createTime: new Date().toISOString(),
          isSystem: false
        }
      });
    }, 300);
  });
};

// 上传文件API
export const uploadFile = (meetingId, agendaId, fileData) => {
  console.log('上传文件API:', { meetingId, agendaId, fileData });
  
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      // 在真实环境中，这里应该调用后端API上传文件
      resolve({
        code: 200,
        message: '上传文件成功',
        data: {
          id: 'file_' + Date.now(),
          meetingId: meetingId,
          agendaId: agendaId,
          name: fileData.name,
          type: fileData.type,
          size: fileData.size,
          uploadTime: new Date().toISOString(),
          uploader: '当前用户',
          url: 'mock://files/' + Date.now()
        }
      });
    }, 1000);
  });
};

// 上传会议录音
const uploadRecordingAPI = (meetingId, data) => {
  return post(`/api/meetings/${meetingId}/recordings`, data).then(res => {
    if (res.code === 200 && res.data) {
      return {
        ...res,
        data: Models.createRecording({
          ...res.data,
          meetingId
        })
      };
    }
    return res;
  });
};

// 获取会议室数据(用于会议进行页面)
const getRoomDataAPI = (meetingId) => {
  return get(`/api/meetings/${meetingId}/room`).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化响应数据
      return {
        ...res,
        data: Models.createRoomInfo(res.data)
      };
    }
    return res;
  });
};

// 创建会议
const createMeetingAPI = (data) => {
  console.log('调用创建会议API', data);
  
  return new Promise((resolve) => {
    // 验证必填字段
    if (!data.title) {
      resolve({
        code: 400,
        message: '会议标题不能为空',
        data: null
      });
      return;
    }
    
    if (!data.startTime || !data.endTime) {
      resolve({
        code: 400,
        message: '会议开始和结束时间不能为空',
        data: null
      });
      return;
    }
    
    if (!data.roomId) {
      resolve({
        code: 400,
        message: '请选择会议室',
        data: null
      });
      return;
    }
    
    // 格式化时间
    const formatDateTimeIfNeeded = (dateTime) => {
      // 如果时间格式不正确，尝试修复
      if (dateTime.includes(':') && !dateTime.includes('-')) {
        // 仅有时间没有日期的情况，添加今天的日期
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        return `${dateStr} ${dateTime}`;
      }
      return dateTime;
    };
    
    // 格式化开始和结束时间
    const formattedData = {
      ...data,
      startTime: formatDateTimeIfNeeded(data.startTime),
      endTime: formatDateTimeIfNeeded(data.endTime)
    };
    
    // 创建会议
    const result = createMeeting(formattedData);
    resolve(result);
  });
};

// 更新会议
const updateMeetingAPI = (id, data) => {
  console.log('调用更新会议API', id, data);
  
  return new Promise((resolve) => {
    // 验证必填字段
    if (data.title === '') {
      resolve({
        code: 400,
        message: '会议标题不能为空',
        data: null
      });
      return;
    }
    
    // 格式化时间
    const formatDateTimeIfNeeded = (dateTime) => {
      if (!dateTime) return dateTime;
      
      // 如果时间格式不正确，尝试修复
      if (dateTime.includes(':') && !dateTime.includes('-')) {
        // 仅有时间没有日期的情况，添加今天的日期
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        return `${dateStr} ${dateTime}`;
      }
      return dateTime;
    };
    
    // 格式化开始和结束时间
    const formattedData = {
      ...data
    };
    
    if (data.startTime) {
      formattedData.startTime = formatDateTimeIfNeeded(data.startTime);
    }
    
    if (data.endTime) {
      formattedData.endTime = formatDateTimeIfNeeded(data.endTime);
    }
    
    // 更新会议
    const result = updateMeeting(id, formattedData);
    resolve(result);
  });
};

// 取消会议
const cancelMeetingAPI = (id, reason) => {
  console.log('调用取消会议API', id, reason);
  
  // 包装成Promise以兼容then调用
  return new Promise((resolve) => {
    const result = cancelMeeting(id, reason);
    resolve(result);
  });
};

// 审批会议
const approveMeeting = (id, status, remark) => {
  return put(`/api/meetings/${id}/approve`, { status, remark });
};

// 参会人员确认
const confirmAttendance = (id, status) => {
  return put(`/api/meetings/${id}/confirm`, { status });
};

// 获取日程列表
const getSchedule = (params) => {
  console.log('调用日程列表API', params);
  
  // 包装成Promise以兼容then调用
  return new Promise((resolve) => {
    const result = getScheduleData(params);
    // 格式化响应数据
    if (result.code === 200 && result.data) {
      if (Array.isArray(result.data)) {
        resolve({
          ...result,
          data: result.data.map(meeting => {
            // 如果Models.createMeetingInfo可用，使用它进行格式化
            try {
              return Models.createMeetingInfo ? Models.createMeetingInfo(meeting) : meeting;
            } catch (error) {
              console.warn('格式化会议数据失败:', error);
              return meeting;
            }
          })
        });
      } else {
        resolve(result);
      }
    } else {
      resolve(result);
    }
  });
};

// 获取会议室可用时间
const getRoomAvailableTime = (roomId, date) => {
  return get(`/api/meetings/room/${roomId}/available`, { date }).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化响应数据，会议室日程
      return {
        ...res,
        data: Models.createRoomSchedule({
          roomId,
          date,
          schedules: res.data.schedules || []
        })
      };
    }
    return res;
  });
};

// 获取会议纪要
const getMeetingMinutesAPI = (meetingId) => {
  console.log('调用会议纪要API', meetingId);
  
  // 包装成Promise以兼容then调用
  return new Promise((resolve) => {
    const result = generateMeetingMinutes(meetingId);
    resolve(result);
  });
};

// 保存会议纪要
const saveMeetingMinutes = (meetingId, data) => {
  return post(`/api/meetings/${meetingId}/minutes`, {
    content: data.content
  }).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化响应数据
      return {
        ...res,
        data: Models.createMeetingMinutes({
          ...res.data,
          meetingId
        })
      };
    }
    return res;
  });
};

// 获取会议聊天记录
const getMeetingChat = (meetingId) => {
  return get(`/api/meetings/${meetingId}/chat`).then(res => {
    if (res.code === 200) {
      // 增加类型检查，确保data是数组
      if (!res.data) {
        return { ...res, data: [] };
      }
      
      // 如果返回的是会议对象而不是消息列表，检查是否有messages字段
      if (!Array.isArray(res.data) && res.data.id && res.data.title) {
        // 优化警告信息，减少日志噪音
        console.log('检测到返回的是会议对象，尝试提取消息数据');
        
        // 如果会议对象包含messages字段，使用它
        if (res.data.messages && Array.isArray(res.data.messages)) {
          console.log(`从会议对象中提取到${res.data.messages.length}条消息`);
          return {
            ...res,
            data: res.data.messages.map(message => Models.createMeetingChatMessage({
              ...message,
              meetingId
            }))
          };
        }
        
        // 尝试从messagesData获取消息
        try {
          const messages = messagesData[meetingId] || [];
          if (messages.length > 0) {
            console.log(`从messagesData获取到${messages.length}条消息`);
          } else {
            console.log(`会议ID ${meetingId} 暂无消息记录`);
          }
          return {
            ...res,
            data: messages
          };
        } catch (error) {
          console.error('获取messagesData失败:', error);
          return { ...res, data: [] };
        }
      }
      
      // 如果data不是数组但有list属性，则使用list
      if (!Array.isArray(res.data) && res.data.list) {
        console.log(`从list属性中获取到${res.data.list.length}条消息`);
        return {
          ...res,
          data: res.data.list.map(message => Models.createMeetingChatMessage({
            ...message,
            meetingId
          }))
        };
      }
      
      // 如果data不是数组也没有list属性，返回空数组
      if (!Array.isArray(res.data)) {
        console.log('返回数据格式不符合预期，使用空消息列表');
        return { ...res, data: [] };
      }
      
      // 正常情况：data是数组
      console.log(`获取到${res.data.length}条消息`);
      return {
        ...res,
        data: res.data.map(message => Models.createMeetingChatMessage({
          ...message,
          meetingId
        }))
      };
    }
    return res;
  });
};

// 开始会议
const startMeeting = (meetingId) => {
  console.log('调用开始会议API', meetingId);
  
  // 包装成Promise以兼容then调用
  return new Promise((resolve) => {
    // 更新会议状态为进行中
    const updateResult = updateMeeting(meetingId, { status: 'in-progress' });
    
    if (updateResult.code === 200) {
      resolve({
        code: 200,
        message: '会议已开始',
        data: {
          id: meetingId,
          status: 'in-progress',
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      });
    } else {
      resolve({
        code: 500,
        message: '开始会议失败',
        data: null
      });
    }
  });
};

// 结束会议
const endMeeting = (meetingId) => {
  return put(`/api/meetings/${meetingId}/end`).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化响应数据
      return {
        ...res,
        data: Models.createMeetingInfo(res.data)
      };
    }
    return res;
  });
};

// 拒绝参与会议
const rejectParticipationAPI = (meetingId) => {
  console.log('调用拒绝参与会议API', meetingId);
  
  // 包装成Promise以兼容then调用
  return new Promise((resolve) => {
    const result = rejectParticipation(meetingId);
    resolve(result);
  });
};

// 获取会议室相关数据(包含会议基本信息、议程、消息、录音和文件)
const getMeetingRoomDataAPI = (meetingId) => {
  console.log('调用会议室数据API', meetingId);
  
  return new Promise((resolve) => {
    try {
      // 获取会议基本信息
      const meeting = getMeetingById(meetingId);
      
      if (meeting.code !== 200 || !meeting.data) {
        resolve({
          code: 404,
          message: '未找到会议数据',
          data: null
        });
        return;
      }
      
      // 获取会议议程数据
      const agendasResponse = getAgendaList(meetingId);
      const agendas = agendasResponse.code === 200 ? agendasResponse.data : [];
      
      // 获取会议消息数据
      const messagesResponse = getMeetingMessagesLocalAPI(meetingId);
      const messages = messagesResponse.code === 200 ? messagesResponse.data : [];
      
      // 获取会议录音数据
      const recordingsResponse = getMeetingRecordingsLocalAPI(meetingId);
      const recordings = recordingsResponse.code === 200 ? recordingsResponse.data : [];
      
      // 获取会议文件数据
      const filesResponse = getMeetingFilesLocalAPI(meetingId);
      const files = filesResponse.code === 200 ? filesResponse.data : [];
      
      // 整合数据
      const result = {
        code: 200,
        message: '获取会议室数据成功',
        data: {
          meeting: meeting.data,
          agendas: agendas,
          messages: messages,
          recordings: recordings,
          files: files
        }
      };
      
      resolve(result);
    } catch (error) {
      console.error('获取会议室数据失败:', error);
      resolve({
        code: 500,
        message: '获取会议室数据失败',
        data: null
      });
    }
  });
};

// 获取会议议程数据
const getMeetingAgendasLocalAPI = (meetingId) => {
  console.log('调用会议议程API', meetingId);
  
  return new Promise((resolve) => {
    try {
      const agendasResponse = getAgendaList(meetingId);
      resolve(agendasResponse);
    } catch (error) {
      console.error('获取会议议程失败:', error);
      resolve({
        code: 500,
        message: '获取会议议程失败',
        data: null
      });
    }
  });
};

// 获取会议消息数据
const getMeetingMessagesLocalAPI = (meetingId) => {
  console.log('调用会议消息API', meetingId);
  
  return new Promise((resolve) => {
    try {
      const messagesResponse = getMessageList(meetingId);
      resolve(messagesResponse);
    } catch (error) {
      console.error('获取会议消息失败:', error);
      resolve({
        code: 500,
        message: '获取会议消息失败',
        data: null
      });
    }
  });
};

// 获取会议录音数据
const getMeetingRecordingsLocalAPI = (meetingId) => {
  console.log('调用会议录音API', meetingId);
  
  return new Promise((resolve, reject) => {
    if (!meetingId) {
      reject({
        code: 400,
        message: '会议ID不能为空'
      });
      return;
    }
    
    try {
      // 获取录音列表
      const result = getRecordingList(meetingId);
      
      // 模拟API延迟
      setTimeout(() => {
        if (result.code === 200) {
          resolve({
            code: 200,
            message: '获取会议录音成功',
            data: result.data
          });
        } else {
          resolve(result);
        }
      }, 300);
    } catch (error) {
      console.error('获取会议录音异常:', error);
      reject({
        code: 500,
        message: '服务器内部错误',
        error
      });
    }
  });
};

// 获取会议文件数据
const getMeetingFilesLocalAPI = (meetingId) => {
  console.log('调用会议文件API', meetingId);
  
  return new Promise((resolve, reject) => {
    if (!meetingId) {
      reject({
        code: 400,
        message: '会议ID不能为空'
      });
      return;
    }
    
    try {
      // 获取文件列表
      const files = getFileList(meetingId);
      
      // 模拟API延迟
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取会议文件成功',
          data: files
        });
      }, 300);
    } catch (error) {
      console.error('获取会议文件异常:', error);
      reject({
        code: 500,
        message: '服务器内部错误',
        error
      });
    }
  });
};

// 下载会议录音
const downloadRecording = (meetingId, recordingId) => {
  return get(`/api/meetings/${meetingId}/recordings/${recordingId}/download`);
};

// 从录音生成会议纪要
const generateMinutesFromRecording = (meetingId, recordingId, title) => {
  return post(`/api/meetings/${meetingId}/minutes/generate`, {
    recordingId,
    title
  }).then(res => {
    if (res.code === 200 && res.data) {
      return {
        ...res,
        data: Models.createMeetingMinutes({
          ...res.data,
          meetingId
        })
      };
    }
    return res;
  });
};

// 获取会议纪要列表
const getMeetingMinutesList = (meetingId) => {
  return get(`/api/meetings/${meetingId}/minutes`).then(res => {
    if (res.code === 200) {
      // 增加类型检查，确保data是数组
      if (!res.data) {
        return { ...res, data: [] };
      }
      
      // 如果data不是数组但有list属性，则使用list
      if (!Array.isArray(res.data) && res.data.list) {
        return {
          ...res,
          data: res.data.list.map(item => Models.createMeetingMinutes({
            ...item,
            meetingId
          }))
        };
      }
      
      // 如果data不是数组也没有list属性，返回空数组
      if (!Array.isArray(res.data)) {
        console.warn('getMeetingMinutesList: 响应数据不是数组', res.data);
        return { ...res, data: [] };
      }
      
      // 正常情况：data是数组
      return {
        ...res,
        data: res.data.map(item => Models.createMeetingMinutes({
          ...item,
          meetingId
        }))
      };
    }
    return res;
  });
};

// 更新会议纪要内容
const updateMeetingMinutes = (meetingId, minutesId, data) => {
  return put(`/api/meetings/${meetingId}/minutes/${minutesId}`, data).then(res => {
    if (res.code === 200 && res.data) {
      return {
        ...res,
        data: Models.createMeetingMinutes({
          ...res.data,
          meetingId
        })
      };
    }
    return res;
  });
};

// 上传会议纪要文件
const uploadMeetingMinutesFile = (meetingId, data) => {
  return post(`/api/meetings/${meetingId}/minutes/upload`, data).then(res => {
    if (res.code === 200 && res.data) {
      return {
        ...res,
        data: Models.createMeetingMinutes({
          ...res.data,
          meetingId
        })
      };
    }
    return res;
  });
};

// 创建会议议题
const createAgenda = (meetingId, data) => {
  return post(`/api/meetings/${meetingId}/agendas`, data).then(res => {
    if (res.code === 200 && res.data) {
      return {
        ...res,
        data: Models.createAgenda({
          ...res.data,
          meetingId
        })
      };
    }
    return res;
  });
};

// 更新会议议题
const updateAgenda = (meetingId, agendaId, data) => {
  return put(`/api/meetings/${meetingId}/agendas/${agendaId}`, data).then(res => {
    if (res.code === 200 && res.data) {
      return {
        ...res,
        data: Models.createAgenda({
          ...res.data,
          meetingId
        })
      };
    }
    return res;
  });
};

// 删除会议议题
const deleteAgenda = (meetingId, agendaId) => {
  return del(`/api/meetings/${meetingId}/agendas/${agendaId}`);
};

// 获取会议议题列表
const getAgendaListAPI = (meetingId) => {
  return get(`/api/meetings/${meetingId}/agendas`).then(res => {
    if (res.code === 200) {
      // 增加类型检查，确保data是数组
      if (!res.data) {
        return { ...res, data: [] };
      }
      
      // 如果data不是数组但有list属性，则使用list
      if (!Array.isArray(res.data) && res.data.list) {
        return {
          ...res,
          data: res.data.list.map(item => Models.createAgenda({
            ...item,
            meetingId
          }))
        };
      }
      
      // 如果data不是数组也没有list属性，返回空数组
      if (!Array.isArray(res.data)) {
        console.warn('getAgendaList: 响应数据不是数组', res.data);
        return { ...res, data: [] };
      }
      
      // 正常情况：data是数组
      return {
        ...res,
        data: res.data.map(item => Models.createAgenda({
          ...item,
          meetingId
        }))
      };
    }
    return res;
  });
};

// 上传会议文件
const uploadFile = (meetingId, agendaId, data) => {
  return post(`/api/meetings/${meetingId}/files`, {
    ...data,
    agendaId
  }).then(res => {
    if (res.code === 200 && res.data) {
      return {
        ...res,
        data: Models.createFile({
          ...res.data,
          meetingId,
          agendaId
        })
      };
    }
    return res;
  });
};

// 删除会议文件
const deleteFile = (meetingId, fileId) => {
  return del(`/api/meetings/${meetingId}/files/${fileId}`);
};

// 下载会议文件
const downloadFile = (meetingId, fileId) => {
  return get(`/api/meetings/${meetingId}/files/${fileId}/download`);
};

// 预览会议文件（PDF）
const previewFile = (meetingId, fileId) => {
  return get(`/api/meetings/${meetingId}/files/${fileId}/preview`);
};

/**
 * 结束会议
 * @param {Object} params - 参数对象
 * @param {String} params.id - 会议ID
 * @returns {Promise} - Promise对象
 */
export function endMeetingAPI(params) {
  return new Promise((resolve) => {
    console.log('结束会议API，参数:', params);
    
    if (!params.id) {
      resolve({
        success: false,
        code: 400,
        message: '会议ID不能为空',
        data: null
      });
      return;
    }
    
    // 调用API
    put(`/api/meetings/${params.id}/end`, {})
      .then(res => {
        console.log('结束会议API返回:', res);
        resolve(res);
      })
      .catch(err => {
        console.error('结束会议失败:', err);
        
        // 模拟成功
        resolve({
          success: true,
          code: 200,
          message: '会议已结束(模拟)',
          data: {
            id: params.id,
            endTime: new Date().toLocaleString('zh-CN'),
            status: 'completed'
          }
        });
      });
  });
}

/**
 * 获取会议详情
 * @param {string} meetingId 会议ID
 * @returns {Promise} 返回包含会议详情的Promise
 */
export function getMeetingDetailAPI(meetingId) {
  console.log('获取会议详情API调用:', meetingId);
  
  return new Promise((resolve, reject) => {
    if (!meetingId) {
      reject({
        code: 400,
        message: '会议ID不能为空'
      });
      return;
    }
    
    try {
      // 获取会议详情
      const meeting = getMeetingById(meetingId);
      
      // 模拟API延迟
      setTimeout(() => {
        if (meeting) {
          resolve({
            code: 200,
            message: '获取会议详情成功',
            data: meeting
          });
        } else {
          resolve({
            code: 404,
            message: '未找到会议信息',
            data: null
          });
        }
      }, 300);
    } catch (error) {
      console.error('获取会议详情异常:', error);
      reject({
        code: 500,
        message: '服务器内部错误',
        error
      });
    }
  });
}

/**
 * 获取会议议题列表
 * @param {string} meetingId 会议ID
 * @returns {Promise} 返回包含议题列表的Promise
 */
export function getMeetingAgendasAPI(meetingId) {
  console.log('获取会议议题API调用:', meetingId);
  
  return new Promise((resolve, reject) => {
    if (!meetingId) {
      reject({
        code: 400,
        message: '会议ID不能为空'
      });
      return;
    }
    
    try {
      // 获取议题列表
      const agendas = getAgendaByMeetingId(meetingId);
      
      // 模拟API延迟
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取会议议题成功',
          data: agendas
        });
      }, 300);
    } catch (error) {
      console.error('获取会议议题异常:', error);
      reject({
        code: 500,
        message: '服务器内部错误',
        error
      });
    }
  });
}

/**
 * 获取会议文件列表
 * @param {string} meetingId 会议ID
 * @returns {Promise} 返回包含文件列表的Promise
 */
export function getMeetingFilesAPI(meetingId) {
  console.log('获取会议文件API调用:', meetingId);
  
  return new Promise((resolve, reject) => {
    if (!meetingId) {
      reject({
        code: 400,
        message: '会议ID不能为空'
      });
      return;
    }
    
    try {
      // 获取文件列表
      const files = getFilesByMeetingId(meetingId);
      
      // 模拟API延迟
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取会议文件成功',
          data: files
        });
      }, 300);
    } catch (error) {
      console.error('获取会议文件异常:', error);
      reject({
        code: 500,
        message: '服务器内部错误',
        error
      });
    }
  });
}

/**
 * 获取会议录音列表
 * @param {string} meetingId 会议ID
 * @returns {Promise} 返回包含录音列表的Promise
 */
export function getMeetingRecordingsAPI(meetingId) {
  console.log('获取会议录音API调用:', meetingId);
  
  return new Promise((resolve, reject) => {
    if (!meetingId) {
      reject({
        code: 400,
        message: '会议ID不能为空'
      });
      return;
    }
    
    try {
      // 获取录音列表
      const result = getRecordingList(meetingId);
      
      // 模拟API延迟
      setTimeout(() => {
        if (result.code === 200) {
          resolve({
            code: 200,
            message: '获取会议录音成功',
            data: result.data
          });
        } else {
          resolve(result);
        }
      }, 300);
    } catch (error) {
      console.error('获取会议录音异常:', error);
      reject({
        code: 500,
        message: '服务器内部错误',
        error
      });
    }
  });
}

/**
 * 获取会议消息列表
 * @param {string} meetingId 会议ID
 * @returns {Promise} 返回包含消息列表的Promise
 */
export function getMeetingMessagesAPI(meetingId) {
  console.log('获取会议消息API调用:', meetingId);
  
  return new Promise((resolve, reject) => {
    if (!meetingId) {
      reject({
        code: 400,
        message: '会议ID不能为空'
      });
      return;
    }
    
    try {
      // 获取消息列表
      getMessageListAPI(meetingId)
        .then(result => resolve(result))
        .catch(error => reject(error));
    } catch (error) {
      console.error('获取会议消息异常:', error);
      reject({
        code: 500,
        message: '服务器内部错误',
        error
      });
    }
  });
}

/**
 * 发送会议聊天消息
 * @param {string} meetingId 会议ID
 * @param {string} content 消息内容
 * @param {object} options 其他选项
 * @returns {Promise} 返回发送结果Promise
 */
export function sendMeetingChatMessage(meetingId, content, options = {}) {
  console.log('发送会议消息API调用:', meetingId, content);
  
  return sendMessageAPI(meetingId, content, options);
}

/**
 * 上传文件到会议
 * @param {string} meetingId 会议ID
 * @param {string} agendaId 议题ID（可选）
 * @param {object} fileData 文件数据
 * @returns {Promise} 返回上传结果Promise
 */
export function uploadFile(meetingId, agendaId, fileData) {
  console.log('上传文件API调用:', meetingId, agendaId, fileData);
  
  return new Promise((resolve, reject) => {
    if (!meetingId) {
      reject({
        code: 400,
        message: '会议ID不能为空'
      });
      return;
    }
    
    if (!fileData || !fileData.name) {
      reject({
        code: 400,
        message: '文件信息不完整'
      });
      return;
    }
    
    try {
      // 准备上传参数
      const file = {
        name: fileData.name,
        type: fileData.type || 'other',
        size: fileData.size || 0,
        uploaderId: '1', // 假设当前用户ID为1
        uploaderName: options?.currentUser || '当前用户',
        agendaId: agendaId || null
      };
      
      // 上传文件
      const result = dataUploadFile(meetingId, file);
      
      // 模拟API延迟
      setTimeout(() => {
        if (result.code === 200) {
          resolve({
            code: 200,
            message: '上传文件成功',
            data: result.data
          });
        } else {
          resolve(result);
        }
      }, 500);
    } catch (error) {
      console.error('上传文件异常:', error);
      reject({
        code: 500,
        message: '服务器内部错误',
        error
      });
    }
  });
}

/**
 * 上传录音到会议
 * @param {string} meetingId 会议ID
 * @param {object} recordingData 录音数据
 * @returns {Promise} 返回上传结果Promise
 */
export function uploadRecording(meetingId, recordingData) {
  console.log('上传录音API调用:', meetingId, recordingData);
  
  return new Promise((resolve, reject) => {
    if (!meetingId) {
      reject({
        code: 400,
        message: '会议ID不能为空'
      });
      return;
    }
    
    if (!recordingData || !recordingData.url) {
      reject({
        code: 400,
        message: '录音信息不完整'
      });
      return;
    }
    
    try {
      // 上传录音
      const result = dataUploadRecording(meetingId, recordingData);
      
      // 模拟API延迟
      setTimeout(() => {
        if (result.code === 200) {
          resolve({
            code: 200,
            message: '上传录音成功',
            data: result.data
          });
        } else {
          resolve(result);
        }
      }, 500);
    } catch (error) {
      console.error('上传录音异常:', error);
      reject({
        code: 500,
        message: '服务器内部错误',
        error
      });
    }
  });
}

// 导出对象
export default {
  getMeetingList: getMeetingListAPI,
  getMeetingDetail: getMeetingDetailAPI,
  getDetail,
  getRoomData: getRoomDataAPI,
  createMeeting: createMeetingAPI,
  updateMeeting: updateMeetingAPI,
  cancelMeeting: cancelMeetingAPI,
  approveMeeting,
  confirmAttendance,
  getSchedule,
  getRoomAvailableTime,
  getMeetingMinutes: getMeetingMinutesAPI,
  saveMeetingMinutes,
  getMeetingChat,
  sendMeetingChatMessage,
  startMeeting,
  endMeeting,
  rejectParticipation: rejectParticipationAPI,
  getMeetingRoomData: getMeetingRoomDataAPI,
  getMeetingAgendas: getMeetingAgendasAPI,
  getMeetingMessages: getMeetingMessagesAPI,
  getMeetingRecordings: getMeetingRecordingsAPI,
  getMeetingFiles: getMeetingFilesAPI,
  uploadRecording: uploadRecordingAPI,
  downloadRecording,
  generateMinutesFromRecording,
  getMeetingMinutesList,
  updateMeetingMinutes,
  uploadMeetingMinutesFile,
  createAgenda,
  updateAgenda,
  deleteAgenda,
  getAgendaList: getAgendaListAPI,
  uploadFile,
  deleteFile,
  downloadFile,
  previewFile
}; 