<template>
  <view class="meeting-list-container">
    <!-- 过滤条件 -->
    <view class="filter-bar">
      <view class="filter-item">
        <text class="filter-label">日期</text>
        <picker mode="date" :value="filterDate" @change="dateChange" class="filter-picker">
          <view class="picker-value">
            <text v-if="filterDate">{{filterDate}}</text>
            <text v-else class="placeholder">选择日期</text>
          </view>
        </picker>
      </view>
      
      <view class="filter-item">
        <text class="filter-label">时间段</text>
        <picker :value="timeRangeIndex" :range="timeRangeOptions" range-key="label" @change="timeRangeChange" class="filter-picker">
          <view class="picker-value">
            {{timeRangeOptions[timeRangeIndex].label}}
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
    
    <!-- 会议列表 -->
    <view class="meeting-list" v-if="meetings.length > 0">
      <view class="table">
        <view class="table-header">
          <text class="th th-id">ID</text>
          <text class="th th-title">会议名称</text>
          <text class="th th-room">会议室</text>
          <text class="th th-time">时间</text>
          <text class="th th-user">预约人</text>
          <text class="th th-status">状态</text>
          <text class="th th-action">操作</text>
        </view>
        
        <view class="table-body">
          <view class="table-row" v-for="(meeting, index) in meetings" :key="index">
            <text class="td td-id">{{meeting.id}}</text>
            <text class="td td-title">{{meeting.title}}</text>
            <text class="td td-room">{{meeting.room}}</text>
            <text class="td td-time">{{meeting.time}}</text>
            <text class="td td-user">{{meeting.user}}</text>
            <view class="td td-status">
              <text class="badge" :class="getStatusClass(meeting.status)">{{meeting.statusText}}</text>
            </view>
            <view class="td td-action">
              <view class="action-buttons">
                <button class="btn-icon btn-view" @click="navigateToDetail(meeting.id)">
                  <text class="iconfont icon-eye"></text>
                </button>
                <button v-if="meeting.status === 'pending'" class="btn-icon btn-approve" @click="handleApprove(meeting)">
                  <text class="iconfont icon-check"></text>
                </button>
                <button v-if="meeting.status === 'pending'" class="btn-icon btn-reject" @click="handleReject(meeting)">
                  <text class="iconfont icon-close"></text>
                </button>
                <button v-if="meeting.status === 'approved'" class="btn-icon btn-cancel" @click="handleCancel(meeting)">
                  <text class="iconfont icon-ban"></text>
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
      <text class="empty-text">暂无会议数据</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      filterDate: '',
      timeRangeIndex: 0,
      statusIndex: 0,
      timeRangeOptions: [
        { label: '全部时间', value: '' },
        { label: '上午 (8:00-12:00)', value: 'morning' },
        { label: '下午 (13:00-18:00)', value: 'afternoon' },
        { label: '晚上 (18:00-22:00)', value: 'evening' }
      ],
      statusOptions: [
        { label: '全部状态', value: '' },
        { label: '待审批', value: 'pending' },
        { label: '已通过', value: 'approved' },
        { label: '已拒绝', value: 'rejected' },
        { label: '已取消', value: 'cancelled' }
      ],
      meetings: [
        {
          id: 1,
          title: '项目启动会议',
          room: '会议室A',
          time: '2023-07-20 09:30-11:00',
          user: '张三',
          status: 'pending',
          statusText: '待审批'
        },
        {
          id: 2,
          title: '团队周会',
          room: '会议室B',
          time: '2023-07-20 14:00-15:30',
          user: '李四',
          status: 'approved',
          statusText: '已通过'
        },
        {
          id: 3,
          title: '产品评审会议',
          room: '会议室C',
          time: '2023-07-21 10:00-12:00',
          user: '王五',
          status: 'rejected',
          statusText: '已拒绝'
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
  onLoad(options) {
    // 处理URL参数，比如status=pending
    if (options && options.status) {
      const statusIndex = this.statusOptions.findIndex(item => item.value === options.status);
      if (statusIndex !== -1) {
        this.statusIndex = statusIndex;
      }
    }
    
    this.fetchMeetingList();
  },
  onPullDownRefresh() {
    this.fetchMeetingList();
  },
  methods: {
    fetchMeetingList() {
      // 这里应该从API获取会议列表数据，根据筛选条件筛选
      uni.showLoading({
        title: '加载中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        uni.stopPullDownRefresh();
        
        // 实际项目中，这里应该调用API获取数据
        // 这里只做前端筛选模拟
        if (this.statusOptions[this.statusIndex].value) {
          const status = this.statusOptions[this.statusIndex].value;
          this.meetings = [
            {
              id: 1,
              title: '项目启动会议',
              room: '会议室A',
              time: '2023-07-20 09:30-11:00',
              user: '张三',
              status: 'pending',
              statusText: '待审批'
            },
            {
              id: 2,
              title: '团队周会',
              room: '会议室B',
              time: '2023-07-20 14:00-15:30',
              user: '李四',
              status: 'approved',
              statusText: '已通过'
            },
            {
              id: 3,
              title: '产品评审会议',
              room: '会议室C',
              time: '2023-07-21 10:00-12:00',
              user: '王五',
              status: 'rejected',
              statusText: '已拒绝'
            }
          ].filter(m => m.status === status);
        }
      }, 500);
    },
    dateChange(e) {
      this.filterDate = e.detail.value;
      this.fetchMeetingList();
    },
    timeRangeChange(e) {
      this.timeRangeIndex = e.detail.value;
      this.fetchMeetingList();
    },
    statusChange(e) {
      this.statusIndex = e.detail.value;
      this.fetchMeetingList();
    },
    navigateToDetail(id) {
      uni.navigateTo({
        url: `/pages/admin/meeting/detail?id=${id}`
      });
    },
    handleApprove(meeting) {
      uni.showModal({
        title: '确认通过',
        content: `确定要通过"${meeting.title}"的会议申请吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            // 模拟网络请求
            setTimeout(() => {
              uni.hideLoading();
              
              // 实际项目中应该调用接口更新数据
              // 这里只做前端更新模拟
              const index = this.meetings.findIndex(m => m.id === meeting.id);
              if (index !== -1) {
                this.meetings[index].status = 'approved';
                this.meetings[index].statusText = '已通过';
              }
              
              uni.showToast({
                title: '已通过审批',
                icon: 'success'
              });
            }, 500);
          }
        }
      });
    },
    handleReject(meeting) {
      uni.showModal({
        title: '确认拒绝',
        content: `确定要拒绝"${meeting.title}"的会议申请吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            // 模拟网络请求
            setTimeout(() => {
              uni.hideLoading();
              
              // 实际项目中应该调用接口更新数据
              // 这里只做前端更新模拟
              const index = this.meetings.findIndex(m => m.id === meeting.id);
              if (index !== -1) {
                this.meetings[index].status = 'rejected';
                this.meetings[index].statusText = '已拒绝';
              }
              
              uni.showToast({
                title: '已拒绝申请',
                icon: 'success'
              });
            }, 500);
          }
        }
      });
    },
    handleCancel(meeting) {
      uni.showModal({
        title: '确认取消',
        content: `确定要取消"${meeting.title}"的会议吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            // 模拟网络请求
            setTimeout(() => {
              uni.hideLoading();
              
              // 实际项目中应该调用接口更新数据
              // 这里只做前端更新模拟
              const index = this.meetings.findIndex(m => m.id === meeting.id);
              if (index !== -1) {
                this.meetings[index].status = 'cancelled';
                this.meetings[index].statusText = '已取消';
              }
              
              uni.showToast({
                title: '已取消会议',
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
      this.fetchMeetingList();
    },
    getStatusClass(status) {
      const statusMap = {
        'pending': 'badge-warning',
        'approved': 'badge-success',
        'rejected': 'badge-danger',
        'cancelled': 'badge-secondary'
      };
      return statusMap[status] || 'badge-secondary';
    }
  }
}
</script>

<style>
.meeting-list-container {
  padding: 15px;
  background-color: #f5f7fa;
  min-height: 100vh;
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

.placeholder {
  color: #999;
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
}

.th-id, .td-id {
  width: 40px;
}

.th-title, .td-title {
  flex: 2;
}

.th-room, .td-room {
  flex: 1;
}

.th-time, .td-time {
  flex: 2;
}

.th-user, .td-user {
  flex: 1;
}

.th-status, .td-status {
  flex: 1;
  display: flex;
  align-items: center;
}

.th-action, .td-action {
  width: 100px;
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

.btn-view {
  background-color: #3498db;
  color: white;
}

.btn-approve {
  background-color: #2ecc71;
  color: white;
}

.btn-reject {
  background-color: #e74c3c;
  color: white;
}

.btn-cancel {
  background-color: #f39c12;
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
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
  }
  
  .filter-item {
    width: 100%;
  }
}
</style> 