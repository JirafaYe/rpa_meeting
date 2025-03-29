<template>
  <view class="user-list-container">
    <!-- 搜索和添加按钮区域 -->
    <view class="action-bar">
      <view class="search-box">
        <input type="text" class="search-input" v-model="searchText" placeholder="搜索用户..." @confirm="handleSearch" />
        <button class="search-btn" @click="handleSearch">
          <text class="iconfont icon-search"></text>
        </button>
      </view>
      <button class="add-btn" @click="navigateToEdit()">
        <text class="iconfont icon-plus"></text> 添加用户
      </button>
    </view>
    
    <!-- 过滤条件 -->
    <view class="filter-bar">
      <view class="filter-item">
        <text class="filter-label">部门</text>
        <picker :value="departmentIndex" :range="departmentOptions" range-key="label" @change="departmentChange" class="filter-picker">
          <view class="picker-value">
            {{departmentOptions[departmentIndex].label}}
          </view>
        </picker>
      </view>
      
      <view class="filter-item">
        <text class="filter-label">角色</text>
        <picker :value="roleIndex" :range="roleOptions" range-key="label" @change="roleChange" class="filter-picker">
          <view class="picker-value">
            {{roleOptions[roleIndex].label}}
          </view>
        </picker>
      </view>
      
      <view class="filter-item">
        <text class="filter-label">状态</text>
        <picker :value="statusIndex" :range="statusOptions" range-key="label" @change="statusChange" class="filter-picker">
          <view class="picker-value">
            {{statusOptions[statusIndex].label}}
          </view>
        </picker>
      </view>
    </view>
    
    <!-- 用户列表 -->
    <view class="user-list" v-if="users.length > 0">
      <view class="table">
        <view class="table-header">
          <text class="th th-id">ID</text>
          <text class="th th-name">姓名</text>
          <text class="th th-username">用户名</text>
          <text class="th th-department">部门</text>
          <text class="th th-role">角色</text>
          <text class="th th-status">状态</text>
          <text class="th th-action">操作</text>
        </view>
        
        <view class="table-body">
          <view class="table-row" v-for="(user, index) in users" :key="index">
            <text class="td td-id">{{user.id}}</text>
            <text class="td td-name">{{user.name}}</text>
            <text class="td td-username">{{user.username}}</text>
            <text class="td td-department">{{user.department}}</text>
            <text class="td td-role">{{user.role}}</text>
            <view class="td td-status">
              <text class="badge" :class="getStatusClass(user.status)">{{user.statusText}}</text>
            </view>
            <view class="td td-action">
              <view class="action-buttons">
                <button class="btn-icon btn-edit" @click="navigateToEdit(user.id)">
                  <text class="iconfont icon-edit"></text>
                </button>
                <button class="btn-icon btn-reset" @click="handleResetPassword(user)">
                  <text class="iconfont icon-reset"></text>
                </button>
                <button v-if="user.status === 'active'" class="btn-icon btn-disable" @click="handleToggleStatus(user)">
                  <text class="iconfont icon-ban"></text>
                </button>
                <button v-else class="btn-icon btn-enable" @click="handleToggleStatus(user)">
                  <text class="iconfont icon-check"></text>
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 分页 -->
      <view class="pagination">
        <view class="page-btn" :class="{disabled: currentPage === 1}" @click="handlePageChange(currentPage - 1)">
          <text class="iconfont icon-left"></text>
        </view>
        <view class="page-number" :class="{active: currentPage === page}" v-for="page in totalPages" :key="page" @click="handlePageChange(page)">
          {{page}}
        </view>
        <view class="page-btn" :class="{disabled: currentPage === totalPages}" @click="handlePageChange(currentPage + 1)">
          <text class="iconfont icon-right"></text>
        </view>
      </view>
    </view>
    
    <!-- 无数据状态 -->
    <view class="empty-state" v-else>
      <text class="iconfont icon-empty"></text>
      <text class="empty-text">暂无用户数据</text>
      <button class="add-btn" @click="navigateToEdit()">添加用户</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      departmentIndex: 0,
      roleIndex: 0,
      statusIndex: 0,
      departmentOptions: [
        { label: '全部部门', value: '' },
        { label: '研发部', value: 'dev' },
        { label: '产品部', value: 'product' },
        { label: '设计部', value: 'design' },
        { label: '测试部', value: 'qa' },
        { label: '市场部', value: 'market' },
        { label: '人事部', value: 'hr' }
      ],
      roleOptions: [
        { label: '全部角色', value: '' },
        { label: '普通用户', value: 'user' },
        { label: '部门管理员', value: 'dept_admin' },
        { label: '系统管理员', value: 'sys_admin' }
      ],
      statusOptions: [
        { label: '全部状态', value: '' },
        { label: '正常', value: 'active' },
        { label: '禁用', value: 'disabled' }
      ],
      users: [
        {
          id: 1,
          name: '张三',
          username: 'zhangsan',
          department: '研发部',
          role: '部门管理员',
          status: 'active',
          statusText: '正常'
        },
        {
          id: 2,
          name: '李四',
          username: 'lisi',
          department: '研发部',
          role: '普通用户',
          status: 'active',
          statusText: '正常'
        },
        {
          id: 3,
          name: '王五',
          username: 'wangwu',
          department: '产品部',
          role: '部门管理员',
          status: 'active',
          statusText: '正常'
        },
        {
          id: 4,
          name: '赵六',
          username: 'zhaoliu',
          department: '设计部',
          role: '部门管理员',
          status: 'active',
          statusText: '正常'
        },
        {
          id: 5,
          name: '钱七',
          username: 'qianqi',
          department: '测试部',
          role: '普通用户',
          status: 'disabled',
          statusText: '禁用'
        }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 5
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  onLoad() {
    this.fetchUserList();
  },
  onPullDownRefresh() {
    this.fetchUserList();
  },
  methods: {
    fetchUserList() {
      // 这里应该从API获取用户列表数据
      uni.showLoading({
        title: '加载中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        uni.stopPullDownRefresh();
        
        // 实际项目中应该使用接口返回的数据更新页面
        // 这里模拟根据筛选条件过滤数据
        let filteredUsers = [...this.users];
        
        const department = this.departmentOptions[this.departmentIndex].value;
        const role = this.roleOptions[this.roleIndex].value;
        const status = this.statusOptions[this.statusIndex].value;
        
        if (department) {
          filteredUsers = filteredUsers.filter(user => 
            user.department === this.departmentOptions[this.departmentIndex].label
          );
        }
        
        if (role) {
          filteredUsers = filteredUsers.filter(user => {
            if (role === 'user' && user.role === '普通用户') return true;
            if (role === 'dept_admin' && user.role === '部门管理员') return true;
            if (role === 'sys_admin' && user.role === '系统管理员') return true;
            return false;
          });
        }
        
        if (status) {
          filteredUsers = filteredUsers.filter(user => user.status === status);
        }
        
        if (this.searchText) {
          filteredUsers = filteredUsers.filter(user => 
            user.name.includes(this.searchText) || 
            user.username.includes(this.searchText)
          );
        }
        
        this.users = filteredUsers;
        this.total = filteredUsers.length;
      }, 500);
    },
    handleSearch() {
      this.fetchUserList();
    },
    departmentChange(e) {
      this.departmentIndex = e.detail.value;
      this.fetchUserList();
    },
    roleChange(e) {
      this.roleIndex = e.detail.value;
      this.fetchUserList();
    },
    statusChange(e) {
      this.statusIndex = e.detail.value;
      this.fetchUserList();
    },
    navigateToEdit(id) {
      if (id) {
        uni.navigateTo({
          url: `/pages/admin/user/edit?id=${id}`
        });
      } else {
        uni.navigateTo({
          url: '/pages/admin/user/edit'
        });
      }
    },
    handleResetPassword(user) {
      uni.showModal({
        title: '重置密码',
        content: `确定要重置"${user.name}"的密码吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            // 模拟网络请求
            setTimeout(() => {
              uni.hideLoading();
              
              // 实际项目中应该调用接口重置密码
              uni.showToast({
                title: '密码已重置',
                icon: 'success'
              });
            }, 500);
          }
        }
      });
    },
    handleToggleStatus(user) {
      const action = user.status === 'active' ? '禁用' : '启用';
      
      uni.showModal({
        title: `确认${action}`,
        content: `确定要${action}"${user.name}"吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            // 模拟网络请求
            setTimeout(() => {
              uni.hideLoading();
              
              // 实际项目中应该调用接口更新用户状态
              const index = this.users.findIndex(u => u.id === user.id);
              if (index !== -1) {
                if (user.status === 'active') {
                  this.users[index].status = 'disabled';
                  this.users[index].statusText = '禁用';
                } else {
                  this.users[index].status = 'active';
                  this.users[index].statusText = '正常';
                }
              }
              
              uni.showToast({
                title: `已${action}用户`,
                icon: 'success'
              });
            }, 500);
          }
        }
      });
    },
    handlePageChange(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) {
        return;
      }
      
      this.currentPage = page;
      this.fetchUserList();
    },
    getStatusClass(status) {
      const statusMap = {
        'active': 'badge-success',
        'disabled': 'badge-danger'
      };
      return statusMap[status] || 'badge-secondary';
    }
  }
}
</script>

<style>
.user-list-container {
  padding: 15px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 操作栏样式 */
.action-bar {
  display: flex;
  margin-bottom: 15px;
}

.search-box {
  display: flex;
  flex: 1;
  margin-right: 10px;
}

.search-input {
  flex: 1;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  padding: 0 15px;
  background-color: #fff;
}

.search-btn {
  width: 40px;
  height: 40px;
  background-color: #3498db;
  color: white;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.add-btn {
  height: 40px;
  padding: 0 15px;
  background-color: #2ecc71;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 过滤条件样式 */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.filter-item {
  flex: 1;
  min-width: 120px;
}

.filter-label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
  color: #555;
}

.filter-picker {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 40px;
  width: 100%;
}

.picker-value {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 14px;
}

/* 表格样式 */
.table {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.table-header {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
  padding: 12px 10px;
}

.th {
  font-weight: bold;
  color: #555;
  font-size: 14px;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 12px 10px;
}

.table-row:last-child {
  border-bottom: none;
}

.td {
  font-size: 14px;
  color: #333;
  padding: 0 2px;
  display: flex;
  align-items: center;
}

.th-id, .td-id {
  width: 40px;
}

.th-name, .td-name {
  flex: 1;
}

.th-username, .td-username {
  flex: 1;
}

.th-department, .td-department {
  flex: 1;
}

.th-role, .td-role {
  flex: 1;
}

.th-status, .td-status {
  width: 60px;
}

.th-action, .td-action {
  width: 120px;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
}

.btn-icon {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 2px;
  padding: 0;
}

.btn-edit {
  background-color: #3498db;
  color: white;
}

.btn-reset {
  background-color: #f39c12;
  color: white;
}

.btn-disable {
  background-color: #e74c3c;
  color: white;
}

.btn-enable {
  background-color: #2ecc71;
  color: white;
}

/* 状态标签样式 */
.badge {
  display: inline-block;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
}

.badge-success {
  background-color: #2ecc71;
}

.badge-danger {
  background-color: #e74c3c;
}

.badge-secondary {
  background-color: #95a5a6;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.page-btn, .page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  background-color: #fff;
  border-radius: 4px;
  color: #333;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-number.active {
  background-color: #3498db;
  color: white;
}

.page-btn.disabled {
  background-color: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.empty-state .iconfont {
  font-size: 50px;
  color: #ddd;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 16px;
  color: #999;
  margin-bottom: 20px;
}

.iconfont {
  font-family: 'iconfont';
}

@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
  }
  
  .search-box {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .filter-bar {
    flex-direction: column;
  }
  
  .filter-item {
    width: 100%;
  }
}
</style> 