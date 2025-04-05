<template>
  <div class="admin-layout" :class="{ 'collapsed': isSidebarCollapsed }">
    <!-- 顶部导航 -->
    <div class="admin-header" v-if="!hideHeader">
      <div class="header-left" @click="navigateToHome">
        <img class="header-logo" src="/static/logo.png" alt="Logo">
        <div class="header-title-wrapper">
          <span class="header-title">{{title}}</span>
          <span v-if="description" class="header-description">{{description}}</span>
        </div>
      </div>
      <div class="header-actions">
        <div class="header-datetime">
          <span class="header-date">{{currentDate}}</span>
          <span class="header-time">{{currentTime}}</span>
        </div>
        
        <div class="header-user">
          <div v-if="avatarUrl" class="user-avatar">
            <img :src="avatarUrl" alt="管理员头像">
          </div>
          <div v-else class="user-avatar avatar-text">
            {{usernameFirstChar}}
          </div>
          <div class="user-info" @click.stop="toggleUserDropdown">
            <span class="header-username">管理员</span>
            <div class="user-dropdown" v-show="showUserDropdown">
              <div class="dropdown-item"><span class="iconfont icon-user"></span> 个人资料</div>
              <div class="dropdown-item"><span class="iconfont icon-setting"></span> 系统设置</div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item" @click="handleLogout"><span class="iconfont icon-logout"></span> 退出登录</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 侧边导航栏 -->
    <admin-sidebar 
      :active-path="activePath" 
      :is-collapsed="isSidebarCollapsed"
      @update:isCollapsed="updateSidebarState"
    />
    
    <!-- 主内容区域 -->
    <div class="admin-main">
      <!-- 面包屑导航 -->
      <div class="breadcrumb" v-if="breadcrumb && breadcrumb.length > 0">
        <template v-for="(item, index) in breadcrumb" :key="index">
          <span 
            class="breadcrumb-item" 
            :class="{ 'active': index === breadcrumb.length - 1 }"
            @click="item.path ? navigateTo(item.path) : null"
          >
            <span v-if="index === 0" class="iconfont icon-home"></span>
            {{item.title}}
          </span>
          <span 
            v-if="index < breadcrumb.length - 1" 
            class="breadcrumb-separator"
          >/</span>
        </template>
      </div>
      <div class="breadcrumb" v-else>
        <span class="breadcrumb-item" @click="navigateToHome">
          <span class="iconfont icon-home"></span> 首页
        </span>
        <span class="breadcrumb-separator">/</span>
        <span v-if="parentPath && parentTitle" class="breadcrumb-item" @click="navigateToParent">
          {{parentTitle}}
        </span>
        <span v-if="parentPath && parentTitle" class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">{{title}}</span>
      </div>
      
      <slot></slot>
    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue';

export default {
  name: 'AdminLayout',
  components: {
    AdminSidebar
  },
  props: {
    // 页面标题
    title: {
      type: String,
      default: '管理员控制台'
    },
    // 页面简介
    description: {
      type: String,
      default: ''
    },
    // 当前激活的路径
    activePath: {
      type: String,
      default: ''
    },
    // 父级路径
    parentPath: {
      type: String,
      default: ''
    },
    // 父级标题
    parentTitle: {
      type: String,
      default: ''
    },
    // 是否隐藏顶部标题栏
    hideHeader: {
      type: Boolean,
      default: false
    },
    // 面包屑导航配置
    breadcrumb: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      currentDate: '',
      currentTime: '',
      timer: null,
      avatarUrl: '', // 默认空字符串表示没有头像
      showUserDropdown: false,
      isSidebarCollapsed: false // 添加侧边栏折叠状态
    }
  },
  computed: {
    // 获取用户名的第一个字符
    usernameFirstChar() {
      return '管'.charAt(0);
    }
  },
  mounted() {
    this.updateDateTime();
    this.timer = setInterval(this.updateDateTime, 1000); // 每秒更新一次时间
    
    // 添加点击外部关闭用户菜单的事件监听
    document.addEventListener('click', this.handleOutsideClick);
    
    // 监听侧边栏折叠状态变化
    window.addEventListener('storage', this.checkSidebarState);
    
    // 初始加载侧边栏状态
    this.checkSidebarState();
    
    // 补充：从storage中加载状态
    try {
      const collapsedState = uni.getStorageSync('adminSidebarCollapsed');
      if (collapsedState !== '') {
        this.isSidebarCollapsed = collapsedState === 'true' || collapsedState === true;
      }
    } catch (e) {
      console.error('读取侧边栏状态失败:', e);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    // 移除事件监听器
    document.removeEventListener('click', this.handleOutsideClick);
    window.removeEventListener('storage', this.checkSidebarState);
  },
  methods: {
    // 更新日期时间
    updateDateTime() {
      const now = new Date();
      // 格式化日期
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      this.currentDate = `${year}年${month}月${day}日`;
      
      // 格式化时间
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      this.currentTime = `${hours}:${minutes}:${seconds}`;
    },
    handleLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除登录信息
            uni.removeStorageSync('adminToken');
            uni.removeStorageSync('adminInfo');
            
            // 跳转到登录页
            uni.reLaunch({
              url: '/pages/admin/login'
            });
          }
        }
      });
    },
    toggleUserDropdown(event) {
      event.stopPropagation();
      this.showUserDropdown = !this.showUserDropdown;
    },
    handleOutsideClick(event) {
      // 处理用户菜单的点击外部关闭
      if (!this.$el) return;
      
      // 处理用户菜单的点击外部关闭
      const userInfoElem = this.$el.querySelector('.user-info');
      if (this.showUserDropdown && userInfoElem && !userInfoElem.contains(event.target)) {
        this.showUserDropdown = false;
      }
    },
    navigateToHome() {
      uni.reLaunch({
        url: '/pages/admin/home'
      });
    },
    navigateToParent() {
      if (this.parentPath) {
        uni.navigateTo({
          url: this.parentPath
        });
      }
    },
    navigateTo(url) {
      if (url) {
        uni.navigateTo({ url });
      }
    },
    // 添加检查侧边栏状态的方法
    checkSidebarState() {
      try {
        const savedState = uni.getStorageSync('adminSidebarCollapsed');
        if (savedState !== '') {
          this.isSidebarCollapsed = savedState;
        }
      } catch (e) {
        console.error('读取侧边栏状态失败:', e);
      }
    },
    // 更新侧边栏状态
    updateSidebarState(value) {
      this.isSidebarCollapsed = value;
      try {
        uni.setStorageSync('adminSidebarCollapsed', value);
      } catch (e) {
        console.error('存储侧边栏状态失败:', e);
      }
    }
  }
}
</script>

<style>
/* 主布局样式 */
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  position: relative;
  font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* 管理后台内容区 */
.admin-content {
  flex: 1;
  margin-left: 240px;
  padding-top: 64px;
  transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: radial-gradient(circle at 97% 3%, rgba(24, 144, 255, 0.05) 0%, transparent 50%),
                  radial-gradient(circle at 2% 90%, rgba(114, 46, 209, 0.05) 0%, transparent 40%);
  background-size: 100% 100%;
  background-attachment: fixed;
  overflow-x: hidden;
}

.collapsed-content {
  margin-left: 80px;
}

/* 顶部导航栏样式修复 */
.admin-header {
  position: fixed;
  top: 0;
  left: 240px;
  right: 0;
  height: 64px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  z-index: 900;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s;
}

.header-left {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header-logo {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  margin-right: 12px;
}

.header-title-wrapper {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.2;
}

.header-description {
  font-size: 12px;
  color: #8c8c8c;
}

.header-actions {
  display: flex;
  align-items: center;
}

.header-datetime {
  margin-right: 24px;
  font-size: 14px;
  color: #595959;
  display: flex;
  align-items: center;
}

.header-date {
  margin-right: 12px;
  position: relative;
}

.header-date::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 14px;
  background-color: #e8e8e8;
}

.header-time {
  color: #1890ff;
}

.header-user {
  display: flex;
  align-items: center;
  position: relative;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  margin-right: 8px;
  cursor: pointer;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  cursor: pointer;
  position: relative;
}

.header-username {
  font-size: 14px;
  color: #1a1a1a;
  margin-right: 4px;
}

.user-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  width: 160px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background-color: #f0f2f5;
  color: #1890ff;
}

.dropdown-item .iconfont {
  margin-right: 8px;
  font-size: 16px;
}

.dropdown-divider {
  height: 1px;
  background-color: #f0f0f0;
  margin: 4px 0;
}

/* 面包屑导航样式 */
.breadcrumb {
  margin-bottom: 16px;
  font-size: 14px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.breadcrumb-item:hover {
  color: #1890ff;
}

.breadcrumb-item.active {
  color: #1a1a1a;
  font-weight: 500;
  cursor: default;
}

.breadcrumb-item.active:hover {
  color: #1a1a1a;
}

.breadcrumb-item .iconfont {
  margin-right: 4px;
  font-size: 14px;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #d9d9d9;
}

/* 主内容区域样式 */
.admin-main {
  margin-left: 240px;
  margin-top: 64px;
  padding: 24px;
  min-height: calc(100vh - 64px);
  background-color: #f0f2f5;
  transition: all 0.3s;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .header-date {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-datetime {
    display: none;
  }
  
  .header-description {
  display: none;
  }
}

.collapsed .admin-header {
  left: 80px;
}

.collapsed .admin-main {
  margin-left: 80px;
}
</style> 