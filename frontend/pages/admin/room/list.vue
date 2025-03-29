<template>
  <view class="room-list-container">
    <!-- 搜索和添加按钮区域 -->
    <view class="action-bar">
      <view class="search-box">
        <input type="text" class="search-input" v-model="searchText" placeholder="搜索会议室..." @confirm="handleSearch" />
        <button class="search-btn" @click="handleSearch">
          <text class="iconfont icon-search"></text>
        </button>
      </view>
      <button class="add-btn" @click="navigateToEdit()">
        <text class="iconfont icon-plus"></text> 添加会议室
      </button>
    </view>
    
    <!-- 会议室列表 -->
    <view class="room-list" v-if="rooms.length > 0">
      <view class="table">
        <view class="table-header">
          <text class="th th-id">ID</text>
          <text class="th th-name">会议室名称</text>
          <text class="th th-capacity">容量</text>
          <text class="th th-equipment">设备</text>
          <text class="th th-status">状态</text>
          <text class="th th-action">操作</text>
        </view>
        
        <view class="table-body">
          <view class="table-row" v-for="(room, index) in rooms" :key="index">
            <text class="td td-id">{{room.id}}</text>
            <text class="td td-name">{{room.name}}</text>
            <text class="td td-capacity">{{room.capacity}}人</text>
            <text class="td td-equipment">{{room.equipment}}</text>
            <view class="td td-status">
              <text class="badge" :class="getStatusClass(room.status)">{{room.statusText}}</text>
            </view>
            <view class="td td-action">
              <view class="action-buttons">
                <button class="btn-icon btn-edit" @click="navigateToEdit(room.id)">
                  <text class="iconfont icon-edit"></text>
                </button>
                <button class="btn-icon btn-delete" @click="handleDeleteRoom(room)">
                  <text class="iconfont icon-delete"></text>
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
      <text class="empty-text">暂无会议室数据</text>
      <button class="add-btn" @click="navigateToEdit()">添加会议室</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      rooms: [
        {
          id: 1,
          name: '会议室A',
          capacity: 20,
          equipment: '投影仪, 白板',
          status: 'available',
          statusText: '可用'
        },
        {
          id: 2,
          name: '会议室B',
          capacity: 12,
          equipment: '投影仪, 视频会议系统',
          status: 'available',
          statusText: '可用'
        },
        {
          id: 3,
          name: '会议室C',
          capacity: 8,
          equipment: '电子白板',
          status: 'maintenance',
          statusText: '维护中'
        }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 3
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  onLoad() {
    this.fetchRoomList();
  },
  onPullDownRefresh() {
    this.fetchRoomList();
  },
  methods: {
    fetchRoomList() {
      // 这里应该从API获取会议室列表数据
      uni.showLoading({
        title: '加载中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        uni.stopPullDownRefresh();
        // 实际项目中应该使用接口返回的数据更新页面
      }, 500);
    },
    handleSearch() {
      // 搜索会议室
      uni.showLoading({
        title: '搜索中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        // 实际项目中应该根据搜索关键词查询并更新数据
        if (this.searchText) {
          uni.showToast({
            title: `搜索"${this.searchText}"`,
            icon: 'none'
          });
        }
      }, 500);
    },
    navigateToEdit(id) {
      if (id) {
        uni.navigateTo({
          url: `/pages/admin/room/edit?id=${id}`
        });
      } else {
        uni.navigateTo({
          url: '/pages/admin/room/edit'
        });
      }
    },
    handleDeleteRoom(room) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除 "${room.name}" 吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '删除中...'
            });
            
            // 模拟网络请求
            setTimeout(() => {
              uni.hideLoading();
              
              // 实际项目中应该调用接口删除数据
              // 这里只做前端模拟
              const index = this.rooms.findIndex(r => r.id === room.id);
              if (index >= 0) {
                this.rooms.splice(index, 1);
                this.total--;
              }
              
              uni.showToast({
                title: '删除成功',
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
      this.fetchRoomList();
    },
    getStatusClass(status) {
      const statusMap = {
        'available': 'badge-success',
        'maintenance': 'badge-warning',
        'unavailable': 'badge-danger'
      };
      return statusMap[status] || 'badge-secondary';
    }
  }
}
</script>

<style>
.room-list-container {
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
  padding: 12px 15px;
}

.th {
  font-weight: bold;
  color: #555;
  font-size: 14px;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 12px 15px;
}

.table-row:last-child {
  border-bottom: none;
}

.td {
  font-size: 14px;
  color: #333;
}

.th-id, .td-id {
  width: 40px;
}

.th-name, .td-name {
  flex: 2;
}

.th-capacity, .td-capacity {
  flex: 1;
}

.th-equipment, .td-equipment {
  flex: 2;
}

.th-status, .td-status {
  flex: 1;
  display: flex;
  align-items: center;
}

.th-action, .td-action {
  width: 90px;
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

.btn-delete {
  background-color: #e74c3c;
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

.badge-warning {
  background-color: #f39c12;
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
  /* 如果您使用了其他图标库，请相应调整 */
}
</style> 