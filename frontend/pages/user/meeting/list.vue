<template>
  <view class="container">
    <view class="header">
      <text class="title">我的会议</text>
    </view>
    
    <view class="tabs">
        <view 
        class="tab" 
        :class="{ active: activeTab === 'initiated' }" 
        @click="activeTab = 'initiated'"
      >
        我发起的
        </view>
      <view 
        class="tab" 
        :class="{ active: activeTab === 'participated' }" 
        @click="activeTab = 'participated'"
      >
        我参与的
      </view>
    </view>
    
    <view class="filter-section">
      <picker class="filter-picker" :value="statusIndex" :range="statusOptions" @change="handleStatusChange">
        <view class="filter-value">
          <text>{{ statusOptions[statusIndex] }}</text>
          <text class="icon-down"></text>
        </view>
      </picker>
      <button class="filter-btn" @click="showFilterModal">
        <text class="icon-filter"></text>
      </button>
    </view>
      
    <scroll-view scroll-y class="meeting-list" v-if="filteredMeetings.length > 0">
        <view 
        class="meeting-card"
        v-for="(meeting, index) in filteredMeetings" 
          :key="index"
        @click="viewMeetingDetail(meeting)"
      >
        <view class="meeting-header">
          <text class="meeting-title">{{ meeting.title }}</text>
          <view class="meeting-status" :class="getStatusClass(meeting.status)">
            {{ getStatusText(meeting.status) }}
          </view>
        </view>
        
        <view class="meeting-info">
          <view class="info-item">
            <text class="icon-calendar"></text>
            <text class="info-text">{{ meeting.date }}</text>
          </view>
          <view class="info-item">
            <text class="icon-time"></text>
            <text class="info-text">{{ getMeetingTime(meeting) }}</text>
          </view>
          <view class="info-item">
            <text class="icon-location"></text>
            <text class="info-text">{{ meeting.room }}</text>
          </view>
          <view class="info-item">
            <text class="icon-user"></text>
            <text class="info-text">参会人数: {{ (meeting.participants || meeting.attendees)?.length || 0 }}人</text>
          </view>
        </view>
        
        <view class="meeting-actions">
          <button class="action-btn primary-btn" @click.stop="viewMeetingDetail(meeting)">查看详情</button>
          <button v-if="canCancel(meeting) && activeTab === 'initiated'" class="action-btn danger-btn" @click.stop="cancelMeeting(meeting)">取消会议</button>
          <button v-if="canReject(meeting) && activeTab === 'participated'" class="action-btn warning-btn" @click.stop="rejectMeeting(meeting)">拒绝参与</button>
        </view>
      </view>
    </scroll-view>
    
    <view class="empty-state" v-else>
      <image class="empty-image" src="/static/images/empty-list.png"></image>
      <text class="empty-text">暂无会议</text>
    </view>
    
    <!-- 筛选弹窗 -->
    <view class="filter-modal" v-if="showFilter">
      <view class="filter-overlay" @click="closeFilterModal"></view>
      <view class="filter-popup">
        <view class="filter-header">
          <text class="filter-title">筛选条件</text>
          <text class="filter-close" @click="closeFilterModal">×</text>
        </view>
        <view class="filter-body">
          <view class="filter-item">
            <text class="filter-label">日期范围</text>
            <view class="date-range">
              <picker mode="date" :value="tempStartDate" @change="onStartDateChange">
                <view class="date-picker">
                  <text>{{ tempStartDate || '开始日期' }}</text>
                </view>
              </picker>
              <text class="date-separator">至</text>
              <picker mode="date" :value="tempEndDate" @change="onEndDateChange">
                <view class="date-picker">
                  <text>{{ tempEndDate || '结束日期' }}</text>
                </view>
              </picker>
            </view>
          </view>
          <view class="filter-item">
            <text class="filter-label">会议室</text>
            <picker :range="roomOptions" :value="tempRoomIndex" @change="onRoomChange">
              <view class="room-picker">
                <text>{{ roomOptions[tempRoomIndex] }}</text>
                <text class="icon-down"></text>
              </view>
            </picker>
          </view>
        </view>
        <view class="filter-footer">
          <button class="filter-reset" @click="resetFilters">重置</button>
          <button class="filter-apply" @click="applyFilters">应用</button>
        </view>
      </view>
    </view>
    
    <!-- 添加自定义底部导航 -->
    <custom-tab-bar></custom-tab-bar>
  </view>
</template>

<script>
import api from '../../../utils/api.js'
// 移除服务层引用
// import { getInitiatedMeetings, getParticipatedMeetings, cancelMeeting, rejectParticipation } from '../../../services/meetingService.js'
// import { MeetingListRequest, MeetingListResponse } from '../../../services/models/meeting.js'
import CustomTabBar from '../../../components/common/CustomTabBar.vue'

export default {
  components: {
    CustomTabBar
  },
  data() {
    return {
      activeTab: 'initiated', // 'initiated'表示我发起的，'participated'表示我参与的
      statusOptions: ['全部状态', '待审批', '已通过', '进行中', '已完成', '已拒绝', '已取消'],
      statusIndex: 0,
      startDate: '',
      endDate: '',
      roomOptions: ['全部会议室', '会议室A', '会议室B', '会议室C'],
      roomIndex: 0,
      showFilter: false, // 控制筛选弹窗显示
      // 会议列表数据
      initiatedMeetings: [],
      participatedMeetings: [],
      // 筛选后的临时变量
      tempStartDate: '',
      tempEndDate: '',
      tempRoomIndex: 0,
      // 加载状态
      loading: false
    }
  },
  onLoad() {
    console.log('会议列表页面加载');
    // 在开发环境中预加载测试数据，确保UI至少有内容显示
    if (process.env.NODE_ENV !== 'production') {
      this.preloadTestData();
    }
    this.fetchMeetingList();
  },
  computed: {
    // 根据当前选项卡和筛选条件获取会议列表
    filteredMeetings() {
      const meetings = this.activeTab === 'initiated' ? this.initiatedMeetings : this.participatedMeetings;
      
      return meetings.filter(meeting => {
        // 状态筛选
        if (this.statusIndex !== 0) {
          const statusMap = { 
            1: 'pending', 
            2: 'approved', 
            3: 'in-progress', 
            4: 'completed', 
            5: 'rejected', 
            6: 'canceled'
          };
          if (meeting.status !== statusMap[this.statusIndex]) {
            return false;
          }
        }
        
        // 日期筛选
        if (this.startDate) {
          const meetingDate = new Date(meeting.date);
          const filterStartDate = new Date(this.startDate);
          if (meetingDate < filterStartDate) {
            return false;
          }
        }
        
        if (this.endDate) {
          const meetingDate = new Date(meeting.date);
          const filterEndDate = new Date(this.endDate);
          if (meetingDate > filterEndDate) {
            return false;
          }
        }
        
        // 会议室筛选
        if (this.roomIndex !== 0) {
          const selectedRoom = this.roomOptions[this.roomIndex];
          if (meeting.room !== selectedRoom) {
            return false;
          }
        }
        
        return true;
      });
    }
  },
  watch: {
    activeTab() {
      // 切换标签时重新获取会议列表
      this.fetchMeetingList();
    }
  },
  methods: {
    // 获取会议列表数据
    fetchMeetingList() {
      this.loading = true;
      uni.showLoading({ title: '加载中...' });
      
      // 直接使用API层获取会议列表
      const params = {
        type: this.activeTab === 'initiated' ? 'initiated' : 'participated'
      };
      
      console.log('开始获取会议列表，参数：', params);
      
      // 添加错误捕获和恢复机制
      try {
        api.meeting.getMeetingList(params)
          .then(res => {
            console.log('会议列表API返回：', res);
            
            if (res.code === 200 && res.data) {
              console.log('会议列表数据：', res.data);
              console.log('会议列表数量：', res.data.list ? res.data.list.length : 0);
              
              // 确保返回的数据格式符合预期
              const meetingList = Array.isArray(res.data.list) ? res.data.list : [];
              console.log('处理后的会议列表：', meetingList);
              
              // 会议列表为空时，显示测试数据
              if (meetingList.length === 0 && process.env.NODE_ENV !== 'production') {
                console.warn('会议列表为空，显示测试数据');
                // 仅在开发环境中使用测试数据
                this.showTestData();
                return;
              }
              
              // 格式化会议数据
              const formattedMeetings = meetingList.map(meeting => {
                // 确保会议数据的格式一致
                return {
                  id: meeting.id,
                  title: meeting.title || '未命名会议',
                  date: meeting.date || (meeting.startTime ? meeting.startTime.split(' ')[0] : '未知日期'),
                  startTime: meeting.startTime ? (meeting.startTime.includes(' ') ? meeting.startTime.split(' ')[1] : meeting.startTime) : '',
                  endTime: meeting.endTime ? (meeting.endTime.includes(' ') ? meeting.endTime.split(' ')[1] : meeting.endTime) : '',
                  status: meeting.status || 'pending',
                  room: meeting.roomName || '未指定',
                  participants: meeting.participants || [],
                  organizer: meeting.organizer || {}
                };
              });
              
              console.log('格式化后的会议数据：', formattedMeetings);
              
              if (this.activeTab === 'initiated') {
                this.initiatedMeetings = formattedMeetings;
              } else {
                this.participatedMeetings = formattedMeetings;
              }
            } else {
              console.error('会议列表API返回错误：', res);
              this.handleListError(res.message || '获取会议列表失败');
            }
          })
          .catch(err => {
            console.error('获取会议列表失败:', err);
            this.handleListError('获取会议列表失败');
          })
          .finally(() => {
            uni.hideLoading();
            this.loading = false;
          });
      } catch (error) {
        console.error('调用会议列表API出错:', error);
        this.handleListError('调用会议列表API出错');
        uni.hideLoading();
        this.loading = false;
      }
    },
    
    // 处理会议列表错误
    handleListError(message) {
      uni.showToast({
        title: message,
        icon: 'none'
      });
      
      // 在开发环境中使用测试数据
      if (process.env.NODE_ENV !== 'production') {
        this.showTestData();
      }
    },
    
    // 显示测试数据
    showTestData() {
      console.log('显示测试数据');
      const testMeetings = [
        {
          id: '3',
          title: '项目进度例会',
          date: '2023-05-15',
          startTime: '09:00',
          endTime: '10:00',
          status: 'in-progress',
          room: '大会议室',
          participants: [
            { id: '1', name: '张三' },
            { id: '2', name: '李四' },
            { id: '3', name: '王五' }
          ],
          organizer: { id: '1', name: '张三' }
        },
        {
          id: '101',
          title: '产品需求评审会议',
          date: '2023-06-10',
          startTime: '09:30',
          endTime: '11:00',
          status: 'pending',
          room: '大会议室',
          participants: [
            { id: '2', name: '李四' },
            { id: '1', name: '张三' }
          ],
          organizer: { id: '2', name: '李四' }
        }
      ];
      
      if (this.activeTab === 'initiated') {
        this.initiatedMeetings = testMeetings;
      } else {
        this.participatedMeetings = testMeetings.filter(m => m.id === '101');
      }
    },
    
    // 查看会议详情
    viewMeetingDetail(meeting) {
      uni.navigateTo({
        url: `/pages/user/meeting/detail?id=${meeting.id}`
      });
    },
    
    // 取消会议
    cancelMeeting(meeting) {
      uni.showModal({
        title: '取消会议',
        content: '确定要取消该会议吗？',
        success: res => {
          if (res.confirm) {
            uni.showLoading({ title: '处理中...' });
            
            // 直接使用API层取消会议
            api.meeting.cancelMeeting(meeting.id)
              .then(res => {
                if (res.code === 200) {
                  uni.showToast({
                    title: '会议已取消',
                    icon: 'success'
                  });
                  
                  // 更新本地数据
                  const index = this.initiatedMeetings.findIndex(item => item.id === meeting.id);
                  if (index !== -1) {
                    this.initiatedMeetings[index].status = 'canceled';
                  }
                } else {
                  uni.showToast({
                    title: res.message || '取消会议失败',
                    icon: 'none'
                  });
                }
              })
              .catch(err => {
                console.error('取消会议失败:', err);
                uni.showToast({
                  title: '取消会议失败',
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
    
    // 拒绝参与会议
    rejectMeeting(meeting) {
      uni.showModal({
        title: '拒绝参与',
        content: '确定要拒绝参与该会议吗？',
        success: res => {
          if (res.confirm) {
            uni.showLoading({ title: '处理中...' });
            
            // 直接使用API层拒绝参与会议
            api.meeting.rejectParticipation(meeting.id)
              .then(res => {
                if (res.code === 200) {
                  uni.showToast({
                    title: '已拒绝参与',
                    icon: 'success'
                  });
                  
                  // 更新本地数据
                  const index = this.participatedMeetings.findIndex(item => item.id === meeting.id);
                  if (index !== -1) {
                    this.participatedMeetings.splice(index, 1);
                  }
                } else {
                  uni.showToast({
                    title: res.message || '操作失败',
                    icon: 'none'
                  });
                }
              })
              .catch(err => {
                console.error('拒绝参与失败:', err);
                uni.showToast({
                  title: '操作失败',
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
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'pending': '待审批',
        'approved': '已通过',
        'in-progress': '进行中',
        'completed': '已完成',
        'rejected': '已拒绝',
        'canceled': '已取消'
      };
      return statusMap[status] || '未知状态';
    },
    
    // 获取状态样式类
    getStatusClass(status) {
      const classMap = {
        'pending': 'status-pending',
        'approved': 'status-approved',
        'in-progress': 'status-in-progress',
        'completed': 'status-completed',
        'rejected': 'status-rejected',
        'canceled': 'status-canceled'
      };
      return classMap[status] || '';
    },
    
    // 判断会议是否可以取消
    canCancel(meeting) {
      return meeting.status === 'pending' || meeting.status === 'approved';
    },
    
    // 判断会议是否可以拒绝参与
    canReject(meeting) {
      return meeting.status === 'pending' || meeting.status === 'approved';
    },
    
    // 处理状态筛选变更
    handleStatusChange(e) {
      this.statusIndex = e.detail.value;
    },
    
    // 显示筛选弹窗
    showFilterModal() {
      this.tempStartDate = this.startDate;
      this.tempEndDate = this.endDate;
      this.tempRoomIndex = this.roomIndex;
      this.showFilter = true;
    },
    
    // 关闭筛选弹窗
    closeFilterModal() {
      this.showFilter = false;
    },
    
    // 重置筛选条件
    resetFilters() {
      this.tempStartDate = '';
      this.tempEndDate = '';
      this.tempRoomIndex = 0;
    },
    
    // 应用筛选条件
    applyFilters() {
      this.startDate = this.tempStartDate;
      this.endDate = this.tempEndDate;
      this.roomIndex = this.tempRoomIndex;
      
      // 关闭筛选弹窗
      this.showFilter = false;
      
      // 重新加载会议列表
      this.fetchMeetingList();
    },
    
    // 处理开始日期变更
    onStartDateChange(e) {
      this.tempStartDate = e.detail.value;
    },
    
    // 处理结束日期变更
    onEndDateChange(e) {
      this.tempEndDate = e.detail.value;
    },
    
    // 处理会议室选择变更
    onRoomChange(e) {
      this.tempRoomIndex = e.detail.value;
    },
    
    // 返回会议时间
    getMeetingTime(meeting) {
      if (meeting.startTime && meeting.endTime) {
        return `${meeting.startTime} - ${meeting.endTime}`;
      } else if (meeting.startTime) {
        return meeting.startTime;
      } else {
        return '未设置时间';
      }
    },
    
    // 预加载测试数据
    preloadTestData() {
      console.log('预加载测试数据');
      this.initiatedMeetings = [{
        id: 'test-1',
        title: '测试会议(预加载)',
        date: '2023-06-10',
        startTime: '09:30',
        endTime: '11:00',
        status: 'pending',
        room: '大会议室',
        participants: [
          { id: '1', name: '张三' },
          { id: '2', name: '李四' }
        ]
      }];
    }
  }
}
</script>

<style>
.container {
  flex: 1;
  padding: 0;
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 50px; /* 修改为适应底部导航 */
}

.header {
  padding: 20rpx 30rpx;
  background-color: #ffffff;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.tabs {
  display: flex;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 20rpx;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab.active {
  color: #3498db;
  font-weight: bold;
}

.tab.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 4rpx;
  background-color: #3498db;
}

.filter-section {
  display: flex;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
}

.filter-picker {
  flex: 1;
  margin-right: 20rpx;
}

.filter-value {
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  padding: 15rpx 20rpx;
  font-size: 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  padding: 0;
}

.meeting-list {
  flex: 1;
  padding: 0 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.meeting-card {
  background-color: #ffffff;
  border-radius: 8px;
  margin-bottom: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  width: 100%;
  box-sizing: border-box;
  margin-right: 30rpx;
}

.meeting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  width: 100%;
}

.meeting-title {
  font-size: 32rpx;
  font-weight: bold;
  flex: 1;
  margin-right: 20rpx;
}

.meeting-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 30rpx;
}

.status-pending {
  background-color: #f39c12;
  color: white;
}

.status-approved {
  background-color: #2ecc71;
  color: white;
}

.status-rejected {
  background-color: #e74c3c;
  color: white;
}

.status-canceled {
  background-color: #95a5a6;
  color: white;
}

.status-in-progress {
  background-color: #3498db;
  color: white;
}

.status-completed {
  background-color: #27ae60;
  color: white;
}

.meeting-info {
  margin-bottom: 20rpx;
  width: 100%;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
  font-size: 26rpx;
  color: #666;
  width: 100%;
}

.info-item text[class^="icon-"] {
  margin-right: 20rpx;
  width: 32rpx;
  text-align: center;
  font-size: 32rpx;
  color: #3498db;
  font-family: "uniicons";
}

.meeting-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  width: 100%;
}

.action-btn {
  font-size: 24rpx;
  padding: 10rpx 30rpx;
  border-radius: 4px;
  min-width: 120rpx;
  text-align: center;
}

.primary-btn {
  background-color: #3498db;
  color: white;
}

.danger-btn {
  background-color: #e74c3c;
  color: white;
}

.warning-btn {
  background-color: #f39c12;
  color: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
  }
  
  .empty-text {
  color: #999;
  font-size: 28rpx;
}

/* 筛选弹窗样式 */
.filter-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

.filter-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

.filter-popup {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
  transform: translateY(0);
  transition: transform 0.3s;
}

.filter-header {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
}

.filter-title {
  font-size: 32rpx;
  font-weight: bold;
}

.filter-close {
  font-size: 48rpx;
  color: #999;
  line-height: 1;
}

.filter-body {
  padding: 30rpx;
}

.filter-item {
  margin-bottom: 30rpx;
}

.filter-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 15rpx;
  display: block;
}

.date-range {
  display: flex;
  align-items: center;
}

.date-picker {
  flex: 1;
  background-color: #f5f7fa;
  padding: 15rpx 20rpx;
  border-radius: 4px;
  font-size: 26rpx;
}

.date-separator {
  padding: 0 15rpx;
  color: #999;
}

.room-picker {
  background-color: #f5f7fa;
  padding: 15rpx 20rpx;
  border-radius: 4px;
  font-size: 26rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-footer {
  display: flex;
  border-top: 1px solid #eaeaea;
}

.filter-reset, .filter-apply {
  flex: 1;
  text-align: center;
  padding: 25rpx 0;
  font-size: 30rpx;
}

.filter-reset {
  color: #666;
  background-color: #f5f7fa;
}

.filter-apply {
  color: white;
  background-color: #3498db;
}

/* 使用emoji做图标 */
.icon-calendar:before {
  content: "📅";
}

.icon-time:before {
  content: "⏰";
}

.icon-location:before {
  content: "📍";
}

.icon-user:before {
  content: "👤";
}

.icon-filter:before {
  content: "🔍";
}

.icon-down:before {
  content: "▼";
}
</style> 