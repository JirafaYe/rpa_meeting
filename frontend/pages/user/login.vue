    <template>
  <view class="login-container">
    <view class="logo-area">
      <image class="logo-image" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">会议室预约系统</text>
    </view>
    
    <view class="form-tabs">
      <view :class="['tab-item', isLoginMode ? 'active' : '']" @click="switchToLogin">登录</view>
      <view :class="['tab-item', !isLoginMode ? 'active' : '']" @click="switchToRegister">注册</view>
    </view>
    
    <view class="login-form">
      <!-- 登录表单 -->
      <view v-if="isLoginMode">
        <view class="input-group">
          <text class="input-label">用户名</text>
          <input class="input-field" type="text" v-model="loginForm.username" placeholder="请输入用户名" />
        </view>
        
        <view class="input-group">
          <text class="input-label">密码</text>
          <input class="input-field" type="password" v-model="loginForm.password" placeholder="请输入密码" password />
        </view>
        
        <view class="input-group captcha-group">
          <text class="input-label">验证码</text>
          <view class="captcha-container">
            <input class="input-field captcha-input" type="text" v-model="loginForm.code" placeholder="请输入验证码" />
            <view class="captcha-wrapper" @click="refreshCaptcha">
              <image class="captcha-image" :src="captchaImageUrl" />
              <view class="refresh-icon">
                <text class="refresh-text">刷新</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="remember-row">
          <checkbox-group @change="rememberChange">
            <label class="remember-label">
              <checkbox :checked="rememberMe" />
              <text>记住密码</text>
            </label>
          </checkbox-group>
          <text class="forget-password" @click="navigateToForgetPassword">忘记密码?</text>
        </view>
        
        <button class="login-button" @click="handleLogin">登 录</button>
      </view>
      
      <!-- 注册表单 -->
      <view v-else>
        <view class="input-group">
          <text class="input-label">用户名</text>
          <input class="input-field" type="text" v-model="registerForm.username" placeholder="请输入用户名" />
        </view>
        
        <view class="input-group">
          <text class="input-label">密码</text>
          <input class="input-field" type="password" v-model="registerForm.password" placeholder="请输入密码" password />
        </view>
        
        <view class="input-group">
          <text class="input-label">确认密码</text>
          <input class="input-field" type="password" v-model="registerForm.confirmPassword" placeholder="请再次输入密码" password />
        </view>
        
        <view class="input-group captcha-group">
          <text class="input-label">验证码</text>
          <view class="captcha-container">
            <input class="input-field captcha-input" type="text" v-model="registerForm.code" placeholder="请输入验证码" />
            <view class="captcha-wrapper" @click="refreshCaptcha">
              <image class="captcha-image" :src="captchaImageUrl" />
              <view class="refresh-icon">
                <text class="refresh-text">刷新</text>
              </view>
            </view>
          </view>
        </view>
        
        <button class="login-button" @click="handleRegister">注 册</button>
      </view>
      
      <view class="quick-actions">
        <template v-if="isLoginMode">
          <text class="quick-action-text" @click="switchToRegister">注册账号</text>
          <!-- <text class="divider">|</text> -->
          <!-- <text class="quick-action-text" @click="navigateToAdminLogin">管理员登录</text> -->
        </template>
        <template v-else>
          <text class="quick-action-text" @click="switchToLogin">返回登录</text>
        </template>
      </view>
    </view>
    
    <view class="support-info">
      <text class="support-text">技术支持: example@company.com</text>
      <text class="version-text">版本 1.0.0</text>
    </view>
  </view>
</template>

<script>
import api from '../../api/index'

export default {
  data() {
    return {
      isLoginMode: true,
      loginForm: {
        username: '',
        password: '',
        code: '',
        uuid: ''
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        code: '',
        uuid: ''
      },
      rememberMe: false,
      showPassword: false,
      captchaImageUrl: '',
      isMockMode: false
    }
  },
  onLoad() {
    
    // 加载保存的用户名密码
    try {
      const loginInfo = uni.getStorageSync('loginInfo');
      if (loginInfo) {
        const info = JSON.parse(loginInfo);
        this.loginForm.username = info.username || '';
        this.loginForm.password = info.password || '';
        this.rememberMe = true;
      }
    } catch (e) {
      uni.removeStorageSync('loginInfo');
    }
    
    // 获取验证码
    this.refreshCaptcha();
  },
  methods: {
    switchToLogin() {
      this.isLoginMode = true;
      // 刷新验证码
      this.refreshCaptcha();
    },
    switchToRegister() {
      this.isLoginMode = false;
      // 保留现有登录表单的验证码给注册表单使用
      this.registerForm.code = this.loginForm.code;
      this.registerForm.uuid = this.loginForm.uuid;
    },
    refreshCaptcha() {
      uni.showLoading({
        title: '获取验证码...'
      });
      
      api.user.getCaptcha()
        .then(res => {
          uni.hideLoading();
          if (res.code === 200 && res.data) {
            this.captchaImageUrl = res.data.imageUrl || 'data:image/png;base64,' + res.data.img;
            this.loginForm.uuid = res.data.uuid; // 保存到登录表单中
            this.loginForm.code = '';
          } else {
            uni.showToast({
              title: '获取验证码失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          uni.hideLoading();
          uni.showToast({
            title: '获取验证码失败，请稍后重试',
            icon: 'none'
          });
        });
    },
    handleLogin() {
      // 表单验证
      if (!this.loginForm.username.trim()) {
        uni.showToast({
          title: '请输入用户名',
          icon: 'none'
        });
        return;
      }
      
      if (!this.loginForm.password.trim()) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        });
        return;
      }
      
      if (!this.loginForm.code.trim()) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        });
        return;
      }
      
      // 登录请求
      uni.showLoading({
        title: '登录中...'
      });
      
      // 设置请求超时标志
      let loginTimeout = false;
      const timeoutTimer = setTimeout(() => {
        loginTimeout = true;
        uni.hideLoading();
        uni.showModal({
          title: '登录超时',
          content: '服务器响应超时，请检查网络连接后重试',
          showCancel: false
        });
      }, 15000);
      
      // 使用API层进行登录
      api.user.login({
        username: this.loginForm.username,
        password: this.loginForm.password,
        code: this.loginForm.code,
        uuid: this.loginForm.uuid
      })
        .then(res => {
          clearTimeout(timeoutTimer);
          uni.hideLoading();
          
          if (loginTimeout) return; // 已经显示超时错误，不再处理
          
          if (res.code === 200 && res.data && res.data.token) {
            // 登录成功，检查用户是否被禁用
            const userData = res.data;
            
            // 检查用户状态
            const isActive = userData.user?.isActive || userData.isActive;
            if (isActive === 0) {
              // 用户被禁用
              uni.showToast({
                title: '您的账号已被禁用，请联系管理员',
                icon: 'none',
                duration: 3000
              });
              // 登录失败时刷新验证码
              this.refreshCaptcha();
              return;
            }
            
            // 用户状态正常，保存登录成功的数据
            const token = res.data.token;
            
            // 保存登录成功的数据
            uni.setStorageSync('token', token);
            
            // 登录成功后立即获取用户详细信息
            api.user.getUserInfo()
              .then(userInfoRes => {
                if (userInfoRes.code === 200 && userInfoRes.data) {
                  // 保存完整的用户信息
                  uni.setStorageSync('userInfo', JSON.stringify(userInfoRes.data));
                  console.log('已保存用户信息:', userInfoRes.data);
                } else {
                  console.log('获取用户信息失败:', userInfoRes);
                }
              })
              .catch(err => {
                console.error('获取用户信息出错:', err);
              });
            
            // 如果记住密码，保存登录信息
            if (this.rememberMe) {
              uni.setStorageSync('loginInfo', JSON.stringify({
                username: this.loginForm.username,
                password: this.loginForm.password
              }));
            } else {
              uni.removeStorageSync('loginInfo');
            }
            
            uni.showToast({
              title: '登录成功',
              icon: 'success',
              success: () => {
                // 登录成功后跳转到首页
                setTimeout(() => {
                  uni.reLaunch({
                    url: '/pages/user/schedule'
                  });
                }, 1000);
              }
            });
          } else {
            // 登录失败
            uni.showToast({
              title: res.message || '登录失败，请检查用户名和密码',
              icon: 'none'
            });
            // 登录失败时刷新验证码
            this.refreshCaptcha();
          }
        })
        .catch(err => {
          clearTimeout(timeoutTimer);
          uni.hideLoading();
          
          if (loginTimeout) return; // 已经显示超时错误，不再处理
          
          uni.showToast({
            title: '登录失败，请稍后重试',
            icon: 'none'
          });
          // 登录失败时刷新验证码
          this.refreshCaptcha();
        });
    },
    handleRegister() {
      // 表单验证
      if (!this.registerForm.username.trim()) {
        uni.showToast({
          title: '请输入用户名',
          icon: 'none'
        });
        return;
      }
      
      if (!this.registerForm.password.trim()) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        });
        return;
      }
      
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        });
        return;
      }
      
      if (!this.registerForm.code.trim()) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        });
        return;
      }
      
      // 注册请求
      uni.showLoading({
        title: '注册中...'
      });
      
      api.user.register({
        username: this.registerForm.username,
        password: this.registerForm.password,
        code: this.registerForm.code,
        uuid: this.registerForm.uuid
      })
        .then(res => {
          uni.hideLoading();
          
          if (res.code === 200) {
            uni.showToast({
              title: '注册成功',
              icon: 'success'
            });
            
            // 注册成功后，切换到登录模式
            this.loginForm.username = this.registerForm.username;
            this.loginForm.password = this.registerForm.password;
            this.switchToLogin();
            
            // 清除注册表单
            this.registerForm = {
              username: '',
              password: '',
              confirmPassword: '',
              code: '',
              uuid: ''
            };
          } else {
            uni.showToast({
              title: res.message || '注册失败',
              icon: 'none'
            });
            // 刷新验证码
            this.refreshCaptcha();
          }
        })
        .catch(err => {
          uni.hideLoading();
          uni.showToast({
            title: '注册失败，请稍后重试',
            icon: 'none'
          });
          // 刷新验证码
          this.refreshCaptcha();
        });
    },
    rememberChange(e) {
      this.rememberMe = e.detail.value.length > 0;
    },
    navigateToForgetPassword() {
      uni.showToast({
        title: '该功能暂未开放',
        icon: 'none'
      });
    },
    navigateToAdminLogin() {
      uni.navigateTo({
        url: '/pages/admin/login'
      });
    }
  }
}
</script>

<style>
.login-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 0 30px;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 15px;
}

.logo-image {
  width: 80px;
  height: 80px;
}

.app-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
}

.form-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-item {
  padding: 10px 20px;
  font-size: 16px;
  color: #666;
  border-bottom: 2px solid transparent;
  margin: 0 10px;
}

.tab-item.active {
  color: #3498db;
  border-bottom-color: #3498db;
  font-weight: bold;
}

.login-form {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 20px;
}

.captcha-group {
  margin-bottom: 20px;
}

.captcha-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.captcha-input {
  flex: 1;
  height: 44px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 14px;
}

.captcha-wrapper {
  position: relative;
  width: 120px;
  height: 44px;
  margin-left: 10px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.captcha-image {
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
}

.refresh-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 12px;
  padding: 2px 5px;
  border-top-left-radius: 4px;
}

.input-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.input-field {
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0 15px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.remember-label {
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.forget-password {
  color: #3498db;
  font-size: 14px;
}

.login-button {
  height: 40px;
  background-color: #3498db;
  color: white;
  border-radius: 6px;
  font-size: 16px;
  width: 100%;
}

.quick-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.quick-action-text {
  color: #3498db;
  font-size: 14px;
}

.divider {
  margin: 0 10px;
  color: #ddd;
}

.support-info {
  margin-top: auto;
  text-align: center;
  padding: 20px 0;
}

.support-text, .version-text {
  color: #999;
  font-size: 12px;
  line-height: 2;
}

.mock-tips {
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px dashed #ddd;
}

.mock-tip-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.mock-tip-item {
  display: flex;
  margin-bottom: 4px;
}

.mock-tip-label {
  color: #666;
  font-size: 13px;
  width: 70px;
}

.mock-tip-content {
  color: #3498db;
  font-size: 13px;
  font-family: monospace;
}
</style> 