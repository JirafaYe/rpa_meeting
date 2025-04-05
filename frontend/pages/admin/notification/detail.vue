<template>
  <admin-layout 
    title="通知详情" 
    description="查看用户通知详情"
    active-path="/pages/admin/notification/index"
    :breadcrumb="[
      { title: '首页', path: '/pages/admin/home' },
      { title: sourceTitle, path: sourcePath },
      { title: '通知详情' }
    ]">
    <!-- 通知详情内容 -->
    <view class="notification-detail">
      <view class="detail-header">
        <view class="user-info">
          <text class="label">用户：</text>
          <text class="value">{{ username }}</text>
        </view>
        <view class="notification-count">
          <text class="label">未读通知：</text>
          <text class="value">{{ unreadCount }}</text>
        </view>
      </view>
      
      <view class="notification-list">
        <view v-if="notifications.length === 0" class="empty-notification">
          暂无通知
        </view>
        <view v-else class="notification-items">
          <view 
            v-for="(item, index) in notifications" 
            :key="index" 
            class="notification-item"
            :class="{ 'unread': !item.read }"
            @click="handleReadNotification(item)"
          >
            <view class="notification-icon">
              <text class="iconfont" :class="item.icon || 'icon-notification'"></text>
            </view>
            <view class="notification-content">
              <view class="notification-title">{{ item.title }}</view>
              <view class="notification-message">{{ item.message }}</view>
              <view class="notification-time">{{ item.time }}</view>
            </view>
            <view class="notification-status">
              <text v-if="!item.read" class="unread-badge">未读</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 分页 -->
      <view class="pagination" v-if="showPagination">
        <button 
          class="btn-page" 
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          <text class="iconfont icon-arrow-left"></text>
          上一页
        </button>
        <text class="page-info">第 {{ currentPage }} 页</text>
        <button 
          class="btn-page" 
          :disabled="!hasMore"
          @click="handlePageChange(currentPage + 1)"
        >
          下一页
          <text class="iconfont icon-arrow-right"></text>
        </button>
      </view>
    </view>
  </admin-layout>
</template>

<script>
import api from '@/api/index.js';
import AdminLayout from '@/components/admin/AdminLayout.vue';

export default {
  components: {
    AdminLayout
  },
  data() {
    return {
      userId: '',
      username: '',
      notifications: [],
      unreadCount: 0,
      currentPage: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      sourcePath: '/pages/admin/user/list',
      sourceTitle: '用户管理',
      showPagination: true
    };
  },
  onLoad(options) {
    if (options.id ) {
      this.userId = options.id;
      // this.username = decodeURIComponent(options.username);
      
      // 判断来源页面
      if (options.from === 'notification') {
        this.sourcePath = '/pages/admin/notification/index';
        this.sourceTitle = '通知中心';
      } else {
        this.sourcePath = '/pages/admin/user/list';
        this.sourceTitle = '用户管理';
      }
      
      this.loadNotifications();
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  methods: {
    navigateTo(url) {
      uni.navigateTo({ url });
    },
    async loadNotifications() {
      this.loading = true;
      try {
        const res = await api.notify.getNotifyList({
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          userId: this.userId
        });
        console.log(this.userId)
        
        if (res.data?.code === 200 && Array.isArray(res.data?.data?.records)) {
          // 将后端返回的通知数据转换为前端需要的格式
          this.notifications = res.data.data.records.map(notifyData => ({
            id: notifyData.id,
            title: notifyData.title || '系统通知',
            message: notifyData.content,
            time: notifyData.createTime,
            read: notifyData.status === 'read',
            icon: this.getNotificationIcon(notifyData.notifyType),
            sender: notifyData.sender,
            type: notifyData.notifyType
          }));
          
          // 计算未读通知数量
          this.unreadCount = this.notifications.filter(item => !item.read).length;
          // 设置分页
          this.hasMore = this.notifications.length === this.pageSize;
          // 显示分页组件
          this.showPagination = true;
        } else {
          this.notifications = [];
          this.unreadCount = 0;
          this.hasMore = false;
          this.showPagination = false;
          uni.showToast({
            title: res.data?.msg || '获取通知失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取通知失败:', error);
        this.notifications = [];
        this.unreadCount = 0;
        this.hasMore = false;
        this.showPagination = false;
        uni.showToast({
          title: '获取通知失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    // 根据通知类型获取对应的图标
    getNotificationIcon(type) {
      const iconMap = {
        1: 'icon-calendar', // 会议通知
        2: 'icon-system',   // 系统通知
        3: 'icon-user',     // 用户通知
        4: 'icon-room'      // 会议室通知
      };
      return iconMap[type] || 'icon-notification';
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.loadNotifications();
    },
    async handleReadNotification(notification) {
      if (notification.read) return;
      
      try {
        const res = await api.notify.markAsRead(notification.id);
        if (res.data?.code === 200) {
          notification.read = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        } else {
          uni.showToast({
            title: res.data?.msg || '标记已读失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('标记已读失败:', error);
        uni.showToast({
          title: '标记已读失败',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style>
/* 删除面包屑相关样式 */
.notification-detail {
  padding: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.user-info, .notification-count {
  display: flex;
  align-items: center;
}

.label {
  color: #666;
  margin-right: 8px;
}

.value {
  color: #333;
  font-weight: 500;
}

.notification-list {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.empty-notification {
  padding: 40px;
  text-align: center;
  color: #999;
}

.notification-items {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: #f9f9f9;
}

.notification-item.unread {
  background-color: #f0f7ff;
}

.notification-icon {
  margin-right: 15px;
  color: #3498db;
  font-size: 20px;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.notification-message {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.notification-time {
  color: #999;
  font-size: 12px;
}

.notification-status {
  margin-left: 15px;
}

.unread-badge {
  padding: 2px 8px;
  background-color: #e74c3c;
  color: #fff;
  border-radius: 10px;
  font-size: 12px;
}

/* 分页样式 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.btn-page {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.btn-page:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.btn-page .iconfont {
  margin: 0 4px;
  font-size: 12px;
}

.page-info {
  color: #666;
  font-size: 14px;
}
</style> 