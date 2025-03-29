// 模拟通知数据
const generateNotifications = (count = 10) => {
  const notifications = [];
  const now = new Date();
  
  const types = ['meeting_invite', 'meeting_canceled', 'meeting_updated', 'meeting_reminder', 'system_notice'];
  const titles = {
    'meeting_invite': '会议邀请',
    'meeting_canceled': '会议取消',
    'meeting_updated': '会议更新',
    'meeting_reminder': '会议提醒',
    'system_notice': '系统通知'
  };
  
  const contents = {
    'meeting_invite': '您收到了一个新的会议邀请，请查看并确认。',
    'meeting_canceled': '您参与的会议已被取消。',
    'meeting_updated': '您参与的会议信息已更新，请查看最新详情。',
    'meeting_reminder': '您有一个会议即将开始，请准时参加。',
    'system_notice': '系统维护通知：系统将于本周六凌晨2点至4点进行例行维护。'
  };
  
  for (let i = 1; i <= count; i++) {
    // 生成时间（过去7天内）
    const createdAt = new Date(now);
    createdAt.setDate(now.getDate() - Math.floor(Math.random() * 7));
    createdAt.setHours(now.getHours() - Math.floor(Math.random() * 24));
    
    // 随机选择通知类型
    const type = types[Math.floor(Math.random() * types.length)];
    
    // 创建通知对象
    const notification = {
      id: String(i),
      type,
      title: titles[type],
      content: contents[type],
      isRead: Math.random() > 0.5,
      createdAt: createdAt.toISOString().replace('T', ' ').split('.')[0],
      relatedId: type.includes('meeting') ? String(Math.floor(Math.random() * 20) + 1) : null
    };
    
    notifications.push(notification);
  }
  
  return notifications;
};

// 生成通知数据
export const notifications = generateNotifications();

// 获取通知列表
export function getNotificationList(params = {}) {
  const { page = 1, limit = 10, isRead } = params;
  
  let filteredNotifications = [...notifications];
  
  // 根据已读状态过滤
  if (isRead !== undefined) {
    filteredNotifications = filteredNotifications.filter(n => n.isRead === isRead);
  }
  
  // 分页
  const start = (page - 1) * limit;
  const end = start + Number(limit);
  const paginatedNotifications = filteredNotifications.slice(start, end);
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      total: filteredNotifications.length,
      list: paginatedNotifications,
      unreadCount: notifications.filter(n => !n.isRead).length
    }
  };
}

// 标记通知为已读
export function markAsRead(id) {
  const notification = notifications.find(n => n.id === id);
  if (!notification) {
    return {
      code: 404,
      message: '通知不存在',
      data: null
    };
  }
  
  notification.isRead = true;
  
  return {
    code: 200,
    message: '标记成功',
    data: notification
  };
}

// 标记所有通知为已读
export function markAllAsRead() {
  notifications.forEach(n => {
    n.isRead = true;
  });
  
  return {
    code: 200,
    message: '标记成功',
    data: null
  };
} 