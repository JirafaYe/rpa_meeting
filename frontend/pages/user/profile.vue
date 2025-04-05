<template>
  <view class="profile-container">
    <!-- 个人信息卡片 -->
    <view class="profile-header">
      <view class="avatar-section">
        <image class="avatar" :src="userInfo.avatar || '/static/logo.png'" @click="chooseAvatar"></image>
        <text class="user-name">{{ userInfo.name || '用户名' }}</text>
      </view>
    </view>
    
    <!-- 用户信息项 -->
    <view class="menu-section">
      <view class="menu-item" @click="navigateToUserInfo">
        <view class="menu-left">
          <text class="menu-label">个人资料</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="showChangePassword">
        <view class="menu-left">
          <text class="menu-label">修改密码</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="navigateToSettings">
        <view class="menu-left">
          <text class="menu-label">系统设置</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="navigateToHelp">
        <view class="menu-left">
          <text class="menu-label">帮助中心</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="navigateToAbout">
        <view class="menu-left">
          <text class="menu-label">关于我们</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
    </view>
    
    <!-- 密码修改弹窗 -->
    <uni-popup ref="passwordPopup" type="center">
      <view class="password-form">
        <view class="password-form-title">修改密码</view>
        
        <view class="password-form-item">
          <text class="password-label">原密码</text>
          <input 
            class="password-input" 
            type="password" 
            v-model="passwordForm.oldPassword" 
            placeholder="请输入原密码" 
          />
        </view>
        
        <view class="password-form-item">
          <text class="password-label">新密码</text>
          <input 
            class="password-input" 
            type="password" 
            v-model="passwordForm.newPassword" 
            placeholder="请输入新密码" 
          />
        </view>
        
        <view class="password-form-item">
          <text class="password-label">确认密码</text>
          <input 
            class="password-input" 
            type="password" 
            v-model="passwordForm.confirmPassword" 
            placeholder="请再次输入新密码" 
          />
        </view>
        
        <view class="password-form-actions">
          <button class="cancel-btn" @click="hideChangePassword">取消</button>
          <button class="confirm-btn" @click="submitChangePassword">确认</button>
        </view>
      </view>
    </uni-popup>
    
    <!-- 底部按钮 -->
    <view class="button-group">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
    
    <!-- 底部导航栏 -->
    <custom-tab-bar></custom-tab-bar>
  </view>
</template>

<script>
import api from '../../api/index'
import CustomTabBar from '../../components/common/CustomTabBar.vue'

export default {
  components: {
    CustomTabBar
  },
  data() {
    return {
      userInfo: {
        id: '',
        name: '',
        username: '',
        phone: '',
        email: '',
        position: '',
        avatar: ''
      },
      loading: false,
      // 密码相关数据
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      showPasswordForm: false
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
      
      // 尝试从本地存储获取用户信息
      try {
        const userInfoStr = uni.getStorageSync('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          console.log('本地存储的用户信息:', userInfo);
          
          // 适配API返回的结构
          this.userInfo = {
            id: userInfo.id || userInfo.user?.id || '',
            name: userInfo.username || userInfo.user?.username || '',
            username: userInfo.username || userInfo.user?.username || '',
            avatar: userInfo.user?.avatarUrl || '',
            // 保留其他字段为空，因为API响应中没有这些数据
            phone: '',
            email: '',
            position: userInfo.roles?.[0]?.name || ''
          };
          console.log('解析后的用户信息:', this.userInfo);
        }
      } catch (e) {
        console.error('从本地存储获取用户信息失败:', e);
      }
      
      // 仍然调用API获取最新信息
      api.user.getInfo()
        .then(res => {
          if (res.code === 200 && res.data) {
            console.log('API返回的用户信息:', res.data);
            
            // 适配API返回的结构
            const apiData = res.data;
            this.userInfo = {
              id: apiData.id || apiData.user?.id || '',
              name: apiData.username || apiData.user?.username || '',
              username: apiData.username || apiData.user?.username || '',
              avatar: apiData.user?.avatarUrl || apiData.avatarUrl || '',
              phone: apiData.phone || '',
              email: apiData.email || '',
              position: apiData.roles?.[0]?.name || ''
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
    
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          // 获取图片临时路径
          const tempFilePath = res.tempFilePaths[0];
          
          // 裁剪处理（实际项目中可能需要）
          /* 
          uni.navigateTo({
            url: `/pages/common/image-cropper?src=${encodeURIComponent(tempFilePath)}&shape=circle`,
          });
          */
          
          // 简单示例直接设置
          this.userInfo.avatar = tempFilePath;
          
          // 实际应用中应该上传到服务器
          /* 
          uni.uploadFile({
            url: 'your-upload-api',
            filePath: tempFilePath,
            name: 'avatar',
            success: (uploadRes) => {
              const data = JSON.parse(uploadRes.data);
              this.userInfo.avatar = data.url;
            }
          });
          */
        }
      });
    },
    
    showChangePassword() {
      // 重置表单数据
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      // 显示弹窗
      this.$refs.passwordPopup.open();
    },
    
    hideChangePassword() {
      this.$refs.passwordPopup.close();
    },
    
    validatePasswordForm() {
      if (!this.passwordForm.oldPassword) {
        uni.showToast({
          title: '请输入原密码',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.passwordForm.newPassword) {
        uni.showToast({
          title: '请输入新密码',
          icon: 'none'
        });
        return false;
      }
      
      if (this.passwordForm.newPassword.length < 6) {
        uni.showToast({
          title: '新密码长度至少6位',
          icon: 'none'
        });
        return false;
      }
      
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        });
        return false;
      }
      
      return true;
    },
    
    submitChangePassword() {
      if (!this.validatePasswordForm()) {
        return;
      }
      
      uni.showLoading({
        title: '提交中...'
      });
      
      // 创建请求参数对象
      const passwordData = {
        oldPassword: this.passwordForm.oldPassword,
        newPassword: this.passwordForm.newPassword,
        confirmPassword: this.passwordForm.confirmPassword
      };
      
      // 调用API修改密码
      api.user.updatePassword(passwordData)
        .then(res => {
          if (res.code === 200) {
            uni.showToast({
              title: '密码修改成功',
              icon: 'success'
            });
            this.hideChangePassword();
          } else {
            uni.showToast({
              title: res.msg || '密码修改失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('修改密码失败:', err);
          uni.showToast({
            title: '密码修改失败',
            icon: 'none'
          });
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    
    validateForm() {
      if (!this.userInfo.name) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.userInfo.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return false;
      }
      
      if (!/^1\d{10}$/.test(this.userInfo.phone)) {
        uni.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.userInfo.email) {
        uni.showToast({
          title: '请输入邮箱',
          icon: 'none'
        });
        return false;
      }
      
      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(this.userInfo.email)) {
        uni.showToast({
          title: '邮箱格式不正确',
          icon: 'none'
        });
        return false;
      }
      
      return true;
    },
    
    saveProfile() {
      if (!this.validateForm()) {
        return;
      }
      
      uni.showLoading({
        title: '保存中...'
      });
      
      // 更新用户信息
      api.user.updateInfo(this.userInfo)
        .then(res => {
          if (res.code === 200) {
            uni.showToast({
              title: '保存成功',
              icon: 'success'
            });
          } else {
            uni.showToast({
              title: res.message || '保存失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('更新用户信息失败:', err);
          uni.showToast({
            title: '保存失败',
            icon: 'none'
          });
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除本地存储的用户信息和token
            uni.removeStorageSync('token');
            uni.removeStorageSync('userInfo');
            
            // 跳转到登录页
            uni.reLaunch({
              url: '/pages/user/login'
            });
          }
        }
      });
    },
    
    navigateToUserInfo() {
      uni.navigateTo({
        url: '/pages/user/userInfo'
      });
    },
    
    navigateToSettings() {
      uni.showToast({
        title: '系统设置功能开发中',
        icon: 'none'
      });
    },
    
    navigateToHelp() {
      uni.showToast({
        title: '帮助中心功能开发中',
        icon: 'none'
      });
    },
    
    navigateToAbout() {
      uni.showToast({
        title: '关于我们功能开发中',
        icon: 'none'
      });
    }
  }
};
</script>

<style>
.profile-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 120rpx;
}

.profile-header {
  background-color: #3498db;
  padding: 30rpx;
  border-bottom-left-radius: 20rpx;
  border-bottom-right-radius: 20rpx;
  margin-bottom: 20rpx;
}

.avatar-section {
  display: flex;
  align-items: center;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.8);
  margin-right: 20rpx;
}

.user-name {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: bold;
}

.menu-section {
  background-color: #ffffff;
  border-radius: 10rpx;
  margin: 0 20rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-label {
  font-size: 28rpx;
  color: #333;
}

.menu-arrow {
  color: #ccc;
  font-size: 28rpx;
}

.button-group {
  padding: 30rpx;
  margin-top: 30rpx;
}

.logout-btn {
  background-color: #ff6b6b;
  color: white;
  padding: 20rpx 0;
  border-radius: 10rpx;
  border: none;
  font-size: 28rpx;
}

/* 密码修改弹窗样式 */
.password-form {
  width: 260px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.password-form-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.password-form-item {
  margin-bottom: 15px;
}

.password-label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
}

.password-input {
  width: 90%;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.password-form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel-btn, .confirm-btn {
  width: 45%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
  margin: 0;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
}

.confirm-btn {
  background-color: #3498db;
  color: #fff;
}
</style> 