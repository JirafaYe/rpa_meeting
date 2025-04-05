<template>
  <admin-layout 
    title="用户管理" 
    description="管理系统用户，可添加、编辑和禁用用户"
    active-path="/pages/admin/user/list">
    <view class="user-list-container">
      <!-- 操作栏 -->
      <view class="action-bar">
        <view class="search-box">
            <text class="iconfont icon-search"></text>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索用户" 
            @input="handleSearch"
          />
        </view>
        <view class="button-group">
          <button class="btn-primary" @click="handleAdd">
            <text class="iconfont icon-add"></text>
            添加用户
          </button>
        </view>
      </view>
      
      <!-- 用户表格 -->
      <view class="table-container">
        <view class="table">
          <view class="table-header">
            <view class="th">用户名</view>
            <view class="th">姓名</view>
            <view class="th">邮箱</view>
            <view class="th">状态</view>
            <view class="th">操作</view>
          </view>
          
          <view class="table-body">
            <view class="tr" v-for="user in users" :key="user.id">
              <view class="td">{{ user.username }}</view>
              <view class="td">{{ user.name }}</view>
              <view class="td">{{ user.email }}</view>
              <view class="td">
                <text :class="['status-tag', user.status === 1 ? 'active' : 'inactive']">
                  {{ '启用' }}
                </text>
              </view>
              <view class="td">
                <view class="action-buttons">
                  <button class="btn-small" @click="handleToggleStatus(user)">
                    {{ '禁用' }}
                  </button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 分页 -->
      <view class="pagination">
        <button 
          class="btn-page" 
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          <text class="iconfont icon-arrow-left"></text>
          上一页
        </button>
        <text class="page-info">第 {{ currentPage }} 页</text>
        <button 
          class="btn-page" 
          :disabled="!hasMore"
          @click="handlePageChange(currentPage + 1)"
        >
          下一页
          <text class="iconfont icon-arrow-right"></text>
        </button>
      </view>
    </view>
  </admin-layout>
</template>

<script>
import api from '@/api/index.js';
import AdminLayout from '@/components/admin/AdminLayout.vue';

export default {
  components: {
    AdminLayout
  },
  data() {
    return {
      users: [],
      currentPage: 1,
      pageSize: 10,
      hasMore: true,
      searchQuery: '',
      loading: false
    };
  },
  onLoad() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      this.loading = true;
      try {
        const res = await api.user.getUserList({
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          userName: this.searchQuery
        });
        if (res.code === 200 && res.data) {
          this.users = res.data.list || [];
          this.hasMore = (res.data.list && res.data.list.length === this.pageSize);
        } else {
          this.users = [];
          this.hasMore = false;
          uni.showToast({
            title: res.message || '获取用户列表失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取用户列表失败:', error);
        this.users = [];
        this.hasMore = false;
        uni.showToast({
          title: '获取用户列表失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.currentPage = 1;
      this.loadUsers();
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.loadUsers();
    },
    handleAdd() {
        uni.navigateTo({
          url: '/pages/admin/user/edit'
        });
    },
    async handleToggleStatus(user) {
      try {
        const res = await api.user.updateUserStatus(user.id, user.status === 1 ? 0 : 1);
        if (res.code === 200) {
              uni.showToast({
            title: '操作成功',
                icon: 'success'
              });
          this.loadUsers();
                } else {
              uni.showToast({
            title: res.message || '操作失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('更新用户状态失败:', error);
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style scoped>
.user-list-container {
  padding: 24px;
  background: #fff;
  min-height: 480px;
  position: relative;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
}

.search-box {
  flex: 1;
  max-width: 360px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 0 16px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.search-box:hover, .search-box:focus-within {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.search-box .iconfont {
  font-size: 18px;
  color: #bfbfbf;
  margin-right: 8px;
}

.search-box input {
  flex: 1;
  height: 40px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #262626;
}

.search-box input::placeholder {
  color: #bfbfbf;
}

.btn-primary {
  height: 40px;
  padding: 0 24px;
  background: #1890ff;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-primary .iconfont {
  font-size: 16px;
}

.table-container {
  background-color: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
}

.th {
  padding: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  text-align: left;
  flex: 1;
}

.tr {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.tr:hover {
  background-color: #f5f7fa;
}

.td {
  padding: 16px;
  font-size: 14px;
  color: #595959;
  flex: 1;
  display: flex;
  align-items: center;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.active {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.inactive {
  background: #fff1f0;
  color: #f5222d;
  border: 1px solid #ffa39e;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-small {
  height: 32px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fff1f0;
  color: #f5222d;
  border: 1px solid #ffa39e;
  transition: all 0.3s ease;
}

.btn-small:hover {
  background: #fff2f0;
  border-color: #ff4d4f;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.btn-page {
  height: 36px;
  padding: 0 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: #fff;
  color: #262626;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-page:not(:disabled):hover {
  color: #1890ff;
  border-color: #1890ff;
  background-color: #f0f7ff;
}

.btn-page:disabled {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  color: #bfbfbf;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #8c8c8c;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .table {
    min-width: 800px;
  }
  
  .pagination {
    justify-content: center;
  }
}
</style> 