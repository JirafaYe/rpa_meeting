    <template>
  <view class="login-container">
    <view class="logo-area">
      <image class="logo-image" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">会议室预约系统</text>
    </view>
    
    <view class="login-form">
      <view class="input-group">
        <text class="input-label">用户名</text>
        <input class="input-field" type="text" v-model="username" placeholder="请输入用户名" />
      </view>
      
      <view class="input-group">
        <text class="input-label">密码</text>
        <input class="input-field" type="password" v-model="password" placeholder="请输入密码" password />
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
      
      <view v-if="isMockMode" class="mock-tips">
        <text class="mock-tip-title">测试环境可用账号:</text>
        <view class="mock-tip-item">
          <text class="mock-tip-label">管理员: </text>
          <text class="mock-tip-content">admin / admin123</text>
        </view>
        <view class="mock-tip-item">
          <text class="mock-tip-label">普通用户: </text>
          <text class="mock-tip-content">user / user123</text>
        </view>
        <view class="mock-tip-item">
          <text class="mock-tip-label">部门经理: </text>
          <text class="mock-tip-content">manager / manager123</text>
        </view>
      </view>
      
      <view class="quick-actions">
        <text class="quick-action-text" @click="navigateToRegister">注册账号</text>
        <text class="divider">|</text>
        <text class="quick-action-text" @click="navigateToAdminLogin">管理员登录</text>
      </view>
    </view>
    
    <view class="support-info">
      <text class="support-text">技术支持: example@company.com</text>
      <text class="version-text">版本 1.0.0</text>
    </view>
  </view>
</template>

<script>
import api from '../../utils/api.js'

export default {
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false,
      isMockMode: false
    }
  },
  onLoad() {
    // 检查平台，确保是移动端访问
    // #ifdef H5
    // 如果是H5平台访问用户页面，重定向到管理员登录页
    console.log("检测到Web平台访问用户页面，将重定向到管理员登录");
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/admin/login'
      });
    }, 100);
    return; // 不再执行后续代码
    // #endif
    
    // 加载保存的用户名密码
    try {
      const loginInfo = uni.getStorageSync('loginInfo');
      if (loginInfo) {
        const info = JSON.parse(loginInfo);
        this.username = info.username || '';
        this.password = info.password || '';
        this.rememberMe = true;
      }
      
      // 检查是否处于mock模式
      try {
        const app = getApp();
        this.isMockMode = app && app.$config && app.$config.enableMock;
      } catch (e) {
        console.error('获取App配置失败:', e);
        this.isMockMode = false;
      }
      
      if (this.isMockMode) {
        console.log('当前使用Mock模式，可使用以下测试账号：');
        console.log('用户名: admin, 密码: admin123');
        console.log('用户名: user, 密码: user123');
        console.log('用户名: manager, 密码: manager123');
      }
      
      // 检查是否是开发环境并自动登录
      this.checkDevModeAutoLogin();
    } catch (e) {
      console.error('读取登录信息失败', e);
    }
  },
  methods: {
    // 检查是否是开发环境并自动登录
    checkDevModeAutoLogin() {
      try {
        // 获取应用配置
        const app = getApp();
        if (!app || !app.$config) {
          console.error('无法获取应用配置');
          return;
        }
        
        // 检查是否启用自动登录
        const autoLoginConfig = app.$config.autoLogin;
        if (!autoLoginConfig || !autoLoginConfig.enabled) {
          console.log('未启用自动登录功能');
          return;
        }
        
        // 检查是否已经登录
        const token = uni.getStorageSync('token');
        if (token) {
          console.log('检测到已登录状态，直接跳转到首页');
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/user/schedule'
            });
          }, 100);
          return;
        }
        
        console.log('检测到开发环境自动登录配置，正在使用默认账号登录');
        
        // 设置默认账号
        this.username = autoLoginConfig.username || 'user';
        this.password = autoLoginConfig.password || 'user123';
        
        // 延迟一下自动登录，让UI先渲染出来
        setTimeout(() => {
          this.handleLogin(true);
        }, 500);
      } catch (err) {
        console.error('自动登录检查失败:', err);
      }
    },
    
    handleLogin(isAutoLogin = false) {
      // 表单验证
      if (!this.username.trim()) {
        uni.showToast({
          title: '请输入用户名',
          icon: 'none'
        });
        return;
      }
      
      if (!this.password.trim()) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        });
        return;
      }
      
      // 登录请求
      if (!isAutoLogin) {
        uni.showLoading({
          title: '登录中...'
        });
      }
      
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
        username: this.username,
        password: this.password
      })
        .then(res => {
          clearTimeout(timeoutTimer);
          if (!isAutoLogin) {
            uni.hideLoading();
          }
          
          if (loginTimeout) return; // 已经显示超时错误，不再处理
          
          if (res.code === 200 && res.data) {
            // 登录成功，保存登录信息
            if (this.rememberMe) {
              uni.setStorageSync('loginInfo', JSON.stringify({
                username: this.username,
                password: this.password
              }));
            } else {
              uni.removeStorageSync('loginInfo');
            }
            
            // 保存用户登录状态和token
            uni.setStorageSync('token', res.data.token);
            uni.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
            
            if (!isAutoLogin) {
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
              console.log('自动登录成功，立即跳转到首页');
              // 对于自动登录，立即跳转
              uni.reLaunch({
                url: '/pages/user/schedule'
              });
            }
          } else {
            // 登录失败
            if (!isAutoLogin) {
              uni.showToast({
                title: res.message || '登录失败，请检查用户名和密码',
                icon: 'none'
              });
            } else {
              console.error('自动登录失败:', res.message);
              // 自动登录失败不显示提示，只在控制台输出错误信息
            }
          }
        })
        .catch(err => {
          clearTimeout(timeoutTimer);
          if (!isAutoLogin) {
            uni.hideLoading();
          }
          
          if (loginTimeout) return; // 已经显示超时错误，不再处理
          
          console.error('登录请求失败:', err);
          if (!isAutoLogin) {
            uni.showToast({
              title: '登录失败，请稍后重试',
              icon: 'none'
            });
          } else {
            console.error('自动登录请求异常:', err);
          }
        });
    },
    rememberChange(e) {
      this.rememberMe = e.detail.value.length > 0;
    },
    navigateToRegister() {
      uni.showToast({
        title: '注册功能暂未开放',
        icon: 'none'
      });
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
  margin-bottom: 30px;
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

.login-form {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
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