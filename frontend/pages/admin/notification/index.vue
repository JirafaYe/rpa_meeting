<template>
  <admin-layout title="通知中心" active-path="/pages/admin/notification/index">
    <div class="notification-page">

      
      <!-- 通知列表区域 -->
      <div class="notification-list-section" v-if="paginatedNotifications.length > 0">
        <div class="notification-list">
          <div 
            class="notification-item" 
            v-for="(notification, index) in paginatedNotifications" 
            :key="notification.id"
            @click="showNotificationDetail(notification)"
          >
            <div class="notification-icon" :class="getIconClass(notification.icon)">
              <span class="iconfont" :class="notification.icon"></span>
            </div>
            <div class="notification-content">
              <div class="notification-header">
                <div class="notification-title">{{notification.title}}</div>
                <div class="notification-time">{{notification.time}}</div>
              </div>
              <div class="notification-message">{{notification.message}}</div>
              <div class="notification-actions">
                <span class="action-link" @click.stop="deleteNotification(notification)">删除</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页控制 -->
        <div class="pagination" v-if="totalPages > 1">
          <div class="pagination-info">共 {{totalItems}} 条通知，第 {{currentPage}}/{{totalPages}} 页</div>
          <div class="pagination-controls">
            <button 
              class="pagination-btn" 
              :class="{'disabled': currentPage === 1}"
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
            >
			  上一页
            </button>
            
            <div class="page-numbers">
              <div 
                v-for="page in displayedPages" 
                :key="page" 
                class="page-number"
                :class="{'active': currentPage === page}"
                @click="goToPage(page)"
              >
                {{page}}
              </div>
            </div>
            
            <button 
              class="pagination-btn" 
              :class="{'disabled': currentPage === totalPages}"
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
			  下一页
            </button>
          </div>
        </div>
      </div>
      
      <!-- 加载中状态 -->
      <div class="loading-state" v-else-if="loading">
        <span class="iconfont icon-loading loading-icon"></span>
        <span class="loading-text">加载中...</span>
      </div>
      
      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <span class="iconfont icon-empty"></span>
        <span class="empty-text">暂无通知</span>
      </div>
      
      <!-- 通知详情弹窗 -->
      <div class="notification-detail-modal" v-if="showDetailModal">
        <div class="modal-overlay" @click="closeDetailModal"></div>
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">通知详情</div>
            <div class="modal-close" @click="closeDetailModal">×</div>
          </div>
          <div class="modal-body">
            <div class="detail-item">
              <div class="detail-label">标题</div>
              <div class="detail-value">{{currentNotification.title}}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">内容</div>
              <div class="detail-value detail-message">{{currentNotification.message}}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">时间</div>
              <div class="detail-value">{{currentNotification.time}}</div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn close-btn" @click="closeDetailModal">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import api from '../../../api/index'
import apiRequest from '../../../api/api'
import AdminLayout from '../../../components/admin/AdminLayout.vue'

export default {
  components: {
    AdminLayout
  },
  data() {
    return {
      loading: false,
      searchQuery: '',
      notifications: [], // 所有通知数据
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      showDetailModal: false,
      currentNotification: {}
    }
  },
  computed: {
    // 过滤后的通知
    filteredNotifications() {
      return this.notifications || [];
    },
    // 分页后的通知
    paginatedNotifications() {
      return this.filteredNotifications;
    },
    // 总页数
    totalPages() {
      return Math.ceil(this.totalCount / this.pageSize);
    },
    // 总条目数
    totalItems() {
      return this.totalCount;
    },
    // 显示的页码数组
    displayedPages() {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (this.totalPages <= maxVisiblePages) {
        // 总页数少于等于最大可见页码数，显示所有页码
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 总页数大于最大可见页码数
        if (this.currentPage <= 3) {
          // 当前页靠近开头
          for (let i = 1; i <= Math.min(maxVisiblePages, this.totalPages); i++) {
            pages.push(i);
          }
        } else if (this.currentPage >= this.totalPages - 2) {
          // 当前页靠近结尾
          for (let i = this.totalPages - maxVisiblePages + 1; i <= this.totalPages; i++) {
            pages.push(i);
          }
        } else {
          // 当前页在中间位置
          for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
            pages.push(i);
          }
        }
      }
      
      return pages;
    }
  },
  created() {
    this.fetchNotifications();
  },
  methods: {
    // 获取通知数据
    async fetchNotifications() {
      this.loading = true;
      
      try {
        // 确定要获取的通知类型
        let pageNo = this.currentPage;
        let pageSize = this.pageSize;
        let isAsc = false; // 按时间倒序
        let sortBy = 'id';
        
        // 调用API获取通知列表
        const response = await apiRequest.getNotifications(pageNo, pageSize, isAsc, sortBy);
        
        if (response.code === 200 && response.data) {
          console.log('获取通知成功:', response.data);
          
          let notificationList = response.data.list || [];
          
          // 格式化通知数据
          this.notifications = notificationList.map(item => ({
            id: item.id,
            title: item.title || '系统通知',
            message: item.content || item.message || '',
            time: item.createTime || item.time || '',
            icon: this.getIconByType(item.type || 'system')
          }));
          
          // 更新总数量
          this.totalCount = response.data.total || 0;
        } else {
          uni.showToast({
            title: response.message || '获取通知失败',
            icon: 'none'
          });
          this.notifications = [];
          this.totalCount = 0;
        }
      } catch (error) {
        console.error('获取通知失败:', error);
        uni.showToast({
          title: '获取通知失败',
          icon: 'none'
        });
        this.notifications = [];
        this.totalCount = 0;
      } finally {
        this.loading = false;
      }
    },
    // 根据通知类型获取图标
    getIconByType(type) {
      const iconMap = {
        'system': 'icon-notification',
        'meeting': 'icon-meeting',
        'security': 'icon-security',
        'user': 'icon-user',
        'default': 'icon-notification'
      };
      return iconMap[type] || iconMap.default;
    },
    async confirmClearAll() {
      try {
        await uni.showModal({
          title: '确认清空',
          content: '确定要清空所有通知吗？此操作不可恢复。',
        });
        
        // 实际项目中应该调用清空API
        uni.showToast({
          title: '清空通知功能暂未实现',
          icon: 'none'
        });
      } catch (error) {
        if (error.errMsg !== 'showModal:fail cancel') {
            uni.showToast({
            title: '操作失败',
            icon: 'none'
            });
          }
        }
    },
    async deleteNotification(notification) {
      try {
        await uni.showModal({
          title: '确认删除',
          content: '确定要删除这条通知吗？',
        });
        
        // 实际项目中应该调用删除API
        uni.showToast({
          title: '删除通知功能暂未实现',
          icon: 'none'
        });
      } catch (error) {
        if (error.errMsg !== 'showModal:fail cancel') {
            uni.showToast({
            title: '删除失败',
            icon: 'none'
            });
          }
        }
    },
    async showNotificationDetail(notification) {
      try {
        // 显示加载提示
        uni.showLoading({
          title: '加载中...'
        });
        
        // 使用ID调用接口获取详细信息
        const response = await apiRequest.adminGetNotification(notification.id);
        
        if (response && response.code === 200 && response.data) {
          // 格式化通知详情数据
          this.currentNotification = {
            id: response.data.id,
            title: response.data.title || notification.title || '系统通知',
            message: response.data.content || response.data.message || notification.message || '',
            time: response.data.createTime || response.data.time || notification.time || '',
            icon: this.getIconByType(response.data.type || notification.type || 'system')
          };
          
          // 显示弹窗
          this.showDetailModal = true;
        } else {
          // 接口调用失败，使用列表中的数据
          this.currentNotification = { ...notification };
          this.showDetailModal = true;
          
      uni.showToast({
            title: '获取详情失败，显示简略信息',
        icon: 'none'
      });
        }
      } catch (error) {
        console.error('获取通知详情失败:', error);
        // 发生错误时，使用列表中的数据
        this.currentNotification = { ...notification };
        this.showDetailModal = true;
      
      uni.showToast({
          title: '获取详情失败，显示简略信息',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    closeDetailModal() {
      this.showDetailModal = false;
    },
    handleNotificationClick(notification) {
      this.showNotificationDetail(notification);
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) {
        return;
      }
      
      this.currentPage = page;
      this.fetchNotifications();
    },
    getIconClass(icon) {
      // 根据不同类型图标返回不同样式类
      const classMap = {
        'icon-notification': 'icon-blue',
        'icon-meeting': 'icon-green',
        'icon-security': 'icon-red',
        'icon-user': 'icon-purple'
      };
      
      return classMap[icon] || 'icon-default';
    }
  }
}
</script>

<style scoped>
.notification-page {
  padding: 20px 0;
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 16px 20px;
  margin-bottom: 24px;
}

.filter-section {
  display: flex;
  gap: 16px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border: none;
}

.action-btn.mark {
  background-color: #e6f7ff;
  color: #1890ff;
}

.action-btn.mark:hover {
  background-color: #bae7ff;
}

.action-btn.clear {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.action-btn.clear:hover {
  background-color: #ffccc7;
}

.action-btn .iconfont {
  margin-right: 6px;
  font-size: 16px;
}

.notification-list-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.notification-list {
  padding: 0;
}

.notification-item {
  display: flex;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
  cursor: pointer;
}

.notification-item:hover {
  background-color: #f5f7fa;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon .iconfont {
  font-size: 20px;
  color: #fff;
}

.icon-info {
  background-color: #1890ff;
}

.icon-success {
  background-color: #52c41a;
}

.icon-warning {
  background-color: #fa8c16;
}

.icon-error {
  background-color: #ff4d4f;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.notification-title {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 16px;
}

.notification-time {
  font-size: 13px;
  color: #8c8c8c;
  white-space: nowrap;
}

.notification-message {
  font-size: 14px;
  color: #595959;
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification-actions {
  display: flex;
  justify-content: flex-end;
}

.action-link {
  font-size: 13px;
  color: #1890ff;
  cursor: pointer;
  transition: all 0.3s;
}

.action-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  gap: 16px;
}

.pagination-info {
  font-size: 14px;
  color: #8c8c8c;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.pagination-btn {
  height: 32px;
  padding: 0 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  color: #262626;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-btn:hover:not(.disabled) {
  color: #1890ff;
  border-color: #1890ff;
}

.pagination-btn.disabled {
  color: #d9d9d9;
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  margin: 0 8px;
}

.page-number {
  min-width: 32px;
  height: 32px;
  margin: 0 4px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  color: #262626;
  display: flex;
  align-items: center;
  justify-content: center;
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

.empty-state,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.iconfont.icon-empty,
.loading-icon {
  font-size: 60px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

.empty-text,
.loading-text {
  font-size: 14px;
  color: #8c8c8c;
}

.notification-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 500px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: modalFadeIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.modal-close {
  font-size: 20px;
  color: #8c8c8c;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-close:hover {
  color: #ff4d4f;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.detail-item {
  margin-bottom: 16px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.detail-value {
  font-size: 14px;
  color: #262626;
  line-height: 1.5;
}

.detail-message {
  white-space: pre-line;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.modal-btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn {
  border: 1px solid #d9d9d9;
  background-color: #fff;
  color: #262626;
}

.close-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .action-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .filter-section {
    width: 100%;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: space-between;
  }

  .notification-item {
    flex-direction: column;
  }

  .notification-icon {
    margin-bottom: 12px;
    margin-right: 0;
  }
  
  .notification-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .notification-title {
    margin-bottom: 4px;
    margin-right: 0;
  }
  
  .pagination {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 576px) {
  .page-numbers {
    display: none;
  }
  
  .pagination-info {
    font-size: 13px;
  }

  .modal-content {
    width: 95%;
  }
}
</style>