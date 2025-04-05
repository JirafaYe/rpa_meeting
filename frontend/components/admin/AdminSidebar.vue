<template>
  <div class="admin-sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <div class="sidebar-header">
      <div class="logo-container" @click="navigateTo('/pages/admin/home')">
        <div class="logo">
          <img src="/static/logo.png" alt="Logo">
        </div>
        <div class="system-name" v-if="!isCollapsed">会议系统</div>
      </div>
      <div class="collapse-btn" @click="toggleCollapse">
        <span class="iconfont" :class="isCollapsed ? 'icon-menu-unfold' : 'icon-menu-fold'"></span>
      </div>
    </div>
    
    <div class="sidebar-menu">
      <div class="menu-item" :class="{ active: activePath === '/pages/admin/home' }" @click="navigateTo('/pages/admin/home')">
        <span class="iconfont icon-home"></span>
        <span class="menu-text" v-if="!isCollapsed">控制台</span>
      </div>
      
      <div class="menu-group">
        <div class="menu-group-title" @click="toggleSubmenu('meeting')" :class="{ 'collapsed': !submenuVisible.meeting }">
          <div class="menu-group-header">
            <span class="iconfont icon-meeting"></span>
            <span class="menu-text" v-if="!isCollapsed">会议管理</span>
          </div>
          <span class="iconfont icon-arrow-down submenu-arrow" v-if="!isCollapsed"></span>
        </div>
        <div class="submenu" v-if="submenuVisible.meeting && !isCollapsed">
          <div class="submenu-item" :class="{ active: activePath === '/pages/admin/meeting/list' }" @click="navigateTo('/pages/admin/meeting/list')">
            <span class="submenu-dot"></span>
            <span>会议列表</span>
          </div>
          <div class="submenu-item" :class="{ active: activePath === '/pages/admin/meeting/calendar' }" @click="navigateTo('/pages/admin/meeting/calendar')">
            <span class="submenu-dot"></span>
            <span>会议日历</span>
          </div>
          <div class="submenu-item" :class="{ active: activePath === '/pages/admin/meeting/approval' }" @click="navigateTo('/pages/admin/meeting/approval')">
            <span class="submenu-dot"></span>
            <span>会议审批</span>
          </div>
        </div>
      </div>
      
      <div class="menu-group">
        <div class="menu-group-title" @click="toggleSubmenu('room')" :class="{ 'collapsed': !submenuVisible.room }">
          <div class="menu-group-header">
            <span class="iconfont icon-room"></span>
            <span class="menu-text" v-if="!isCollapsed">会议室管理</span>
          </div>
          <span class="iconfont icon-arrow-down submenu-arrow" v-if="!isCollapsed"></span>
        </div>
        <div class="submenu" v-if="submenuVisible.room && !isCollapsed">
          <div class="submenu-item" :class="{ active: activePath === '/pages/admin/room/list' }" @click="navigateTo('/pages/admin/room/list')">
            <span class="submenu-dot"></span>
            <span>会议室列表</span>
          </div>
          <div class="submenu-item" :class="{ active: activePath === '/pages/admin/room/reservation' }" @click="navigateTo('/pages/admin/room/reservation')">
            <span class="submenu-dot"></span>
            <span>预约管理</span>
          </div>
        </div>
      </div>
      
      <div class="menu-item" :class="{ active: activePath.includes('/pages/admin/user') }" @click="navigateTo('/pages/admin/user/list')">
        <span class="iconfont icon-user"></span>
        <span class="menu-text" v-if="!isCollapsed">用户管理</span>
      </div>
      
      <div class="menu-item" :class="{ active: activePath.includes('/pages/admin/statistics') }" @click="navigateTo('/pages/admin/statistics/index')">
        <span class="iconfont icon-chart"></span>
        <span class="menu-text" v-if="!isCollapsed">数据报表</span>
      </div>
      
      <div class="menu-item" :class="{ active: activePath.includes('/pages/admin/rpa') }" @click="navigateTo('/pages/admin/rpa/index')">
        <span class="iconfont icon-rpa"></span>
        <span class="menu-text" v-if="!isCollapsed">RPA管理</span>
      </div>
      
      <div class="menu-divider"></div>
      
      <div class="menu-item" :class="{ active: activePath.includes('/pages/admin/settings') }" @click="navigateTo('/pages/admin/settings/index')">
        <span class="iconfont icon-setting"></span>
        <span class="menu-text" v-if="!isCollapsed">系统设置</span>
      </div>
      
      <div class="menu-item" :class="{ active: activePath.includes('/pages/admin/notification') }" @click="navigateTo('/pages/admin/notification/index')">
        <span class="iconfont icon-notification"></span>
        <span class="menu-text" v-if="!isCollapsed">通知中心</span>
      </div>
    </div>
    
    <div class="sidebar-footer" v-if="!isCollapsed">
      <div class="version">版本 v1.0.0</div>
      <div class="copyright">© 2023 RPA会议系统</div>
    </div>
    
    <div class="sidebar-footer collapsed-footer" v-if="isCollapsed">
      <div class="version-icon" title="版本 v1.0.0">v1</div>
    </div>
  </div>
</template>

<script>
import { safeNavigateTo } from '../../utils/helper.js';

export default {
  name: 'AdminSidebar',
  props: {
    // 当前激活的路径
    activePath: {
      type: String,
      default: ''
    },
    // 是否折叠
    isCollapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 由于props来指定折叠状态，不再需要本地状态
      submenuVisible: {
        meeting: true,
        room: false
      }
    }
  },
  methods: {
    navigateTo(url) {
      // 检查是否已经在当前页面
      if (this.activePath === url) {
        return;
      }
      
      // 判断是否需要使用重定向模式
      const pages = getCurrentPages();
      const useRedirect = pages && pages.length > 1;
      
      // 使用安全导航函数
      safeNavigateTo(url, useRedirect).catch(err => {
        console.error('导航错误:', err);
        // 错误已在safeNavigateTo函数中处理，这里不需要额外处理
      });
    },
    toggleCollapse() {
      // 发出事件通知父组件
      this.$emit('update:isCollapsed', !this.isCollapsed);
      
      // 存储当前折叠状态供下次使用
      try {
        uni.setStorageSync('adminSidebarCollapsed', !this.isCollapsed);
      } catch (e) {
        console.error('存储侧边栏状态失败', e);
      }
    },
    toggleSubmenu(key) {
      if (!this.isCollapsed) {
        this.submenuVisible[key] = !this.submenuVisible[key];
      } else if (key === 'meeting') {
        this.navigateTo('/pages/admin/meeting/list');
      } else if (key === 'room') {
        this.navigateTo('/pages/admin/room/list');
      }
    }
  },
  mounted() {
    // 根据活动路径设置相应子菜单为可见
    if (this.activePath.includes('/pages/admin/meeting')) {
      this.submenuVisible.meeting = true;
    } else if (this.activePath.includes('/pages/admin/room')) {
      this.submenuVisible.room = true;
    }
  }
}
</script>

<style scoped>
.admin-sidebar {
  width: 240px;
  height: 100vh;
  background: #ffffff;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #f0f0f0;
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-header {
  height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  overflow: hidden;
  background-color: #fafafa;
}

.logo-container {
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.logo-container:hover {
  opacity: 0.9;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(24, 144, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1890ff;
  font-size: 18px;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
  transition: all 0.3s;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.system-name {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.3s, margin-left 0.3s;
}

.sidebar-collapsed .system-name {
  opacity: 0;
  margin-left: -20px;
}

.sidebar-menu {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.menu-item {
  padding: 0 16px;
  margin: 4px 8px;
  position: relative;
  display: flex;
  align-items: center;
  height: 44px;
  color: #595959;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 6px;
}

.menu-item:hover {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.05);
}

.menu-item.active {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.08);
  font-weight: 500;
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #1890ff;
  border-radius: 0 4px 4px 0;
}

.menu-item .iconfont {
  font-size: 18px;
  margin-right: 12px;
}

.menu-group-title {
  padding: 0 16px;
  margin: 4px 8px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  color: #595959;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 6px;
}

.menu-group-title:hover {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.05);
}

.menu-group-header {
  display: flex;
  align-items: center;
}

.menu-group-header .iconfont {
  font-size: 18px;
  margin-right: 12px;
}

.menu-group {
  overflow: hidden;
}

.menu-text {
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.3s, margin-left 0.3s;
}

.sidebar-collapsed .menu-text {
  opacity: 0;
  margin-left: -20px;
  display: none;
}

.sidebar-footer {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #f0f0f0;
  padding: 0 16px;
  flex-direction: column;
  background-color: #fafafa;
}

.collapse-btn {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.collapse-btn:hover {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
}

.submenu {
  padding-left: 16px;
}

.submenu-item {
  padding: 0 16px 0 28px;
  margin: 4px 8px;
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  color: #8c8c8c;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 6px;
}

.submenu-item:hover {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.05);
}

.submenu-item.active {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.08);
  font-weight: 500;
}

.submenu-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #d9d9d9;
  margin-right: 8px;
  display: inline-block;
}

.submenu-item.active .submenu-dot {
  background-color: #1890ff;
}

.submenu {
  display: block;
  max-height: 500px;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
}

.submenu-arrow {
  font-size: 12px;
  transition: transform 0.3s;
}

.menu-group-title.collapsed .submenu-arrow {
  transform: rotate(-90deg);
}

.menu-divider {
  height: 1px;
  background-color: #f0f0f0;
  margin: 12px 16px;
}

.version, .copyright {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 1.5;
}

.collapsed-footer {
  height: 64px;
}

.version-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: rgba(24, 144, 255, 0.1);
  color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

@media (max-width: 992px) {
  .admin-sidebar {
    width: 80px;
  }
  
  .system-name {
    opacity: 0;
    margin-left: -20px;
  }
  
  .menu-text {
    opacity: 0;
    margin-left: -20px;
  }
  
  .menu-icon {
    margin-right: 0;
    font-size: 20px;
  }
  
  .menu-arrow {
    display: none;
  }
  
  .submenu {
    display: none;
  }
}

@media (max-width: 768px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }
  
  .admin-sidebar.mobile-visible {
    transform: translateX(0);
  }
  
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: none;
  }
  
  .sidebar-overlay.visible {
    display: block;
  }
}
</style> 