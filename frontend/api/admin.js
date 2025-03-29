import { get, post, put, del, Models } from './index'

// 管理员登录
const login = (data) => {
  const loginRequest = Models.createLoginRequest(data.username, data.password);
  return post('/api/admin/login', loginRequest).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化响应数据
      return {
        ...res,
        data: Models.createLoginResponse(res.data)
      };
    }
    return res;
  });
};

// 获取管理员信息
const getAdminInfo = () => {
  return get('/api/admin/info').then(res => {
    if (res.code === 200 && res.data) {
      // 格式化响应数据
      return {
        ...res,
        data: Models.createUserInfo(res.data)
      };
    }
    return res;
  });
};

// 修改密码
const changePassword = (data) => {
  return put('/api/admin/password', data);
};

// 获取统计数据
const getStatistics = (params) => {
  return get('/api/admin/statistics', params);
};

// 获取会议统计
const getMeetingStatistics = (params) => {
  return get('/api/admin/statistics/meetings', params);
};

// 获取会议室使用统计
const getRoomUsageStatistics = (params) => {
  return get('/api/admin/statistics/rooms', params);
};

// 获取用户活跃度统计
const getUserActivityStatistics = (params) => {
  return get('/api/admin/statistics/users', params);
};

// 获取系统日志
const getSystemLogs = (params) => {
  return get('/api/admin/logs', params).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化分页数据
      const paginationData = Models.createPaginationData({
        total: res.data.total,
        list: res.data.list,
        page: params.page || 1,
        limit: params.limit || 10
      });
      
      return {
        ...res,
        data: paginationData
      };
    }
    return res;
  });
};

// 获取操作记录
const getOperationLogs = (params) => {
  return get('/api/admin/operations', params).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化分页数据
      const paginationData = Models.createPaginationData({
        total: res.data.total,
        list: res.data.list,
        page: params.page || 1,
        limit: params.limit || 10
      });
      
      return {
        ...res,
        data: paginationData
      };
    }
    return res;
  });
};

// 系统设置
const getSystemSettings = () => {
  return get('/api/admin/settings');
};

// 更新系统设置
const updateSystemSettings = (data) => {
  return put('/api/admin/settings', data);
};

export default {
  login,
  getAdminInfo,
  changePassword,
  getStatistics,
  getMeetingStatistics,
  getRoomUsageStatistics,
  getUserActivityStatistics,
  getSystemLogs,
  getOperationLogs,
  getSystemSettings,
  updateSystemSettings
}; 