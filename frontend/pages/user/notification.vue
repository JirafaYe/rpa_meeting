<template>
  <view class="notification-container">
    <view class="notification-header">
      <text class="title">通知消息</text>
      <view class="actions">
        <text class="action-btn clear-all" @click="clearAll">清空</text>
      </view>
    </view>
    
    <view class="tab-wrapper">
      <view class="tab-content">
        <scroll-view 
          scroll-y 
          class="notification-list" 
          @scrolltolower="loadMore" 
          refresher-enabled
          :refresher-triggered="isRefreshing"
          @refresherrefresh="onRefresh"
        >
          <view v-if="notifications.length > 0">
            <view 
              class="notification-item" 
              v-for="(notification, index) in notifications" 
              :key="index"
              @click="handleNotificationClick(notification)"
            >
              <view class="notification-type-indicator" :class="getIconClass(notification.type)"></view>
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
            <text class="empty-text">暂无通知消息</text>
          </view>
        </scroll-view>
      </view>
    </view>
    
    <!-- 添加自定义底部导航 -->
    <custom-tab-bar></custom-tab-bar>
  </view>
</template>

<script>
import api from '/api/index'
import CustomTabBar from '../../components/common/CustomTabBar.vue'

export default {
  components: {
    CustomTabBar
  },
  data() {
    return {
      notifications: [],
      isLoading: false,
      isRefreshing: false,
      page: 1,
      pageSize: 10,
      hasMore: false
    };
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
            // 确保res.data是数组，如果不是则使用空数组
            const notificationData = Array.isArray(res.data) ? res.data : 
                                    (res.data.list ? res.data.list : []);
            
            // 记录API返回的通知数据
            console.log('API返回的通知数据:', res.data);
            console.log('处理后的通知数据:', notificationData);
            
            // 确保每个通知都有id字段
            const processedData = notificationData.map(notification => {
              // 如果没有id字段，使用其他标识符作为id
              if (!notification.id && notification.notifyId) {
                notification.id = notification.notifyId;
              } else if (!notification.id) {
                // 生成临时ID（实际情况下应该从后端获取）
                notification.id = notification.title ? notification.title.trim() : Date.now().toString();
              }
              return notification;
            });
            
            if (isRefresh) {
              this.notifications = processedData;
            } else {
              this.notifications = [...this.notifications, ...processedData];
            }
            
            this.hasMore = notificationData.length >= this.pageSize;
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
      // 添加日志以便调试
      console.log('点击了通知:', notification);
      console.log('通知ID:', notification.id);
      
      if (!notification.id) {
        console.error('通知没有ID，无法跳转');
        uni.showToast({
          title: '无法查看通知详情',
          icon: 'none'
        });
        return;
      }
      
      // 尝试直接导航到通知详情页
      try {
        uni.navigateTo({
          url: `/pages/user/notification/detail?id=${notification.id}`,
          fail: (err) => {
            console.error('导航到通知详情页失败:', err);
            uni.showToast({
              title: '打开详情页失败',
              icon: 'none'
            });
          }
        });
      } catch (error) {
        console.error('导航异常:', error);
        uni.showToast({
          title: '系统错误',
          icon: 'none'
        });
      }
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
      if (this.notifications.length === 0) {
        uni.showToast({
          title: '没有可清空的消息',
          icon: 'none'
        });
        return;
      }
      
      uni.showModal({
        title: '确认操作',
        content: '确定要清空所有消息吗？',
        success: (res) => {
          if (res.confirm) {
            this.notifications = [];
            
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

.clear-all {
  color: #e74c3c;
}

.tab-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
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

.notification-type-indicator {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin-right: 12px;
  margin-top: 6px;
  flex-shrink: 0;
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

.icon-default {
  background-color: #3498db;
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