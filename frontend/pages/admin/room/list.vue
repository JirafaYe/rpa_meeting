<template>
  <admin-layout title="会议室管理" active-path="/pages/admin/room/list">
    <view class="room-list-container">
      <!-- 搜索和添加按钮区域 -->
      <view class="action-bar">
        <view class="search-box">
          <input type="text" class="search-input" v-model="searchText" placeholder="搜索会议室..." @confirm="handleSearch" />
        </view>
        <button class="add-btn" @click="navigateToEdit()">
          添加会议室
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
                  <button class="btn btn-edit" @click="navigateToEdit(room.id)">
                    <text class="btn-text">编辑</text>
                  </button>
                  <button class="btn btn-delete" @click="handleDeleteRoom(room)">
                    <text class="btn-text">删除</text>
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
			上一页
          </view>
          <view class="page-number" :class="{active: currentPage === page}" v-for="page in totalPages" :key="page" @click="handlePageChange(page)">
            {{page}}
          </view>
          <view class="page-btn" :class="{disabled: currentPage === totalPages}" @click="handlePageChange(currentPage + 1)">
            <text class="iconfont icon-right"></text>
			下一页
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
  </admin-layout>
</template>

<script>
import AdminLayout from '../../../components/admin/AdminLayout.vue'
import api from '../../../api/index.js'

export default {
  components: {
    AdminLayout
  },
  data() {
    return {
      searchText: '',
      allRooms: [], // 存储所有会议室数据
      rooms: [], // 存储过滤后的会议室数据
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    },
    // 计算过滤后的会议室列表
    filteredRooms() {
      if (!this.searchText) {
        return this.allRooms;
      }
      const searchLower = this.searchText.toLowerCase();
      return this.allRooms.filter(room => 
        room.name.toLowerCase().includes(searchLower) ||
        room.equipment.toLowerCase().includes(searchLower) ||
        room.description.toLowerCase().includes(searchLower)
      );
    },
    // 计算当前页的会议室列表
    paginatedRooms() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredRooms.slice(start, end);
    }
  },
  watch: {
    // 监听搜索文本变化，实时过滤
    searchText: {
      handler(newVal) {
        this.currentPage = 1; // 重置到第一页
        this.updateRoomsList();
      }
    },
    // 监听分页变化
    currentPage: {
      handler() {
        this.updateRoomsList();
      }
    }
  },
  onLoad() {
    this.fetchRoomList();
  },
  onPullDownRefresh() {
    this.fetchRoomList();
  },
  methods: {
    // 更新显示的会议室列表
    updateRoomsList() {
      this.rooms = this.paginatedRooms;
      this.total = this.filteredRooms.length;
    },
    fetchRoomList() {
      // 从API获取会议室列表数据
      this.loading = true;
      uni.showLoading({
        title: '加载中...'
      });
      
      // 调用API获取所有会议室列表
      api.room.getRooms(1, 1000, true, 'id')
        .then(res => {
          if (res && res.code === 200 && res.data) {
            // 处理数据
            if (res.data.list) {
              // 标准分页格式
              this.allRooms = res.data.list.map(this.formatRoom);
            } else if (Array.isArray(res.data)) {
              // 数组格式
              this.allRooms = res.data.map(this.formatRoom);
            } else {
              this.allRooms = [];
            }
            this.updateRoomsList();
            console.log('获取到的会议室列表:', this.rooms);
          } else {
            console.warn('获取会议室列表失败:', res);
            this.allRooms = [];
            this.updateRoomsList();
            uni.showToast({
              title: res?.message || '获取会议室列表失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取会议室列表异常:', err);
          this.allRooms = [];
          this.updateRoomsList();
          uni.showToast({
            title: '获取会议室列表失败，请稍后重试',
            icon: 'none'
          });
        })
        .finally(() => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          this.loading = false;
        });
    },
    
    // 格式化会议室数据
    formatRoom(room) {
      // 获取状态文本
      let status = room.status || 'available';
      let statusText = this.getStatusText(status);
      
      return {
        id: room.id,
        name: room.name || '未命名会议室',
        capacity: room.capacity || 0,
        equipment: room.equipment || '无',
        status: status,
        statusText: statusText,
        description: room.description || ''
      };
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'available': '可用',
        'maintenance': '维护中',
        'busy': '使用中',
        'reserved': '已预约'
      };
      return statusMap[status] || status;
    },
    handleSearch() {
      // 搜索会议室 - 现在由watch处理
      this.currentPage = 1; // 重置到第一页
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
            
            // 调用API删除会议室
            api.room.deleteRoom(room.id)
              .then(res => {
                if (res && res.code === 200) {
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });
                  // 重新获取列表
                  this.fetchRoomList();
                } else {
                  uni.showToast({
                    title: res?.message || '删除失败',
                    icon: 'none'
                  });
                }
              })
              .catch(err => {
                console.error('删除会议室失败:', err);
                uni.showToast({
                  title: '删除失败，请稍后重试',
                  icon: 'none'
                });
              })
              .finally(() => {
                uni.hideLoading();
              });
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

<style scoped>
.room-list-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 24px;
  min-height: 480px;
  position: relative;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

.search-box {
  flex: 1;
  display: flex;
  position: relative;
  max-width: 420px;
}

.search-input {
  width: 100%;
  height: 40px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 0 16px;
  font-size: 14px;
  color: #333;
  background-color: #f9f9f9;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #1890ff;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.search-button {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1890ff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  color: white;
  transition: all 0.3s;
}

.search-button:hover {
  background-color: #40a9ff;
}

.add-btn {
  height: 40px;
  padding: 0 20px;
  background: linear-gradient(90deg, #1890ff, #096dd9);
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn:hover {
  background: linear-gradient(90deg, #40a9ff, #1890ff);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transform: translateY(-2px);
}

.room-list {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  display: flex;
  background-color: #fafafa;
  border-radius: 4px;
  border-bottom: 1px solid #f0f0f0;
}

.th {
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #595959;
  font-size: 14px;
  white-space: nowrap;
}

.th-id {
  width: 60px;
}

.th-name {
  flex: 2;
}

.th-capacity {
  width: 100px;
}

.th-equipment {
  flex: 3;
}

.th-status {
  width: 100px;
}

.th-action {
  width: 160px;
  text-align: center;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.table-row:hover {
  background-color: #f5f7fa;
}

.td {
  padding: 14px 12px;
  font-size: 14px;
  color: #262626;
  display: flex;
  align-items: center;
}

.td-id {
  width: 60px;
  color: #8c8c8c;
}

.td-name {
  flex: 2;
  font-weight: 500;
}

.td-capacity {
  width: 100px;
}

.td-equipment {
  flex: 3;
  color: #595959;
  word-break: break-word;
}

.td-status {
  width: 100px;
}

.td-action {
  width: 160px;
  justify-content: center;
}

.badge {
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
}

.badge-available {
  background-color: #e6f7ff;
  color: #1890ff;
}

.badge-busy {
  background-color: #fff2e8;
  color: #fa8c16;
}

.badge-maintenance {
  background-color: #fff1f0;
  color: #f5222d;
}

.badge-inactive {
  background-color: #f5f5f5;
  color: #8c8c8c;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  background: transparent;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.btn-edit {
  background-color: #e6f7ff;
  color: #1890ff;
}

.btn-edit:hover {
  background-color: #bae7ff;
}

.btn-delete {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.btn-delete:hover {
  background-color: #ffa39e;
  color: #a8071a;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  gap: 8px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  color: #262626;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(.disabled) {
  color: #1890ff;
  border-color: #1890ff;
}

.page-btn.disabled {
  color: #d9d9d9;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.page-btn .iconfont {
  font-size: 12px;
  margin: 0 4px;
}

.page-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #262626;
  cursor: pointer;
  transition: all 0.3s;
}

.page-number:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.page-number.active {
  background-color: #1890ff;
  color: #fff;
  border-color: #1890ff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #8c8c8c;
}

.empty-state .iconfont {
  font-size: 60px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  margin-bottom: 24px;
}

@media (max-width: 992px) {
  .th-equipment, .td-equipment {
    flex: 1.5;
  }
}

@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: 100%;
    margin-bottom: 10px;
  }
  
  .th-equipment, .td-equipment {
    display: none;
  }
  
  .pagination {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .room-list-container {
    padding: 16px;
  }
  
  .th-capacity, .td-capacity {
    display: none;
  }
  
  .th-status, .td-status {
    width: 80px;
  }
  
  .th-action, .td-action {
    width: 120px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .btn {
    padding: 4px 8px;
  }
}
</style> 