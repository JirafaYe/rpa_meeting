<template>
  <view class="admin-login-container">
    <view class="login-card">
      <view class="login-header">
        <text class="header-title">管理员登录</text>
      </view>
      <view class="login-body">
        <view class="form-group">
          <text class="form-label">用户名</text>
          <input class="form-input" type="text" v-model="username" placeholder="请输入管理员用户名" />
        </view>
        
        <view class="form-group">
          <text class="form-label">密码</text>
          <input class="form-input" type="password" v-model="password" placeholder="请输入密码" password />
        </view>
        
        <button class="login-btn" @click="handleLogin">登录</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  onLoad() {
    // 检查平台，确保是H5平台访问
    // #ifdef APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
    // 如果是移动端平台访问管理员页面，重定向到用户登录
    console.log("检测到移动端平台访问管理员页面，将重定向到用户登录");
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/user/login'
      });
    }, 100);
    // #endif
  },
  methods: {
    handleLogin() {
      if (!this.username) {
        uni.showToast({
          title: '请输入用户名',
          icon: 'none'
        });
        return;
      }
      
      if (!this.password) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        });
        return;
      }
      
      // 模拟登录请求
      uni.showLoading({
        title: '登录中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 这里应该调用实际的登录接口
        // 模拟登录成功
        if (this.username === 'admin' && this.password === 'admin123') {
          uni.showToast({
            title: '登录成功',
            icon: 'success',
            success: () => {
              // 保存登录状态
              uni.setStorageSync('adminToken', 'admin-token-123');
              uni.setStorageSync('adminInfo', {
                id: 1,
                username: 'admin',
                name: '系统管理员'
              });
              
              // 延迟跳转
              setTimeout(() => {
                uni.redirectTo({
                  url: '/pages/admin/home'
                });
              }, 1500);
            }
          });
        } else {
          uni.showToast({
            title: '用户名或密码错误',
            icon: 'none'
          });
        }
      }, 1000);
    }
  }
}
</script>

<style>
.admin-login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-header {
  padding: 20px;
  background-color: #3498db;
  text-align: center;
}

.header-title {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.login-body {
  padding: 30px 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
  color: #333;
  font-weight: bold;
}

.form-input {
  width: 100%;
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 15px;
  background-color: #f9f9f9;
}

.login-btn {
  width: 100%;
  height: 44px;
  background-color: #3498db;
  color: #fff;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
}

.login-btn:active {
  background-color: #2980b9;
}
</style> 