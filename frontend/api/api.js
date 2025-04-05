import axios from 'axios';
import config from '../config';
import * as Models from './backend_models';

// 创建一个用于uni-app的adapter
const uniAppAdapter = (config) => {
  return new Promise((resolve, reject) => {
    // 构建完整URL，确保使用http或https协议
    let fullUrl = config.url;
    
    // 如果url不是以http开头，需要添加baseURL
    if (!fullUrl.startsWith('http')) {
      fullUrl = (config.baseURL || '') + fullUrl;
    }
    
    // 确保URL是有效的http或https URL
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'http://' + fullUrl.replace(/^\/+/, '');
    }
    
    const requestConfig = {
      url: fullUrl,
      method: config.method.toLowerCase(),
      data: config.data,
      header: config.headers,
      timeout: config.timeout,
      dataType: 'json',
      responseType: config.responseType || 'text',
      success: (res) => {
        resolve({
          data: res.data,
          status: res.statusCode,
          headers: res.header,
          config: config
        });
      },
      fail: (err) => {
        console.log('uni.request失败:', err, '请求配置:', requestConfig);
        reject(err);
      },
      complete: () => {}
    };

    // 处理params参数 - 不使用URLSearchParams，手动构建查询字符串
    if (config.params) {
      const queryParts = [];
      for (const key in config.params) {
        if (config.params[key] !== undefined && config.params[key] !== null) {
          const value = config.params[key];
          const encodedKey = encodeURIComponent(key);
          const encodedValue = encodeURIComponent(value);
          queryParts.push(`${encodedKey}=${encodedValue}`);
        }
      }
      const queryString = queryParts.join('&');
      if (queryString) {
        requestConfig.url += (requestConfig.url.includes('?') ? '&' : '?') + queryString;
      }
    }
    

    // 使用uni.request发送请求
    uni.request(requestConfig);
  });
};

// 根据平台选择适当的适配器
const selectAdapter = () => {
  // #ifdef APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
  return uniAppAdapter;
  // #endif
  
  // #ifdef H5
  return null; // 在H5环境中使用默认的xhr适配器
  // #endif
  
  return uniAppAdapter; // 默认使用uniAppAdapter
};

// 创建一个axios实例
const instance = axios.create({
  baseURL: config.apiBaseUrl || '', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  adapter: selectAdapter() // 使用适合当前平台的适配器
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 从本地存储获取token
    const token = uni.getStorageSync('token');
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    
    // 添加请求日志
    console.log('【API请求】', {
      url: config.baseURL + config.url,
      method: config.method.toUpperCase(),
      data: config.data,
      params: config.params,
      headers: config.headers
    });
    
    return config;
  },
  error => {
    console.log('【API请求错误】', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  
  response => {
    if (response.data.code === 401) {
      // 清除token
      uni.removeStorageSync('token');
      
      // 跳转到登录页
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/user/login'
        });
      }, 500);
    }
    // 添加响应日志
    console.log('【API响应】', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    
    // 直接返回响应数据，不进行模型转换
    return response.data;
  },
  error => {
    // 添加错误日志
    console.log('【API响应错误】', {
      url: error.config ? error.config.url : '未知',
      status: error.response ? error.response.status : '未知',
      data: error.response ? error.response.data : error.message
    });
    
    // 处理401未授权
    if (error.response && error.response.status === 401) {
      // 清除token
      uni.removeStorageSync('token');
      
      // 不自动跳转，而是返回401状态让调用方处理
      console.log('认证失败(401)，需要重新登录');
      return Promise.reject({
        message: '登录状态已过期，请重新登录',
        code: 401,
        data: error.response.data
      });
    }
    return Promise.reject(error);
  }
);

// 用户通用API

// 生成验证码
export const getCaptcha = () => {
  return instance.get('/user/captchaImage');
};

// 用户登录
export const login = (username, password, code, uuid) => {
  const loginBody = {username, password, code, uuid};
  return instance.post('/user/login', loginBody);
};

// 用户注册
export const register = (username, password, code, uuid) => {
  const registerBody = {username, password, code, uuid};
  return instance.post('/user/register', registerBody);
};

// 获取登录用户信息
export const getUserInfo = () => {
  return instance.get('/user/info');
};

// 退出登录
export const logout = () => {
  return instance.post('/user/logout');
};

// 更新用户密码
export const updatePassword = (passwordData) => {
  return instance.put('/user/password', passwordData);
};

// 通知操作API

// 分页查询通知
export const getNotifications = (pageNo = 1, pageSize = 5, isAsc = true, sortBy = 'id') => {
  return instance.get('/notify', {
    params: { pageNo, pageSize, isAsc, sortBy }
  });
};

// 通过id查看通知
export const getNotificationById = (id) => {
  return instance.get(`/notify/${id}`);
};

// 管理员会前提醒
export const adminRemind = (id) => {
  return instance.post(`/notify/${id}`);
};

// 管理员通过id查看通知（可查看所有通知）
export const adminGetNotification = (id) => {
  return instance.get(`/notify/admin/${id}`);
};

// 会议室操作API

// 管理员添加会议室
export const createRoom = (roomData) => {
  return instance.post('/room/create', roomData);
};

// 分页查询会议室
export const getRooms = (pageNo = 1, pageSize = 5, isAsc = true, sortBy = 'id') => {
  return instance.get('/room', {
    params: { pageNo, pageSize, isAsc, sortBy }
  });
};

// 管理员更新会议室信息
export const updateRoom = (roomData) => {
  return instance.put('/room/update', roomData);
};

// 管理员删除会议室
export const deleteRoom = (id) => {
  return instance.delete(`/room/${id}`);
};

// 会议预约API

// 分页查询会议
export const getReservations = (params = {}) => {
  return instance.get('/reservation', {
    params: {
      pageNo: params.pageNo || 1,
      pageSize: params.pageSize || 5,
      isAsc: params.isAsc !== undefined ? params.isAsc : true,
      sortBy: params.sortBy ,
      startTime: params.startTime,
      endTime: params.endTime,
      reserveDate: params.reserveDate
    }
  });
};

// 管理员审批会议
export const approveReservation = (id, isAllowed) => {
  return instance.put('/reservation/approve', null, {
    params: { id, isAllowed }
  });
};

// 取消会议
export const cancelReservation = (id) => {
  return instance.put(`/reservation/${id}`);
};

// 管理员取消会议
export const adminCancelReservation = (id) => {
  return instance.put(`/reservation/admin/${id}`);
};

// 预约会议
export const bookReservation = (reservationData) => {
  return instance.post('/reservation/book', reservationData);
};

// 参会人员API

// 确认是否参加会议
export const confirmParticipation = (id, join) => {
  return instance.put('/participants/join', null, {
    params: { id, join }
  });
};

// 查看参会人员
export const getParticipants = (id) => {
  return instance.get(`/participants/${id}`);
};

// 子议题操作API

// 创建子议题
export const createSubtopic = (subtopicData) => {
  return instance.post('/sub', subtopicData);
};

// 修改子议题
export const updateSubtopic = (subtopicData) => {
  return instance.put('/sub', subtopicData);
};

// 上传子议题文件
export const uploadSubtopicFile = (subId, fileKey, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return instance.post(`/sub/upload/file/${subId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: { fileKey, fileName: file.name }
  });
};

// 删除子议题
export const deleteSubtopic = (subId) => {
  return instance.delete(`/sub/${subId}`);
};

// 删除子议题文件
export const deleteSubtopicFile = (subFileId) => {
  return instance.delete(`/sub/file/${subFileId}`);
};

// 获取子议题文件列表
export const getSubtopicFileList = (subId) => {
  return instance.get(`/sub/${subId}/file/list`);
};

// 查询会议的子议题列表
export const getSubtopicsByReservationId = (reservationId) => {
  return instance.get(`/sub/${reservationId}`);
};

// 文件操作API

// 获取文件url
export const getFileUrl = (fileKey) => {
  return instance.get('/file/url', {
    params: { fileKey }
  });
};

// 下载文件
export const downloadFile = (fileKey) => {
  return instance.get('/file/download', {
    params: { fileKey },
    responseType: 'blob'
  });
};

// 上传文件
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return instance.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 会议音频API

// 上传会议音频并生成总结
export const uploadAudioAndGenerateSummary = (reservationId, fileUrl, file) => {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  
  return instance.post(`/meeting/audio/${reservationId}?fileUrl=${encodeURIComponent(fileUrl)}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 获取会议摘要
export const getMeetingSummary = (reservationId) => {
  return instance.get(`/reservation/${reservationId}/summary`);
};

// 修改会议摘要
export const updateMeetingSummary = (summaryData) => {
  return instance.put('/reservation/summary', summaryData);
};

// RPA相关API
// 上传RPA文件
export const uploadRpaFile = (url, name, topped) => {
  return instance.post(`/rpa?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}&topped=${topped}`);
};

// 分页查询RPA文件
export const getRpaFiles = (pageNo = 1, pageSize = 20, isAsc = true, sortBy = 'id') => {
  return instance.get('/rpa', {
    params: { pageNo, pageSize, isAsc, sortBy }
  });
};

// 删除RPA文件
export const deleteRpaFile = (id) => {
  return instance.delete(`/rpa/${id}`);
};

// 测试用API (未实现功能，仅满足API文档规范)

// 测试接口
export const testApi = () => {
  return instance.post('/test/test');
};

// 测试上传文件
export const testUpload = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return instance.post('/test/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 获取预签名文件URL
export const getPresignedUrl = () => {
  return instance.post('/test/getUrl');
};

// 测试下载文件
export const testDownloadFile = () => {
  return instance.get('/test/downLoadFile', {
    responseType: 'blob'
  });
};

// 获取用户列表
export const getUsers = (pageNo = 1, pageSize = 20, isAsc = true, sortBy = 'id', userName = '') => {
  return instance.get('/user', {
    params: {
      pageNo,
      pageSize,
      isAsc,
      sortBy,
      userName
    }
  });
};

export { Models };

export default {
  getCaptcha,
  login,
  register,
  getUserInfo,
  logout,
  updatePassword,
  getNotifications,
  getNotificationById,
  adminRemind,
  adminGetNotification,
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom,
  getReservations,
  approveReservation,
  cancelReservation,
  adminCancelReservation,
  bookReservation,
  confirmParticipation,
  getParticipants,
  createSubtopic,
  updateSubtopic,
  uploadSubtopicFile,
  deleteSubtopic,
  deleteSubtopicFile,
  getSubtopicFileList,
  getSubtopicsByReservationId,
  getFileUrl,
  downloadFile,
  uploadFile,
  uploadAudioAndGenerateSummary,
  getMeetingSummary,
  updateMeetingSummary,
  uploadRpaFile,
  getRpaFiles,
  deleteRpaFile,
  // 测试API
  testApi,
  testUpload,
  getPresignedUrl,
  testDownloadFile,
  getUsers,
  // 数据模型
  Models
}; 