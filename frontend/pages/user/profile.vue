<template>
  <view class="profile-container">
    <!-- 个人信息卡片 -->
    <view class="profile-card">
      <view class="avatar-section">
        <image class="avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'"></image>
        <view class="avatar-edit" @click="chooseAvatar">
          <text class="edit-icon">✏️</text>
        </view>
      </view>
      
      <view class="info-section">
        <view class="user-name">{{ userInfo.name }}</view>
        <view class="user-title">{{ userInfo.department }} | {{ userInfo.position }}</view>
      </view>
    </view>
    
    <!-- 用户信息项 -->
    <view class="menu-section">
      <view class="menu-item" @click="navigateToUserInfo">
        <view class="menu-left">
          <text class="menu-icon">👤</text>
          <text class="menu-label">个人资料</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="showChangePassword">
        <view class="menu-left">
          <text class="menu-icon">🔒</text>
          <text class="menu-label">修改密码</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="navigateToSettings">
        <view class="menu-left">
          <text class="menu-icon">⚙️</text>
          <text class="menu-label">系统设置</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="navigateToHelp">
        <view class="menu-left">
          <text class="menu-icon">❓</text>
          <text class="menu-label">帮助中心</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="navigateToAbout">
        <view class="menu-left">
          <text class="menu-icon">ℹ️</text>
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
      userInfo: {
        id: '',
        name: '',
        username: '',
        phone: '',
        email: '',
        department: '',
        position: '',
        avatar: ''
      },
      departments: [
        { id: 1, name: '研发部' },
        { id: 2, name: '市场部' },
        { id: 3, name: '销售部' },
        { id: 4, name: '人力资源部' },
        { id: 5, name: '财务部' },
        { id: 6, name: '行政部' }
      ],
      departmentIndex: 0,
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
      api.user.getInfo()
        .then(res => {
          if (res.code === 200 && res.data) {
            this.userInfo = res.data;
            // 初始化部门选择器的索引
            this.initDepartmentIndex();
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
    
    initDepartmentIndex() {
      // 初始化部门选择器的索引
      const index = this.departments.findIndex(item => item.name === this.userInfo.department);
      this.departmentIndex = index !== -1 ? index : 0;
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
    
    handleDepartmentChange(e) {
      this.departmentIndex = e.detail.value;
      this.userInfo.department = this.departments[this.departmentIndex].name;
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
        newPassword: this.passwordForm.newPassword
      };
      
      // 调用API修改密码
      api.user.changePassword(passwordData)
        .then(res => {
          if (res.code === 200) {
            uni.showToast({
              title: '密码修改成功',
              icon: 'success'
            });
            this.hideChangePassword();
          } else {
            uni.showToast({
              title: res.message || '密码修改失败',
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
      
      if (!this.userInfo.position) {
        uni.showToast({
          title: '请输入职位',
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
  padding-bottom: 100px;
}

.profile-card {
  background-color: #fff;
  padding: 30px 20px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-section {
  position: relative;
  margin-bottom: 15px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.avatar-edit {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 30px;
  height: 30px;
  background-color: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

.edit-icon {
  font-size: 16px;
  color: #fff;
}

.info-section {
  text-align: center;
}

.user-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.user-title {
  font-size: 14px;
  color: #666;
}

.form-section {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  margin: 0 15px 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  margin-bottom: 15px;
  position: relative;
  padding-left: 10px;
  border-left: 3px solid #3498db;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  width: 80px;
  font-size: 15px;
  color: #333;
}

.form-input {
  flex: 1;
  height: 24px;
  font-size: 15px;
}

.form-picker {
  flex: 1;
}

.picker-value {
  font-size: 15px;
  color: #333;
}

.action-item {
  justify-content: space-between;
}

.action-label {
  font-size: 15px;
  color: #333;
}

.action-arrow {
  color: #999;
  font-size: 16px;
}

.button-group {
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.save-btn {
  height: 45px;
  line-height: 45px;
  background-color: #3498db;
  color: #fff;
  font-size: 16px;
  margin-bottom: 15px;
}

.logout-btn {
  height: 45px;
  line-height: 45px;
  background-color: #f56c6c;
  color: #fff;
  font-size: 16px;
  border: 1px solid #f56c6c;
}

/* 密码修改弹窗样式 */
.password-form {
  width: 300px;
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
  width: 100%;
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

.menu-section {
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 0 15px;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 20px;
  margin-right: 10px;
  width: 24px;
  text-align: center;
}

.menu-label {
  font-size: 16px;
  color: #333;
}

.menu-arrow {
  color: #ccc;
  font-size: 18px;
}
</style> 