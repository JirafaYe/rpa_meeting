<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="login-logo">
          <img src="/static/logo.png" alt="Logo" />
        </div>
        <div class="login-title">
          <h1>会议室预约系统</h1>
          <p>管理员登录</p>
        </div>
      </div>
      <div class="login-form">
        <div class="input-group">
          <div class="input-icon">
            <text class="iconfont icon-user"></text>
          </div>
          <input
            type="text"
            class="input-field"
            placeholder="用户名"
            v-model="username"
            @keyup.enter="handleLogin"
          />
        </div>
        <div class="input-group">
          <div class="input-icon">
            <text class="iconfont icon-password"></text>
          </div>
          <input
            :type="showPassword ? 'text' : 'password'"
            class="input-field"
            placeholder="密码"
            v-model="password"
            @keyup.enter="handleLogin"
          />
          <div class="password-toggle" @click="showPassword = !showPassword">
            <text class="iconfont" :class="showPassword ? 'icon-view' : 'icon-close'"></text>
          </div>
        </div>
        <div class="login-options">
          <label class="remember-me">
            <input 
              type="checkbox" 
              :checked="rememberMe" 
              @click="handleRememberMe"
            />
            <span>记住我</span>
          </label>
          <a href="#" class="forgot-password">忘记密码?</a>
        </div>
        <button class="login-button" @click="handleLogin" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        
        <div class="quick-login-section">
          <div class="divider">
            <span>或</span>
          </div>
          <button class="quick-login-button" @click="quickLogin" :disabled="loading">
            一键登录
          </button>
        </div>
      </div>
    </div>
    <div class="login-footer">
      <p>© 2023 会议室预约系统 - 版权所有</p>
    </div>
    <div class="login-overlay" v-if="loading">
      <div class="login-spinner"></div>
    </div>
  </div>
</template>

<script>
import api from '../../api/index'

export default {
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false,
      showPassword: false,
      isSubmitting: false,
      loading: false
    }
  },
  created() {
    // 检查是否有保存的用户名密码
    const savedUsername = localStorage.getItem('adminUsername');
    const savedRememberMe = localStorage.getItem('adminRememberMe') === 'true';
    
    if (savedUsername && savedRememberMe) {
      this.username = savedUsername;
      this.rememberMe = true;
    }
  },
  mounted() {
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
    
    // 添加键盘事件监听
    this.handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        this.handleLogin();
      }
    };
    
    document.addEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    handleLogin() {
      if (!this.username) {
        this.showToast('请输入用户名');
        return;
      }
      
      if (!this.password) {
        this.showToast('请输入密码');
        return;
      }
      
      // 防止重复提交
      if (this.isSubmitting) {
        return;
      }
      
      this.isSubmitting = true;
      
      // 显示加载中
      uni.showLoading({
        title: '登录中...'
      });
      
      // 调用实际的登录接口
      api.user.login({
        username: this.username,
        password: this.password,
        role: 'admin'
      })
        .then(res => {
          uni.hideLoading();
          
          if (res.code === 200 && res.data) {
            // 检查用户状态
            const userData = res.data;
            const isActive = userData.user?.isActive || userData.isActive;
            
            if (isActive === 0) {
              // 用户被禁用
              this.isSubmitting = false;
              this.showToast('您的账号已被禁用，请联系超级管理员', 'none', 3000);
              return;
            }
            
            // 用户状态正常，保存登录状态
            uni.setStorageSync('token', res.data.token);
            uni.setStorageSync('userInfo', res.data.userInfo || {
              id: res.data.id,
              username: res.data.username,
              name: res.data.name,
              role: 'admin'
            });
            
            // 如果勾选了"记住我"，保存用户名
            if (this.rememberMe) {
              localStorage.setItem('adminUsername', this.username);
              localStorage.setItem('adminRememberMe', 'true');
            } else {
              localStorage.removeItem('adminUsername');
              localStorage.removeItem('adminRememberMe');
            }
            
            this.showToast('登录成功', 'success');
            
            // 延迟跳转
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/admin/home'
              });
            }, 1000);
          } else {
            this.isSubmitting = false;
            this.showToast(res.message || '用户名或密码错误');
          }
        })
        .catch(err => {
          uni.hideLoading();
          this.isSubmitting = false;
          this.showToast('登录失败，请稍后重试');
        });
    },
    showToast(title, icon = 'none', duration = 2000) {
      uni.showToast({
        title,
        icon,
        duration
      });
    },
    handleRememberMe() {
      this.rememberMe = !this.rememberMe;
    },
    quickLogin() {
      // 实现一键登录逻辑
      this.username = 'testJJ01';
      this.password = 'testJJ01';
      this.handleLogin();
    }
  },
  beforeDestroy() {
    // 移除键盘事件监听器
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  z-index: 1;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  z-index: 2;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  padding: 30px 30px 20px;
  text-align: center;
  background: linear-gradient(to right, #f5f7fa, #f9fcff);
  border-bottom: 1px solid #f0f0f0;
}

.login-logo {
  margin-bottom: 15px;
}

.login-logo img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.login-title h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.login-title p {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.login-form {
  padding: 30px;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.input-icon .iconfont {
  font-size: 20px;
  color: #8c8c8c;
}

.input-field {
  width: 100%;
  height: 50px;
  padding: 10px 15px 10px 45px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 16px;
  color: #1a1a1a;
  background-color: #f9fafb;
  transition: all 0.3s;
  box-sizing: border-box;
  -webkit-appearance: none; /* 移除Safari和iOS上的默认样式 */
  appearance: none;
}

.input-field:focus {
  outline: none;
  border-color: #1890ff;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.input-field::placeholder {
  color: #bfbfbf;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
  color: #595959;
  cursor: pointer;
}

.remember-me input {
  margin-right: 6px;
}

.forgot-password {
  color: #1890ff;
  text-decoration: none;
  transition: all 0.3s;
}

.forgot-password:hover {
  color: #40a9ff;
  text-decoration: underline;
}

.login-button {
  width: 100%;
  height: 50px;
  background: linear-gradient(90deg, #1890ff, #096dd9);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-button:hover {
  background: linear-gradient(90deg, #40a9ff, #1890ff);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transform: translateY(-2px);
}

.login-button:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.login-footer {
  margin-top: 40px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.login-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .login-card {
    max-width: 100%;
    margin: 0 10px;
  }
  
  .login-header {
    padding: 20px 20px 15px;
  }
  
  .login-form {
    padding: 20px;
  }
  
  .login-logo img {
    width: 60px;
    height: 60px;
  }
  
  .login-title h1 {
    font-size: 20px;
  }
  
  .input-field {
    font-size: 14px;
    height: 45px;
  }
  
  .login-button {
    height: 45px;
    font-size: 15px;
  }
}

.quick-login-section {
  margin-top: 20px;
  text-align: center;
}

.divider {
  display: flex;
  align-items: center;
  margin: 15px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e8e8e8;
}

.divider span {
  padding: 0 10px;
  color: #8c8c8c;
  font-size: 14px;
}

.quick-login-button {
  width: 100%;
  height: 45px;
  background: linear-gradient(90deg, #52c41a, #389e0d);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-login-button:hover {
  background: linear-gradient(90deg, #73d13d, #52c41a);
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
  transform: translateY(-2px);
}

.quick-login-button:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #8c8c8c;
  z-index: 1;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #1890ff;
}
</style> 