import config from '../config'
import * as mockData from '../data'
import * as Types from './types'
import * as Models from './models'

const BASE_URL = config.apiBaseUrl || 'http://localhost:3000';
// 修改为强制启用模拟数据
const USE_MOCK = true; // 始终使用模拟数据

// 请求拦截器
const requestInterceptor = (config) => {
  // 获取token
  const token = uni.getStorageSync('token');
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    };
  }
  return config;
};

// 响应拦截器
const responseInterceptor = (response) => {
  const { data } = response;
  // 统一处理响应
  if (data.code === 401) {
    // token过期，跳转到登录页
    uni.removeStorageSync('token');
    uni.removeStorageSync('userInfo');
    uni.showToast({
      title: '登录已过期，请重新登录',
      icon: 'none'
    });
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/user/login'
      });
    }, 1500);
    return Promise.reject(new Error('登录已过期'));
  }
  
  if (data.code !== 200) {
    uni.showToast({
      title: data.message || '请求失败',
      icon: 'none'
    });
    return Promise.reject(new Error(data.message || '请求失败'));
  }
  
  // 返回整个响应对象，而不仅仅是data.data
  return data;
};

// 检查是否需要使用模拟数据处理请求
const processMockRequest = (url, method, data, options = {}) => {
  // 在开发环境中使用模拟数据
  if (!USE_MOCK) return null;
  
  console.log(`[MOCK] 处理请求: ${method} ${url}`, data);
  
  // 解析路径参数，例如 /api/meetings/1 中的1
  const extractIdFromUrl = (url, pattern) => {
    const regex = new RegExp(pattern.replace('{id}', '([^/]+)'));
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  
  // 用户相关接口
  if (url === '/api/user/login' && method === 'POST') {
    return mockData.userAPI.login(data.username, data.password);
  }
  
  if (url === '/api/user/info' && method === 'GET') {
    // 从localStorage获取用户ID
    const token = uni.getStorageSync('token');
    const userId = token ? token.split('-')[1] : '1';
    return mockData.userAPI.getUserById(userId);
  }
  
  if (url === '/api/user/list' && method === 'GET') {
    return mockData.userAPI.getUserList(data.page, data.limit);
  }
  
  // 会议相关接口
  if (url === '/api/meetings' && method === 'GET') {
    return mockData.meetingAPI.getMeetingList(data);
  }
  
  // 创建会议
  if (url === '/api/meetings' && method === 'POST') {
    return mockData.meetingAPI.createMeeting(data);
  }
  
  // 会议日程接口
  if (url === '/api/meetings/schedule' && method === 'GET') {
    // 使用data目录下的日程数据生成函数
    return mockData.meetingAPI.getScheduleData(data);
  }
  
  const meetingId = extractIdFromUrl(url, '/api/meetings/{id}');
  if (meetingId && method === 'GET') {
    return mockData.meetingAPI.getMeetingById(meetingId);
  }
  
  // 更新会议
  if (meetingId && method === 'PUT' && !url.includes('/cancel') && !url.includes('/reject')) {
    return mockData.meetingAPI.updateMeeting(meetingId, data);
  }
  
  // 取消会议
  if (meetingId && url.includes('/cancel') && method === 'PUT') {
    return mockData.meetingAPI.cancelMeeting(meetingId, data.reason);
  }
  
  // 拒绝参与会议
  if (meetingId && url.includes('/reject') && method === 'PUT') {
    return mockData.meetingAPI.rejectParticipation(meetingId);
  }
  
  if (url.includes('/api/meetings') && url.includes('/minutes') && method === 'GET') {
    const meetingId = extractIdFromUrl(url, '/api/meetings/{id}/minutes');
    return mockData.meetingAPI.generateMeetingMinutes(meetingId);
  }
  
  // 会议室相关接口
  if (url === '/api/rooms' && method === 'GET') {
    return mockData.roomAPI.getRoomList(data);
  }
  
  const roomId = extractIdFromUrl(url, '/api/rooms/{id}');
  if (roomId && method === 'GET') {
    return mockData.roomAPI.getRoomById(roomId);
  }
  
  if (url.includes('/api/rooms') && url.includes('/available') && method === 'GET') {
    const roomId = extractIdFromUrl(url, '/api/rooms/{id}/available');
    return mockData.roomAPI.getRoomAvailableTime(roomId, data.date);
  }
  
  // 如果没有匹配的模拟处理器，返回null
  return null;
};

// 统一请求方法
const request = (options) => {
  // 打印请求信息
  console.log('[API请求]', options.method || 'GET', options.url, options.data || '');
  
  // 处理模拟数据
  const mockResponse = processMockRequest(options.url, options.method || 'GET', options.data || {}, options);
  if (mockResponse) {
    console.log('[MOCK] 使用模拟数据响应:', mockResponse);
    return Promise.resolve(mockResponse);
  }
  
  // 如果没有mock数据处理器但启用了模拟模式，生成默认响应
  if (USE_MOCK) {
    console.log('[MOCK] 没有匹配的处理器，返回默认成功响应');
    return Promise.resolve({
      code: 200,
      message: '操作成功',
      data: options.method === 'GET' ? [] : { success: true, id: 'mock-' + Date.now() }
    });
  }
  
  const newConfig = requestInterceptor(options);
  
  // 确保BASE_URL不为空且是有效的URL
  let baseUrl = BASE_URL || 'http://localhost:3000';
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = 'http://localhost:3000';
  }
  
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseUrl}${newConfig.url}`,
      method: newConfig.method || 'GET',
      data: newConfig.data,
      header: newConfig.header || {},
      success: (res) => {
        try {
          const result = responseInterceptor(res);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      fail: (err) => {
        console.error(`[API] 请求失败: ${newConfig.url}`, err);
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

// 封装GET请求
const get = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  });
};

// 封装POST请求
const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
};

// 封装PUT请求
const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
};

// 封装DELETE请求
const del = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  });
};

// 导出方法
export { get, post, put, del };

// 导出类型和模型
export { Types, Models }; 