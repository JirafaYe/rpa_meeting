<template>
  <view class="user-info-container">
    <view class="header">
      <text class="title">个人资料</text>
    </view>
    
    <!-- 用户信息表单 -->
    <view class="form-section">
      <view class="form-item">
        <text class="form-label">头像</text>
        <view class="avatar-wrapper">
          <image class="avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'"></image>
          <text class="avatar-edit" @click="chooseAvatar">更换头像</text>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input class="form-input" type="text" v-model="userInfo.name" placeholder="请输入姓名" />
      </view>
      
      <view class="form-item">
        <text class="form-label">用户名</text>
        <input class="form-input" type="text" v-model="userInfo.username" placeholder="请输入用户名" disabled />
      </view>
      
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input class="form-input" type="number" v-model="userInfo.phone" placeholder="请输入手机号" />
      </view>
      
      <view class="form-item">
        <text class="form-label">邮箱</text>
        <input class="form-input" type="text" v-model="userInfo.email" placeholder="请输入邮箱" />
      </view>
      
      <view class="form-item">
        <text class="form-label">部门</text>
        <picker 
          class="form-picker" 
          mode="selector" 
          :range="departments" 
          range-key="name"
          :value="departmentIndex" 
          @change="handleDepartmentChange"
        >
          <view class="picker-value">{{ departments[departmentIndex].name }}</view>
        </picker>
      </view>
      
      <view class="form-item">
        <text class="form-label">职位</text>
        <input class="form-input" type="text" v-model="userInfo.position" placeholder="请输入职位" />
      </view>
    </view>
    
    <button class="save-btn" @click="saveProfile">保存</button>
  </view>
</template>

<script>
import api from '../../utils/api.js'

export default {
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
      // 根据用户部门初始化部门选择器索引
      const index = this.departments.findIndex(item => item.name === this.userInfo.department);
      this.departmentIndex = index >= 0 ? index : 0;
    },
    
    handleDepartmentChange(e) {
      this.departmentIndex = e.detail.value;
      this.userInfo.department = this.departments[this.departmentIndex].name;
    },
    
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          // 这里可以添加上传头像图片的逻辑
          // 更新用户头像
          this.userInfo.avatar = tempFilePath;
          
          uni.showToast({
            title: '头像已更新',
            icon: 'success'
          });
        }
      });
    },
    
    saveProfile() {
      // 表单验证
      if (!this.userInfo.name) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
        return;
      }
      
      if (!this.userInfo.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return;
      }
      
      // 手机号验证
      if (!/^1\d{10}$/.test(this.userInfo.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      if (!this.userInfo.email) {
        uni.showToast({
          title: '请输入邮箱',
          icon: 'none'
        });
        return;
      }
      
      // 邮箱验证
      if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(this.userInfo.email)) {
        uni.showToast({
          title: '请输入正确的邮箱',
          icon: 'none'
        });
        return;
      }
      
      // 更新用户信息
      uni.showLoading({
        title: '保存中...'
      });
      
      this.loading = true;
      
      api.user.updateInfo(this.userInfo)
        .then(res => {
          if (res.code === 200) {
            uni.showToast({
              title: '保存成功',
              icon: 'success'
            });
            
            // 返回上一页
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            uni.showToast({
              title: res.message || '保存失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('保存用户信息失败:', err);
          uni.showToast({
            title: '保存失败',
            icon: 'none'
          });
        })
        .finally(() => {
          uni.hideLoading();
          this.loading = false;
        });
    }
  }
}
</script>

<style>
.user-info-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.form-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.form-input {
  width: 100%;
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0 15px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-picker {
  width: 100%;
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

.picker-value {
  height: 44px;
  line-height: 44px;
  padding: 0 15px;
  font-size: 14px;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
}

.avatar-edit {
  color: #3498db;
  font-size: 14px;
}

.save-btn {
  width: 100%;
  height: 44px;
  background-color: #3498db;
  color: #fff;
  border-radius: 6px;
  font-size: 16px;
}
</style> 