import { get, post, put, del, Models } from './index'
import { getUserInfo, updateUserInfo, getUserList, changePasswordMock } from '../data/users';

// 用户登录
const login = (data) => {
  const loginRequest = Models.createLoginRequest(data.username, data.password);
  return post('/api/user/login', loginRequest).then(res => {
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

// 管理员登录
const adminLogin = (data) => {
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

// 获取用户信息
const getInfo = () => {
  // 使用模拟数据
  return Promise.resolve(getUserInfo()).then(res => {
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

// 更新用户信息
const updateInfo = (data) => {
  // 格式化请求数据
  const updateRequest = Models.createUserModifyRequest(data);
  
  // 使用模拟数据
  return Promise.resolve(updateUserInfo(updateRequest)).then(res => {
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
  // 使用模拟数据
  return Promise.resolve(changePasswordMock({
    oldPassword: data.oldPassword,
    newPassword: data.newPassword
  })).then(res => {
    return res;
  });
};

// 获取用户列表
const getList = (params) => {
  // 格式化请求参数
  const listRequest = Models.createUserListRequest(params);
  
  // 使用模拟数据
  return Promise.resolve(getUserList(listRequest)).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化分页数据
      const paginationData = Models.createPaginationData({
        total: res.data.total,
        list: res.data.list.map(user => Models.createUserInfo(user)),
        page: listRequest.page,
        limit: listRequest.limit
      });
      
      return {
        ...res,
        data: paginationData
      };
    }
    return res;
  });
};

// 创建用户
const createUser = (data) => {
  // 格式化请求数据
  const createRequest = Models.createUserModifyRequest(data);
  
  return post('/api/user/register', createRequest).then(res => {
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

// 更新用户
const updateUser = (id, data) => {
  // 格式化请求数据
  const updateRequest = Models.createUserModifyRequest(data);
  
  return put(`/api/user/update`, { id, ...updateRequest }).then(res => {
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

// 删除用户
const deleteUser = (id) => {
  return del(`/api/user/delete`, { id });
};

// 获取用户通知
const getNotifications = (params) => {
  // 格式化请求参数
  const notificationRequest = Models.createNotificationListRequest(params);
  
  return get('/api/notification/list', notificationRequest).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化分页数据
      const paginationData = Models.createPaginationData({
        total: res.data.total,
        list: res.data.list.map(notification => Models.createNotificationInfo(notification)),
        page: notificationRequest.page,
        limit: notificationRequest.limit
      });
      
      return {
        ...res,
        data: paginationData
      };
    }
    return res;
  });
};

// 标记通知为已读
const markNotificationAsRead = (id) => {
  return put(`/api/notification/read`, { id });
};

// 标记所有通知为已读
const markAllNotificationsAsRead = () => {
  return put('/api/notification/read-all');
};

// 获取部门列表
const getDepartments = () => {
  return get('/api/contact/departments').then(res => {
    if (res.code === 200 && res.data) {
      // 格式化响应数据
      return {
        ...res,
        data: res.data.map(dept => Models.createDepartment(dept))
      };
    }
    return res;
  });
};

export default {
  login,
  adminLogin,
  getInfo,
  updateInfo,
  changePassword,
  getList,
  createUser,
  updateUser,
  deleteUser,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getDepartments
}; 