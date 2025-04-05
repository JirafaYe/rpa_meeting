<template>
  <view class="user-info-container">
    <!-- 面包屑导航 -->
    <view class="breadcrumb">
      <text class="breadcrumb-item" @click="navigateBack">我的</text>
      <text class="breadcrumb-separator">/</text>
      <text class="breadcrumb-item current">个人资料</text>
    </view>
    
    <!-- 用户信息表单 -->
    <view class="form-section">
      <view class="section-title">基本信息</view>
      
      <view class="feature-unavailable">
        <text class="unavailable-text">个人资料修改功能暂未开发，敬请期待</text>
      </view>
      
      <view class="form-item">
        <text class="form-label">头像</text>
        <view class="avatar-wrapper">
          <image class="avatar" :src="userInfo.avatarUrl || '/static/logo.png'"></image>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input class="form-input" type="text" v-model="userInfo.name" placeholder="请输入姓名" disabled />
      </view>
      
      <view class="form-item">
        <text class="form-label">用户名</text>
        <input class="form-input" type="text" v-model="userInfo.username" placeholder="请输入用户名" disabled />
      </view>
      
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input class="form-input" type="number" v-model="userInfo.phone" placeholder="请输入手机号" disabled />
      </view>
      
      <view class="form-item">
        <text class="form-label">邮箱</text>
        <input class="form-input" type="text" v-model="userInfo.email" placeholder="请输入邮箱" disabled />
      </view>
      
      <view class="form-item">
        <text class="form-label">职位</text>
        <input class="form-input" type="text" v-model="userInfo.position" placeholder="请输入职位" disabled />
      </view>
    </view>
    
    <!-- 安全信息区域 -->
    <view class="form-section">
      <view class="section-title">安全设置</view>
      
      <!-- 移除密码相关内容 -->
    </view>
    
    <button class="save-btn disabled" disabled @click="showUnavailableMessage">保存</button>
    
    <!-- 移除修改密码弹窗 -->
  </view>
</template>

<script>
import api from '../../api/index'

export default {
  data() {
    return {
      userInfo: {
        id: '',
        name: '',
        username: '',
        phone: '',
        email: '',
        position: '',
        avatarUrl: '',
        isActive: 0
      },
      loading: false
    };
  },
  mounted() {
    this.fetchUserInfo();
  },
  methods: {
    fetchUserInfo() {
      // 从API获取用户信息
      uni.showLoading({
        title: '加载中...'
      });
      
      this.loading = true;
      api.user.getInfo()
        .then(res => {
          if (res.code === 200 && res.data) {
            console.log('API返回的用户信息:', res.data);
            
            // 正确映射API返回的结构 - 根据LoginUser模型
            const apiData = res.data;
            this.userInfo = {
              id: apiData.id || 0,
              name: apiData.username || '',
              username: apiData.username || '',
              avatarUrl: apiData.avatarUrl || '',
              phone: apiData.phone || '',
              email: apiData.email || '',
              position: apiData.roles && apiData.roles.length > 0 ? apiData.roles[0].name : '',
              isActive: apiData.isActive || 0
            };
            
            console.log('解析后的用户信息:', this.userInfo);
          } else {
            uni.showToast({
              title: res.message || '获取用户信息失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取用户信息失败:', err);
          uni.showToast({
            title: '获取用户信息失败',
            icon: 'none'
          });
        })
        .finally(() => {
          uni.hideLoading();
          this.loading = false;
        });
    },
    
    navigateBack() {
      uni.navigateBack();
    },
    
    showUnavailableMessage() {
      uni.showToast({
        title: '功能暂未开发，敬请期待',
        icon: 'none'
      });
    }
  }
}
</script>

<style>
.user-info-container {
  padding: 20rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 面包屑导航样式 */
.breadcrumb {
  display: flex;
  align-items: center;
  padding: 20rpx 10rpx;
  margin-bottom: 30rpx;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
}

.breadcrumb-item {
  font-size: 26rpx;
  color: #3498db;
}

.breadcrumb-item.current {
  color: #333;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 10rpx;
  color: #ccc;
}

.form-section {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding-left: 15rpx;
  border-left: 6rpx solid #3498db;
}

.form-item {
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
}

.form-label {
  width: 150rpx;
  font-size: 28rpx;
  color: #666;
}

.form-input {
  flex: 1;
  height: 80rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background-color: #f9f9f9;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  border: 1rpx solid #e0e0e0;
}

.feature-unavailable {
  background-color: #fff8e6;
  border: 1px solid #ffe7ba;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unavailable-text {
  color: #fa8c16;
  font-size: 28rpx;
}

.save-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #3498db;
  color: white;
  font-size: 30rpx;
  border-radius: 45rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 12rpx rgba(52, 152, 219, 0.3);
  margin-top: 40rpx;
}

.save-btn.disabled {
  background-color: #cccccc;
  box-shadow: none;
  color: #ffffff;
}

/* 移除密码相关样式 */
</style> 