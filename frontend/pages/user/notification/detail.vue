<template>
  <view class="notification-detail-container">
    <view class="header">
      <view class="back-button" @click="goBack">
        <text class="iconfont icon-back">&#xe697;</text>
      </view>
      <view class="title">通知详情</view>
      <view class="right-placeholder"></view>
    </view>
    
    <view class="breadcrumb">
      <text class="breadcrumb-item" @click="navigateToNotification">
        <text class="iconfont icon-notification">&#xe729;</text> 通知消息
      </text>
      <text class="breadcrumb-separator">/</text>
      <text class="breadcrumb-item active">通知详情</text>
    </view>
    
    <view class="content-wrapper" v-if="notificationDetail">
      <view class="notification-header">
        <text class="notification-title">{{ notificationDetail.title }}</text>
        <text class="notification-time">{{ formatTime(notificationDetail.createTime) }}</text>
      </view>
      
      <view class="notification-meta">
        <view class="meta-item">
          <text class="meta-label">发送者：</text>
          <text class="meta-value">{{ notificationDetail.sender || '系统' }}</text>
        </view>
        <view class="meta-item">
          <text class="meta-label">类型：</text>
          <text class="meta-value">{{ getNotifyTypeText(notificationDetail.notifyType) }}</text>
        </view>
      </view>
      
      <view class="divider"></view>
      
      <view class="notification-content">
        <text class="content-text">{{ notificationDetail.content }}</text>
      </view>
      
      <view class="actions" v-if="notificationDetail.relatedId">
        <button class="action-button" @click="navigateToRelated">查看相关内容</button>
      </view>
    </view>
    
    <view class="loading" v-else-if="isLoading">
      <text>加载中...</text>
    </view>
    
    <view class="error-view" v-else>
      <text class="error-text">{{ errorMessage || '通知信息不存在' }}</text>
      <button class="action-button" @click="goBack">返回</button>
    </view>
  </view>
</template>

<script>
import api from '/api/index'

export default {
  data() {
    return {
      id: null,
      notificationDetail: null,
      isLoading: true,
      errorMessage: '',
      // 添加本地模拟数据
      mockData: {
        5: {
          id: 5,
          notifyType: 4,
          title: '[会前提醒]测试',
          content: '您的会议即将在15分钟后开始，请做好准备。',
          sender: '系统',
          createTime: new Date().toISOString()
        },
        6: {
          id: 6,
          notifyType: 4,
          title: '[会前提醒]测试',
          content: '您的会议即将在15分钟后开始，请做好准备。',
          sender: '系统',
          createTime: new Date().toISOString()
        }
      }
    }
  },
  onLoad(options) {
    console.log('通知详情页接收到的参数:', options);
    
    if (options.id) {
      this.id = options.id;
      console.log('将要获取的通知ID:', this.id);
      this.fetchNotificationDetail();
    } else {
      this.isLoading = false;
      this.errorMessage = '参数错误，未指定通知ID';
    }
  },
  methods: {
    fetchNotificationDetail() {
      this.isLoading = true;
      
      console.log('开始调用通知详情API, ID:', this.id);
      
      if (!this.id) {
        this.isLoading = false;
        this.errorMessage = '无效的通知ID';
        console.error('通知ID无效:', this.id);
        return;
      }
      
      // 使用API获取通知详情
      api.notification.getById(this.id)
        .then(res => {
          console.log('通知详情API返回:', res);
          
          if (res.code === 200 && res.data) {
            // 处理数据，确保所有必要字段都存在
            const notificationData = res.data;
            
            // 检查并设置必填字段的默认值
            this.notificationDetail = {
              title: notificationData.title || '未命名通知',
              content: notificationData.content || '无内容',
              sender: notificationData.sender || '系统',
              createTime: notificationData.createTime || new Date().toISOString(),
              notifyType: notificationData.notifyType || 0,
              relatedId: notificationData.relatedId || null,
              ...notificationData // 保留原始数据的其他字段
            };
            
            console.log('设置通知详情数据:', this.notificationDetail);
          } else {
            // API调用失败，尝试使用本地模拟数据
            if (this.mockData[this.id]) {
              console.log('使用本地模拟数据:', this.mockData[this.id]);
              this.notificationDetail = this.mockData[this.id];
              
              // 在真实环境中，你可能想显示一个提示，说明正在使用缓存数据
              uni.showToast({
                title: '使用本地缓存数据',
                icon: 'none',
                duration: 2000
              });
            } else {
              this.errorMessage = res.message || '获取通知详情失败';
              console.error('获取通知详情失败:', res.message);
            }
          }
        })
        .catch(err => {
          console.error('获取通知详情失败:', err);
          
          // 尝试使用本地模拟数据
          if (this.mockData[this.id]) {
            console.log('使用本地模拟数据:', this.mockData[this.id]);
            this.notificationDetail = this.mockData[this.id];
            
            uni.showToast({
              title: '使用本地缓存数据',
              icon: 'none',
              duration: 2000
            });
          } else {
            this.errorMessage = '获取通知详情失败';
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    formatTime(timestamp) {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    getNotifyTypeText(type) {
      // 通知类型对照表
      const typeMap = {
        0: '系统通知',
        1: '会议通知',
        2: '审批通知',
        3: '提醒',
        4: '取消通知'
      };
      
      return typeMap[type] || '其他通知';
    },
    navigateToRelated() {
      if (!this.notificationDetail.relatedId) return;
      
      // 根据通知类型跳转到相关页面
      switch(this.notificationDetail.notifyType) {
        case 1: // 会议通知
          uni.navigateTo({
            url: `/pages/user/meeting/detail?id=${this.notificationDetail.relatedId}`
          });
          break;
        case 2: // 审批通知
          uni.navigateTo({
            url: `/pages/user/approval/detail?id=${this.notificationDetail.relatedId}`
          });
          break;
        default:
          uni.showToast({
            title: '无法跳转相关内容',
            icon: 'none'
          });
      }
    },
    goBack() {
      uni.navigateBack();
    },
    navigateToNotification() {
      // 使用navigateBack回到通知列表页
      uni.navigateBack({
        delta: 1
      });
    }
  }
}
</script>

<style>
.notification-detail-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  background-color: #ffffff;
  border-bottom: 1px solid #eeeeee;
  padding: 0 15px;
}

.back-button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-back {
  font-size: 18px;
  color: #333333;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
}

.right-placeholder {
  width: 30px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eeeeee;
  font-size: 13px;
}

.breadcrumb-item {
  color: #666666;
  margin-right: 5px;
  display: flex;
  align-items: center;
}

.breadcrumb-item .iconfont {
  font-size: 14px;
  margin-right: 3px;
}

.breadcrumb-item.active {
  color: #3498db;
  font-weight: bold;
}

.breadcrumb-separator {
  color: #cccccc;
  margin: 0 5px;
}

.content-wrapper {
  flex: 1;
  padding: 20px 15px;
  background-color: #ffffff;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.notification-header {
  margin-bottom: 20px;
}

.notification-title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10px;
  display: block;
}

.notification-time {
  font-size: 12px;
  color: #999999;
  display: block;
}

.notification-meta {
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  margin-bottom: 8px;
}

.meta-label {
  color: #666666;
  font-size: 14px;
  width: 70px;
}

.meta-value {
  color: #333333;
  font-size: 14px;
  flex: 1;
}

.divider {
  height: 1px;
  background-color: #eeeeee;
  margin: 15px 0;
}

.notification-content {
  padding: 10px 0;
}

.content-text {
  font-size: 15px;
  color: #333333;
  line-height: 1.6;
}

.actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.action-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #999999;
}

.error-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
}

.error-text {
  color: #e74c3c;
  font-size: 15px;
  margin-bottom: 20px;
  text-align: center;
}
</style> 