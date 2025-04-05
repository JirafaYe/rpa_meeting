<template>
  <div class="admin-layout">
    <!-- 侧边导航栏 -->
    <admin-sidebar :active-path="activePath" />
    
    <!-- 主内容区域 -->
    <div class="admin-main">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <span class="breadcrumb-item" @click="navigateToHome">
          <span class="iconfont icon-home"></span> 首页
        </span>
        <span class="breadcrumb-separator">/</span>
        <span v-if="parentPath && parentTitle" class="breadcrumb-item" @click="navigateToParent">
          {{parentTitle}}
        </span>
        <span v-if="parentPath && parentTitle" class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item">{{title}}</span>
      </div>
      
      <slot></slot>
    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue';

export default {
  name: 'NoHeaderLayout',
  components: {
    AdminSidebar
  },
  props: {
    // 页面标题
    title: {
      type: String,
      default: '管理员控制台'
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
    }
  },
  methods: {
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
    }
  }
}
</script>

<style>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 确保隐藏顶部标题栏 */
.admin-header, 
.page-header,
.header-title,
.header-navigation,
[class*="header-top"],
[class*="topbar"] {
  display: none !important;
}

.admin-main {
  flex: 1;
  padding: 20px;
  padding-top: 20px;
  margin-left: 220px; /* 侧边栏宽度 */
  min-height: 100vh;
  box-sizing: border-box;
}

.breadcrumb {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 12px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.breadcrumb-item {
  color: #1976d2;
  cursor: pointer;
}

.breadcrumb-item:last-child {
  color: #333;
  font-weight: 500;
  cursor: default;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #ccc;
}

.breadcrumb-item:hover:not(:last-child) {
  color: #1565c0;
  text-decoration: underline;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .admin-main {
    margin-left: 0;
    padding: 10px;
    padding-top: 10px;
  }
}
</style> 