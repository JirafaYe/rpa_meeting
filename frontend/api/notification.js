import { get, put, Models } from './index';
import { getNotificationList, markAsRead, markAllAsRead } from '../data/notifications';

// 获取通知列表
const getList = (params = {}) => {
  // 格式化请求参数
  const listRequest = Models.createNotificationListRequest(params);
  
  // 使用模拟数据
  return Promise.resolve(getNotificationList(listRequest)).then(res => {
    if (res.code === 200 && res.data) {
      // 确保res.data.list存在并且是数组
      const list = res.data.list || [];
      
      // 格式化分页数据
      const paginationData = {
        total: res.data.total || list.length,
        list: list.map(notification => Models.createNotificationInfo(notification)),
        page: listRequest.page,
        limit: listRequest.limit,
        unreadCount: res.data.unreadCount || 0
      };
      
      return {
        ...res,
        data: paginationData.list // 直接返回格式化后的通知数组
      };
    }
    return res;
  });
};

// 标记通知为已读
const markRead = (id) => {
  // 使用模拟数据
  return Promise.resolve(markAsRead(id)).then(res => {
    if (res.code === 200 && res.data) {
      // 格式化响应数据
      return {
        ...res,
        data: Models.createNotificationInfo(res.data)
      };
    }
    return res;
  });
};

// 标记所有通知为已读
const markAllRead = () => {
  // 使用模拟数据
  return Promise.resolve(markAllAsRead());
};

export default {
  getList,
  markRead,
  markAllRead
}; 