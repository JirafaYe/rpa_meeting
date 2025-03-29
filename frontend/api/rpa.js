import { get, post, put, del, Models } from './index'

// 获取RPA任务列表
const getRPATaskList = (params) => {
  return get('/api/rpa/tasks', params).then(res => {
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

// 获取RPA任务详情
const getRPATaskDetail = (id) => {
  return get(`/api/rpa/tasks/${id}`).then(res => {
    if (res.code === 200 && res.data) {
      return {
        ...res,
        data: {
          ...res.data,
          id: res.data.id || id
        }
      };
    }
    return res;
  });
};

// 创建RPA任务
const createRPATask = (data) => {
  return post('/api/rpa/tasks', data);
};

// 更新RPA任务
const updateRPATask = (id, data) => {
  return put(`/api/rpa/tasks/${id}`, data);
};

// 删除RPA任务
const deleteRPATask = (id) => {
  return del(`/api/rpa/tasks/${id}`);
};

// 执行RPA任务
const executeRPATask = (id) => {
  return post(`/api/rpa/tasks/${id}/execute`);
};

// 停止RPA任务
const stopRPATask = (id) => {
  return post(`/api/rpa/tasks/${id}/stop`);
};

// 获取RPA任务日志
const getRPATaskLogs = (id, params) => {
  return get(`/api/rpa/tasks/${id}/logs`, params);
};

// 获取RPA机器人列表
const getRPARobotList = (params) => {
  return get('/api/rpa/robots', params).then(res => {
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

// 获取RPA机器人详情
const getRPARobotDetail = (id) => {
  return get(`/api/rpa/robots/${id}`).then(res => {
    if (res.code === 200 && res.data) {
      return {
        ...res,
        data: {
          ...res.data,
          id: res.data.id || id
        }
      };
    }
    return res;
  });
};

// 添加RPA机器人
const createRPARobot = (data) => {
  return post('/api/rpa/robots', data);
};

// 更新RPA机器人
const updateRPARobot = (id, data) => {
  return put(`/api/rpa/robots/${id}`, data);
};

// 删除RPA机器人
const deleteRPARobot = (id) => {
  return del(`/api/rpa/robots/${id}`);
};

// 获取RPA配置
const getRpaConfig = (meetingId) => {
  return get(`/api/rpa/${meetingId}/config`).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化响应数据
      return {
        ...res,
        data: Models.createRpaConfig({
          ...res.data,
          meetingId
        })
      };
    }
    return res;
  });
};

// 更新RPA配置
const updateRpaConfig = (meetingId, data) => {
  // 格式化请求数据
  const config = Models.createRpaConfig({
    ...data,
    meetingId
  });
  
  return put(`/api/rpa/${meetingId}/config`, config).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化响应数据
      return {
        ...res,
        data: Models.createRpaConfig({
          ...res.data,
          meetingId
        })
      };
    }
    return res;
  });
};

// 获取RPA状态
const getRpaStatus = (meetingId) => {
  return get(`/api/rpa/${meetingId}/status`).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化响应数据
      return {
        ...res,
        data: Models.createRpaStatus({
          ...res.data,
          meetingId
        })
      };
    }
    return res;
  });
};

// 启动RPA
const startRpa = (meetingId) => {
  return post(`/api/rpa/${meetingId}/start`).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化响应数据
      return {
        ...res,
        data: Models.createRpaStatus({
          ...res.data,
          meetingId
        })
      };
    }
    return res;
  });
};

// 停止RPA
const stopRpa = (meetingId) => {
  return post(`/api/rpa/${meetingId}/stop`).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化响应数据
      return {
        ...res,
        data: Models.createRpaStatus({
          ...res.data,
          meetingId
        })
      };
    }
    return res;
  });
};

// 获取RPA 记录列表
const getRpaRecords = (params) => {
  return get('/api/rpa/records', params).then(res => {
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

// 删除RPA记录
const deleteRpaRecord = (id) => {
  return del(`/api/rpa/records/${id}`);
};

export default {
  getRPATaskList,
  getRPATaskDetail,
  createRPATask,
  updateRPATask,
  deleteRPATask,
  executeRPATask,
  stopRPATask,
  getRPATaskLogs,
  getRPARobotList,
  getRPARobotDetail,
  createRPARobot,
  updateRPARobot,
  deleteRPARobot,
  getRpaConfig,
  updateRpaConfig,
  getRpaStatus,
  startRpa,
  stopRpa,
  getRpaRecords,
  deleteRpaRecord
}; 