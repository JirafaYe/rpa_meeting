<template>
  <view class="notification-container">
    <view class="notification-header">
      <text class="title">通知消息</text>
      <view class="actions">
        <text class="action-btn read-all" @click="markAllAsRead">全部已读</text>
        <text class="action-btn clear-all" @click="clearAll">清空</text>
      </view>
    </view>
    
    <view class="tab-wrapper">
      <view class="tab-header">
        <view 
          class="tab-item" 
          :class="{ 'active': activeTab === 'all' }"
          @click="activeTab = 'all'"
        >
          全部 <text class="badge" v-if="allNotifications.length">{{ allNotifications.length }}</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ 'active': activeTab === 'unread' }"
          @click="activeTab = 'unread'"
        >
          未读 <text class="badge" v-if="unreadNotifications.length">{{ unreadNotifications.length }}</text>
        </view>
      </view>
      
      <view class="tab-content">
        <scroll-view 
          scroll-y 
          class="notification-list" 
          @scrolltolower="loadMore" 
          refresher-enabled
          :refresher-triggered="isRefreshing"
          @refresherrefresh="onRefresh"
        >
          <view v-if="currentNotifications.length > 0">
            <view 
              class="notification-item" 
              v-for="(notification, index) in currentNotifications" 
              :key="index"
              :class="{ 'unread': !notification.isRead }"
              @click="handleNotificationClick(notification)"
            >
              <view class="notification-icon" :class="getIconClass(notification.type)">
                <text class="icon-dot" v-if="!notification.isRead"></text>
              </view>
              <view class="notification-content">
                <view class="notification-title">{{ notification.title }}</view>
                <view class="notification-body">{{ notification.content }}</view>
                <view class="notification-meta">
                  <text class="notification-time">{{ formatTime(notification.createdAt) }}</text>
                  <text 
                    class="notification-delete" 
                    @click.stop="deleteNotification(notification.id)"
                  >
                    删除
                  </text>
                </view>
              </view>
            </view>
            
            <view class="load-more" v-if="hasMore">
              <text v-if="isLoading">加载中...</text>
              <text v-else @click="loadMore">加载更多</text>
            </view>
          </view>
          
          <view class="empty-view" v-else>
            <image class="empty-icon" src="/static/icons/empty-notification.png" mode="aspectFit"></image>
            <text class="empty-text">{{ activeTab === 'all' ? '暂无通知消息' : '暂无未读消息' }}</text>
          </view>
        </scroll-view>
      </view>
    </view>
    
    <!-- 添加自定义底部导航 -->
    <custom-tab-bar></custom-tab-bar>
  </view>
</template>

<script>
import api from '../../utils/api.js'
import CustomTabBar from '../../components/common/CustomTabBar.vue'

export default {
  components: {
    CustomTabBar
  },
  data() {
    return {
      activeTab: 'all',
      notifications: [],
      isLoading: false,
      isRefreshing: false,
      page: 1,
      pageSize: 10,
      hasMore: false
    };
  },
  computed: {
    allNotifications() {
      return this.notifications;
    },
    unreadNotifications() {
      return this.notifications.filter(notification => !notification.isRead);
    },
    currentNotifications() {
      return this.activeTab === 'all' ? this.allNotifications : this.unreadNotifications;
    }
  },
  onLoad() {
    // 加载通知数据
    this.fetchNotifications();
  },
  methods: {
    fetchNotifications(isRefresh = false) {
      if (isRefresh) {
        this.page = 1;
      }
      
      this.isLoading = true;
      
      api.notification.getList()
        .then(res => {
          if (res.code === 200 && res.data) {
            if (isRefresh) {
              this.notifications = res.data;
            } else {
              this.notifications = [...this.notifications, ...res.data];
            }
            
            this.hasMore = res.data.length >= this.pageSize;
          } else {
            uni.showToast({
              title: res.message || '获取通知失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取通知失败:', err);
          uni.showToast({
            title: '获取通知失败',
            icon: 'none'
          });
        })
        .finally(() => {
          this.isLoading = false;
          if (isRefresh) {
            this.isRefreshing = false;
          }
        });
    },
    formatTime(dateTime) {
      if (!dateTime) return '';
      
      const now = new Date();
      const diff = Math.floor((now - dateTime) / 1000); // 秒数差
      
      if (diff < 60) {
        return '刚刚';
      } else if (diff < 3600) {
        return Math.floor(diff / 60) + '分钟前';
      } else if (diff < 86400) {
        return Math.floor(diff / 3600) + '小时前';
      } else if (diff < 604800) {
        return Math.floor(diff / 86400) + '天前';
      } else {
        const year = dateTime.getFullYear();
        const month = dateTime.getMonth() + 1;
        const day = dateTime.getDate();
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
      }
    },
    getIconClass(type) {
      switch (type) {
        case 'approve':
          return 'icon-approve';
        case 'reject':
          return 'icon-reject';
        case 'reminder':
          return 'icon-reminder';
        case 'cancel':
          return 'icon-cancel';
        case 'system':
          return 'icon-system';
        default:
          return 'icon-default';
      }
    },
    handleNotificationClick(notification) {
      // 标记为已读
      if (!notification.isRead) {
        this.markAsRead(notification.id);
      }
      
      // 处理点击通知后的跳转逻辑
      if (notification.relatedType === 'meeting' && notification.relatedId) {
        uni.navigateTo({
          url: `/pages/user/meeting/detail?id=${notification.relatedId}`
        });
      }
    },
    markAsRead(id) {
      api.notification.markAsRead(id)
        .then(res => {
          if (res.code === 200) {
            // 更新本地通知状态
            const index = this.notifications.findIndex(item => item.id === id);
            if (index !== -1) {
              this.notifications[index].isRead = true;
              this.$forceUpdate();
            }
          }
        })
        .catch(err => {
          console.error('标记已读失败:', err);
        });
    },
    markAllAsRead() {
      if (this.unreadNotifications.length === 0) {
        uni.showToast({
          title: '没有未读消息',
          icon: 'none'
        });
        return;
      }
      
      uni.showModal({
        title: '确认操作',
        content: '确定将所有消息标记为已读？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '处理中...' });
            
            // 在实际应用中应该调用API批量标记已读
            // 这里简单模拟
            setTimeout(() => {
              this.notifications.forEach(item => {
                item.isRead = true;
              });
              
              uni.hideLoading();
              uni.showToast({
                title: '已全部标记为已读',
                icon: 'success'
              });
            }, 500);
          }
        }
      });
    },
    deleteNotification(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条通知吗？',
        success: (res) => {
          if (res.confirm) {
            // 在实际应用中应该调用API删除通知
            // 这里简单模拟
            const index = this.notifications.findIndex(item => item.id === id);
            if (index !== -1) {
              this.notifications.splice(index, 1);
              
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });
            }
          }
        }
      });
    },
    clearAll() {
      if (this.currentNotifications.length === 0) {
        uni.showToast({
          title: '没有可清空的消息',
          icon: 'none'
        });
        return;
      }
      
      uni.showModal({
        title: '确认操作',
        content: `确定要清空${this.activeTab === 'all' ? '所有' : '未读'}消息吗？`,
        success: (res) => {
          if (res.confirm) {
            // 在实际应用中应该调用API清空通知
            // 这里简单模拟
            if (this.activeTab === 'all') {
              this.notifications = [];
            } else {
              this.notifications = this.notifications.filter(item => item.isRead);
            }
            
            uni.showToast({
              title: '清空成功',
              icon: 'success'
            });
          }
        }
      });
    },
    loadMore() {
      if (!this.hasMore || this.isLoading) return;
      
      this.page++;
      this.fetchNotifications();
    },
    onRefresh() {
      this.isRefreshing = true;
      this.fetchNotifications(true);
    }
  }
};
</script>

<style>
.notification-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 50px;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.actions {
  display: flex;
}

.action-btn {
  font-size: 14px;
  color: #666;
  padding: 5px 10px;
  margin-left: 10px;
}

.read-all {
  color: #3498db;
}

.clear-all {
  color: #e74c3c;
}

.tab-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tab-header {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 15px;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #3498db;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background-color: #3498db;
  border-radius: 3px;
}

.badge {
  display: inline-block;
  background-color: #e74c3c;
  color: #fff;
  font-size: 12px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 9px;
  padding: 0 5px;
  margin-left: 5px;
}

.tab-content {
  flex: 1;
}

.notification-list {
  height: 100%;
}

.notification-item {
  display: flex;
  padding: 15px;
  background-color: #fff;
  margin-bottom: 1px;
  position: relative;
}

.notification-item.unread {
  background-color: #edf7ff;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #ddd;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.icon-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #e74c3c;
  border-radius: 4px;
  top: 2px;
  right: 2px;
}

.icon-approve {
  background-color: #2ecc71;
}

.icon-reject {
  background-color: #e74c3c;
}

.icon-reminder {
  background-color: #3498db;
}

.icon-cancel {
  background-color: #95a5a6;
}

.icon-system {
  background-color: #f39c12;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.notification-body {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.4;
}

.notification-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-time {
  font-size: 12px;
  color: #999;
}

.notification-delete {
  font-size: 12px;
  color: #999;
  padding: 5px;
}

.load-more {
  text-align: center;
  padding: 15px 0;
  color: #666;
  font-size: 14px;
}

.empty-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 15px;
}

.empty-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 16px;
  color: #999;
  text-align: center;
}
</style> 