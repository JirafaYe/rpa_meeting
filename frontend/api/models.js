/**
 * API 模型实例
 * 此文件提供了具体的 API 模型实例，用于前后端交互
 */
import * as Types from './types';

// =================== 用户相关模型 ===================

// 创建用户信息实例
export const createUserInfo = (data = {}) => {
  return {
    id: data.id || '',
    name: data.name || '',
    avatar: data.avatar || '',
    department: data.department || '',
    email: data.email || '',
    phone: data.phone || '',
    role: data.role || 'user',
    status: data.status || 'online',
    isOnline: data.isOnline || false,
    lastActiveTime: data.lastActiveTime || ''
  };
};

// 创建登录请求实例
export const createLoginRequest = (username = '', password = '') => {
  return {
    username,
    password
  };
};

// 创建登录响应实例
export const createLoginResponse = (data = {}) => {
  return {
    token: data.token || '',
    userInfo: {
      id: data.userInfo?.id || '',
      name: data.userInfo?.name || '',
      role: data.userInfo?.role || '',
      avatar: data.userInfo?.avatar || ''
    }
  };
};

// 创建用户列表请求实例
export const createUserListRequest = (data = {}) => {
  return {
    page: data.page || 1,
    limit: data.limit || 10,
    keyword: data.keyword || '',
    status: data.status || ''
  };
};

// 创建用户修改请求实例
export const createUserModifyRequest = (data = {}) => {
  return {
    username: data.username || '',
    password: data.password || '',
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    department: data.department || '',
    position: data.position || '',
    role: data.role || 'user',
    status: data.status || 'active'
  };
};

// 创建部门实例
export const createDepartment = (data = {}) => {
  return {
    id: data.id || '',
    name: data.name || '',
    count: data.count || 0
  };
};

// =================== 会议相关模型 ===================

/**
 * 创建会议信息模型
 * @param {Object} data - 原始会议数据
 * @returns {Object} 格式化后的会议信息
 */
export function createMeetingInfo(data = {}) {
  // 规范化状态处理
  let status = data.status || 'pending';
  
  // 如果状态是数字
  if (typeof status === 'number' || /^\d+$/.test(status)) {
    const numStatus = parseInt(status);
    switch(numStatus) {
      case 1: status = 'pending'; break;
      case 2: status = 'in-progress'; break;
      case 3: status = 'completed'; break;
      case 4: status = 'cancelled'; break;
      default: status = 'pending'; break;
    }
  } else if (typeof status === 'string') {
    // 统一小写处理
    status = status.toLowerCase();
    // 统一状态名称
    if (status.includes('pend') || status.includes('wait') || status.includes('creat')) {
      status = 'pending';
    } else if (status.includes('progress') || status.includes('ongo') || status.includes('start')) {
      status = 'in-progress';
    } else if (status.includes('complet') || status.includes('finish') || status.includes('end')) {
      status = 'completed';
    } else if (status.includes('cancel')) {
      status = 'cancelled';
    } else {
      status = 'pending';
    }
  }
  
  return {
    id: data.id || '',
    title: data.title || '',
    description: data.description || '',
    roomId: data.roomId || '',
    roomName: data.roomName || '',
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    createTime: data.createTime || '',
    updateTime: data.updateTime || '',
    status: status,
    type: data.type || 'regular',
    organizer: createUserInfo(data.organizer),
    participants: Array.isArray(data.participants) 
      ? data.participants.map(p => createUserInfo(p)) 
      : [],
    attachments: Array.isArray(data.attachments) 
      ? data.attachments.map(a => createFileInfo(a)) 
      : [],
    isRpa: data.isRpa || false,
    rpaConfig: data.rpaConfig || null
  };
}

// 创建会议列表请求实例
export const createMeetingListRequest = (data = {}) => {
  return {
    page: data.page || 1,
    limit: data.limit || 10,
    keyword: data.keyword || '',
    status: data.status || '',
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    organizerId: data.organizerId || '',
    participantId: data.participantId || ''
  };
};

// 创建会议修改请求实例
export const createMeetingModifyRequest = (data = {}) => {
  return {
    title: data.title || '',
    description: data.description || '',
    roomId: data.roomId || '',
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    type: data.type || 'regular',
    participants: data.participants || [],
    attachments: data.attachments || [],
    isRpa: data.isRpa || false,
    rpaConfig: data.rpaConfig || null
  };
};

// 创建会议纪要实例
export const createMeetingMinutes = (data = {}) => {
  return {
    id: data.id || '',
    meetingId: data.meetingId || '',
    title: data.title || '',
    content: data.content || '',
    creator: createUserInfo(data.creator || {}),
    createTime: data.createTime || '',
    updateTime: data.updateTime || '',
    status: data.status || 'draft'
  };
};

// 创建会议聊天消息实例
export const createMeetingChatMessage = (data = {}) => {
  return {
    id: data.id || '',
    meetingId: data.meetingId || '',
    content: data.content || '',
    senderId: data.senderId || '',
    senderName: data.senderName || '',
    senderAvatar: data.senderAvatar || '',
    sendTime: data.sendTime || '',
    type: data.type || 'text',
    isRead: data.isRead || false
  };
};

// =================== 会议室相关模型 ===================

// 创建会议室信息实例
export const createRoomInfo = (data = {}) => {
  return {
    id: data.id || '',
    name: data.name || '',
    location: data.location || '',
    capacity: data.capacity || 0,
    facilities: Array.isArray(data.facilities) ? data.facilities : [],
    status: data.status || 'available',
    currentMeeting: data.currentMeeting ? createMeetingInfo(data.currentMeeting) : null
  };
};

// 创建会议室列表请求实例
export const createRoomListRequest = (data = {}) => {
  return {
    page: data.page || 1,
    limit: data.limit || 10,
    keyword: data.keyword || '',
    status: data.status || '',
    minCapacity: data.minCapacity || 0,
    maxCapacity: data.maxCapacity || 0,
    equipmentIds: data.equipmentIds || []
  };
};

// 创建会议室修改请求实例
export const createRoomModifyRequest = (data = {}) => {
  return {
    name: data.name || '',
    location: data.location || '',
    capacity: data.capacity || 0,
    description: data.description || '',
    status: data.status || 'available',
    equipments: data.equipments || [],
    imageUrl: data.imageUrl || ''
  };
};

// 创建会议室设备类型实例
export const createEquipmentType = (data = {}) => {
  return {
    id: data.id || '',
    name: data.name || '',
    icon: data.icon || ''
  };
};

// 创建会议室日程实例
export const createRoomSchedule = (data = {}) => {
  return {
    roomId: data.roomId || '',
    date: data.date || '',
    schedules: Array.isArray(data.schedules) 
      ? data.schedules.map(s => ({
          startTime: s.startTime || '',
          endTime: s.endTime || '',
          meetingId: s.meetingId || '',
          title: s.title || '',
          organizer: createUserInfo(s.organizer)
        })) 
      : []
  };
};

// =================== 通知相关模型 ===================

// 创建通知信息实例
export const createNotificationInfo = (data = {}) => {
  return {
    id: data.id || '',
    title: data.title || '',
    content: data.content || '',
    type: data.type || 'system',
    status: data.status || 'unread',
    createTime: data.createTime || '',
    data: data.data || null
  };
};

// 创建通知列表请求实例
export const createNotificationListRequest = (data = {}) => {
  return {
    page: data.page || 1,
    limit: data.limit || 10,
    type: data.type || '',
    status: data.status || ''
  };
};

// =================== RPA相关模型 ===================

// 创建RPA配置实例
export const createRpaConfig = (data = {}) => {
  return {
    meetingId: data.meetingId || '',
    enabled: data.enabled || false,
    recordAudio: data.recordAudio || false,
    recordVideo: data.recordVideo || false,
    autoTranscribe: data.autoTranscribe || false,
    autoSummary: data.autoSummary || false,
    settings: data.settings || null
  };
};

// 创建RPA状态实例
export const createRpaStatus = (data = {}) => {
  return {
    meetingId: data.meetingId || '',
    status: data.status || 'idle',
    recordingTime: data.recordingTime || 0,
    progress: data.progress || 0,
    error: data.error || null
  };
};

// 创建通用响应实例
export const createApiResponse = (code = 200, message = '操作成功', data = null) => {
  return {
    code,
    message,
    data
  };
};

// 创建分页数据实例
export const createPaginationData = (data = {}) => {
  return {
    total: data.total || 0,
    list: data.list || [],
    page: data.page || 1,
    limit: data.limit || 10
  };
};

// 创建文件信息实例
export const createFileInfo = (data = {}) => {
  return {
    id: data.id || '',
    name: data.name || '',
    type: data.type || '',
    size: data.size || 0,
    url: data.url || '',
    uploadTime: data.uploadTime || '',
    uploaderId: data.uploaderId || '',
    uploaderName: data.uploaderName || ''
  };
};

// 创建会议议程模型
export const createAgenda = (data = {}) => {
  return {
    id: data.id || '',
    meetingId: data.meetingId || '',
    title: data.title || '',
    description: data.description || '',
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    presenter: createUserInfo(data.presenter || {}),
    status: data.status || 'pending',
    files: Array.isArray(data.files) 
      ? data.files.map(f => createFileInfo(f)) 
      : [],
    createTime: data.createTime || '',
    updateTime: data.updateTime || '',
    order: data.order || 0
  };
};

// 创建录音模型
export const createRecording = (data = {}) => {
  return {
    id: data.id || '',
    meetingId: data.meetingId || '',
    name: data.name || '',
    url: data.url || '',
    duration: data.duration || 0,
    size: data.size || 0,
    createTime: data.createTime || '',
    status: data.status || 'completed',
    transcriptUrl: data.transcriptUrl || null,
    uploaderId: data.uploaderId || '',
    uploaderName: data.uploaderName || ''
  };
};

// 创建文件模型
export const createFile = (data = {}) => {
  return {
    id: data.id || '',
    meetingId: data.meetingId || '',
    agendaId: data.agendaId || '',
    name: data.name || '',
    type: data.type || '',
    size: data.size || 0,
    url: data.url || '',
    uploadTime: data.uploadTime || '',
    uploaderId: data.uploaderId || '',
    uploaderName: data.uploaderName || ''
  };
};

export default {
  createMeetingInfo,
  createUserInfo,
  createFileInfo,
  createRoomInfo,
  createRoomSchedule,
  createMeetingChatMessage,
  createAgenda,
  createMeetingMinutes,
  createRecording,
  createFile
}; 