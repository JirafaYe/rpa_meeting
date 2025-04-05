<template>
  <admin-layout 
    title="会议管理" 
    description="查看和管理所有会议预约，可进行审批和取消操作"
    active-path="/pages/admin/meeting/list">
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
                  <button class="btn btn-view" @click="navigateToDetail(meeting.id)">
                    <text class="btn-text">查看</text>
                  </button>
                  <button v-if="meeting.status === '待审核'" class="btn btn-approve" @click="handleApprove(meeting)">
                    <text class="btn-text">通过</text>
                  </button>
                  <button v-if="meeting.status === '待审核'" class="btn btn-reject" @click="handleReject(meeting)">
                    <text class="btn-text">拒绝</text>
                  </button>
                  <button v-if="meeting.status === '已通过'" class="btn btn-cancel" @click="handleCancel(meeting)">
                    <text class="btn-text">取消</text>
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
        <text class="empty-text">暂无会议数据</text>
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
      filterDate: '',
      timeRangeIndex: 0,
      statusIndex: 0,
      timeRangeOptions: [
        { label: '全部时间', value: '', startValue: '00:00:00', endValue: '23:59:59' },
        { label: '上午 (0:00:00-12:00:00)', value: 'morning', startValue: '00:00:00', endValue: '12:00:00' },
        { label: '下午 (13:00:00-18:00:00)', value: 'afternoon', startValue: '13:00:00', endValue: '18:00:00' },
        { label: '晚上 (18:00:00-24:00:00)', value: 'evening', startValue: '18:00:00', endValue: '23:59:59' }
      ],
      statusOptions: [
        { label: '全部状态', value: '' },
        { label: '待审核', value: '待审核' },
        { label: '已通过', value: '已通过' },
        { label: '已拒绝', value: '拒绝' },
        { label: '已取消', value: '取消' }
      ],
      meetings: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false
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
      this.loading = true;
      uni.showLoading({
        title: '加载中...'
      });
      
      // 构建查询参数
      const params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      
      // 调用API获取会议列表
      api.meeting.getMeetings(params)
        .then(res => {
          if (res && res.code === 200 && res.data) {
            // 处理数据
            if (res.data) {
              // 实现筛选
              const filteredMeetings = res.data.filter(meeting => {
                // 日期筛选
                if (this.filterDate) {
                  const meetingDate = new Date(meeting.reserveDate);
                  const filterDate = new Date(this.filterDate);
                  if (meetingDate.toDateString() !== filterDate.toDateString()) {
                    return false;
                  }
                }
                
                // 时间段筛选
                if (this.timeRangeIndex > 0) {
                  const meetingTime = new Date(`${meeting.reserveDate} ${meeting.startTime}`);
                  const timeRange = this.timeRangeOptions[this.timeRangeIndex];
                  
                  // 创建开始和结束时间
                  const startTime = new Date(`${meeting.reserveDate} ${timeRange.startValue}`);
                  const endTime = new Date(`${meeting.reserveDate} ${timeRange.endValue}`);
                  
                  // 检查会议时间是否在选定范围内
                  if (meetingTime < startTime || meetingTime > endTime) {
                    return false;
                  }
                }
                
                // 状态筛选
        if (this.statusOptions[this.statusIndex].value) {
                  if (meeting.status !== this.statusOptions[this.statusIndex].value) {
                    return false;
                  }
                } 
                return true;
              });
              // 当前筛选条件
              const currentFilter = {
                date: this.filterDate,
                timeRange: this.timeRangeOptions[this.timeRangeIndex].value,
                status: this.statusOptions[this.statusIndex].value
              };
              console.log('当前筛选条件:', currentFilter);
              
              // 标准分页格式
              this.meetings = filteredMeetings.map(this.formatMeeting);
              this.total = filteredMeetings.length;
            }
            console.log('获取到的会议列表:', this.meetings);
          } else {
            console.warn('获取会议列表失败:', res);
            this.meetings = [];
            this.total = 0;
            uni.showToast({
              title: res?.message || '获取会议列表失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取会议列表异常:', err);
          this.meetings = [];
          this.total = 0;
          uni.showToast({
            title: '获取会议列表失败，请稍后重试',
            icon: 'none'
          });
        })
        .finally(() => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          this.loading = false;
        });
    },
    
    // 格式化会议数据
    formatMeeting(meeting) {
      return {
        id: meeting.id,
        title: meeting.topic || '未命名会议',
        room: meeting.room || '未知会议室',
        time: `${meeting.reserveDate || ''} ${meeting.startTime || ''} - ${meeting.endTime || ''}`,
        user: meeting.booker || meeting.creator || '未知预约人',
        status: meeting.status,
        statusText: this.getStatusText(meeting.status)
      };
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusTextMap = {
        '待审核': '待审核',
        '已通过': '已通过',
        '已拒绝': '已拒绝',
        '已取消': '已取消'
      };
      return statusTextMap[status] || status;
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
            
            // 调用API通过会议申请
            api.meeting.approveReservation(meeting.id, true)
              .then(res => {
                if (res && res.code === 200) {
              uni.showToast({
                title: '已通过审批',
                icon: 'success'
              });
                  // 刷新列表
                  this.fetchMeetingList();
                } else {
                  uni.showToast({
                    title: res?.msg ,
                    icon: 'none'
                  });
                }
              })
              .catch(err => {
                console.error('审批失败:', err);
                uni.showToast({
                  title: '审批失败，请稍后重试',
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
    handleReject(meeting) {
      uni.showModal({
        title: '确认拒绝',
        content: `确定要拒绝"${meeting.title}"的会议申请吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            // 调用API拒绝会议申请
            api.meeting.approveReservation(meeting.id, false)
              .then(res => {
                if (res && res.code === 200) {
              uni.showToast({
                title: '已拒绝申请',
                icon: 'success'
              });
                  // 刷新列表
                  this.fetchMeetingList();
                } else {
                  uni.showToast({
                    title: res?.msg ,
                    icon: 'none'
                  });
                }
              })
              .catch(err => {
                console.error('拒绝失败:', err);
                uni.showToast({
                  title: '拒绝失败，请稍后重试',
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
    handleCancel(meeting) {
      uni.showModal({
        title: '确认取消',
        content: `确定要取消"${meeting.title}"的会议吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            // 调用API取消会议
            api.meeting.adminCancelMeeting(meeting.id)
              .then(res => {
                if (res && res.code === 200) {
              uni.showToast({
                title: '已取消会议',
                icon: 'success'
              });
                  // 刷新列表
                  this.fetchMeetingList();
                } else {
                  uni.showToast({
                    title: res?.msg,
                    icon: 'none'
                  });
                }
              })
              .catch(err => {
                console.error('取消失败:', err);
                uni.showToast({
                  title: '取消失败，请稍后重试',
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
      this.fetchMeetingList();
    },
    getStatusClass(status) {
      const statusMap = {
        '待审核': 'badge-warning',
        '已通过': 'badge-success',
        '已拒绝': 'badge-danger',
        '已取消': 'badge-secondary'
      };
      return statusMap[status] || 'badge-secondary';
    }
  }
}
</script>

<style scoped>
.meeting-list-container {
  padding: 24px 0;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #f0f7ff 0%, #f9fcff 100%);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03), 0 6px 12px rgba(0, 0, 0, 0.02);
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(240, 240, 240, 0.8);
  transition: all 0.3s ease;
}

.filter-bar:hover {
  box-shadow: 0 15px 35px rgba(24, 144, 255, 0.08), 0 8px 16px rgba(24, 144, 255, 0.05);
  transform: translateY(-2px);
}

.filter-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #40a9ff, #9254de);
}

.filter-item {
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  position: relative;
  padding-left: 12px;
}

.filter-label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 14px;
  background: linear-gradient(to bottom, #40a9ff, #9254de);
  border-radius: 4px;
}

.filter-picker {
  background-color: #fff;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.01);
}

.filter-picker:hover {
  border-color: #40a9ff;
  box-shadow: 0 3px 8px rgba(24, 144, 255, 0.15);
}

.picker-value {
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  font-size: 14px;
  color: #262626;
}

.placeholder {
  color: #bfbfbf;
}

.meeting-list {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03), 0 6px 12px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  border: 1px solid rgba(240, 240, 240, 0.8);
  transition: all 0.3s ease;
  position: relative;
}

.meeting-list:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05), 0 8px 16px rgba(0, 0, 0, 0.04);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table-header, .table-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.th, .td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  flex: 1;
}

.th-id, .td-id { flex: 0 0 80px; }
.th-title, .td-title { flex: 0 0 200px; }
.th-room, .td-room { flex: 0 0 120px; }
.th-time, .td-time { flex: 0 0 150px; }
.th-user, .td-user { flex: 0 0 120px; }
.th-status, .td-status { flex: 0 0 100px; }
.th-action, .td-action { flex: 0 0 200px; }

.table-row {
  transition: background-color 0.3s;
}

.table-row:hover {
  background-color: #f5f7fa;
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  min-height: 34px;
}

.btn {
  min-width: 72px;
  width: 72px;
  height: 34px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  flex: 0 0 auto;
  margin: 0;
  padding: 0;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%) scale(0);
  border-radius: 50%;
  transition: all 0.4s ease;
}

.btn:active::before {
  transform: translate(-50%, -50%) scale(2);
  opacity: 0;
}

.btn-view {
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  color: #1890ff;
}

.btn-view:hover {
  background: linear-gradient(135deg, #bae7ff 0%, #91caff 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(24, 144, 255, 0.2);
}

.btn-approve {
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
  color: #52c41a;
}

.btn-approve:hover {
  background: linear-gradient(135deg, #d9f7be 0%, #b7eb8f 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(82, 196, 26, 0.2);
}

.btn-reject {
  background: linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%);
  color: #f5222d;
}

.btn-reject:hover {
  background: linear-gradient(135deg, #ffccc7 0%, #ffa39e 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(245, 34, 45, 0.2);
}

.btn-cancel {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  color: #8c8c8c;
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #e8e8e8 0%, #d9d9d9 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.btn-text {
  font-size: 13px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 22px 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #fafafa 100%);
  border-top: 1px solid #f0f0f0;
  gap: 10px;
}

.page-btn {
  height: 38px;
  padding: 0 16px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #fff;
}

.page-btn:not(.disabled):hover {
  color: #1890ff;
  border-color: #1890ff;
  background-color: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.15);
}

.page-btn.disabled {
  color: #d9d9d9;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.page-number {
  width: 38px;
  height: 38px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #fff;
}

.page-number:hover {
  color: #1890ff;
  border-color: #1890ff;
  background-color: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.15);
}

.page-number.active {
  color: #fff;
  border-color: #1890ff;
  background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(24, 144, 255, 0.25);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  background: linear-gradient(135deg, #fff 0%, #f9fafb 100%);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03), 0 6px 12px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(240, 240, 240, 0.8);
  transition: all 0.3s ease;
}

.empty-state .iconfont {
  font-size: 70px;
  color: #d9d9d9;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: #8c8c8c;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .filter-item {
    min-width: 200px;
  }
  
  .th, .td {
    padding: 16px 18px;
  }
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }
  
  .filter-item {
    width: 100%;
  }
  
  .meeting-list {
    overflow-x: auto;
  }
  
  .table {
    width: 900px;
    min-width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .btn {
    width: 100%;
  }
  
  .pagination {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 576px) {
  .meeting-list-container {
    padding: 16px 0;
  }
  
  .filter-bar {
    padding: 16px;
  }
  
  .th, .td {
    padding: 14px;
  }
  
  .pagination {
    padding: 18px;
  }
  
  .page-number:not(.active) {
    display: none;
  }
}

.td-action {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 16px !important;
}
</style> 