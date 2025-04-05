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
        class="meeting-item"
        v-for="meeting in filteredMeetings" 
          :key="meeting.id"
        @click="handleMeetingItemClick(meeting, $event)"
      >
        <view class="meeting-header">
          <view class="meeting-title">{{ meeting.title }}</view>
          <view class="meeting-status" :class="getStatusClass(meeting.status)">
            {{ getStatusText(meeting.status) }}
          </view>
        </view>
        
        <view class="meeting-info">
          <view class="info-item">
            <text class="iconfont icon-time"></text>
            <text>{{ meeting.date }} {{ meeting.startTime }} - {{ meeting.endTime }}</text>
          </view>
          <view class="info-item">
            <text class="iconfont icon-location"></text>
            <text>{{ meeting.roomName || meeting.room || '未指定' }}</text>
          </view>
          <view class="info-item">
            <text class="iconfont icon-user"></text>
            <text>{{ meeting.user || meeting.booker || '未知用户' }}</text>
          </view>
        </view>
        
        <view class="meeting-footer">
          <view class="attendee-count">
            {{ (meeting.participants && meeting.participants.length) ? meeting.participants.length : ((meeting.attendees && meeting.attendees.length) ? meeting.attendees.length : 0) }}人参会
          </view>
          <view class="meeting-actions">
            <button 
              v-if="meeting.status === 'approved'"
              @click.stop="enterMeetingRoom(meeting.id)"
              class="enter-btn"
            >进入会议</button>
            <button 
              @click.stop="viewMeetingDetail(meeting)"
              class="detail-btn"
            >查看详情</button>
            <button 
              v-if="meeting.status === 'pending' && isCreator(meeting)"
              @click.stop="cancelMeeting(meeting)"
              class="cancel-btn"
            >取消</button>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="empty-state" v-else>
      <image class="empty-image" src="/static/logo.png"></image>
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
import api from '../../../api/index'
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
      activeTab: 'initiated',
      meetings: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      hasMore: true,
      total: 0,
      filterOptions: {
        status: '',
        date: '',
        time: ''
      },
      userId: null, // 当前用户ID
      statusOptions: ['全部状态', '待审批', '已通过', '进行中', '已完成', '已拒绝', '已取消'],
      statusIndex: 0,
      startDate: '',
      endDate: '',
      roomOptions: [], // 改为空数组，将从后端获取
      roomIndex: 0,
      showFilter: false, // 控制筛选弹窗显示
      // 会议列表数据
      initiatedMeetings: [],
      participatedMeetings: [],
      // 筛选后的临时变量
      tempStartDate: '',
      tempEndDate: '',
      tempRoomIndex: 0,
    }
  },
  created() {
    // 获取用户ID
    try {
      const userInfoStr = uni.getStorageSync('userInfo');
      // 确保userInfo是对象
      const userInfo = typeof userInfoStr === 'string' ? JSON.parse(userInfoStr) : userInfoStr;
      
      if (userInfo && userInfo.id) {
        this.userId = userInfo.id.toString();
        console.log('会议列表页获取到用户ID:', this.userId);
        // 获取到用户ID后立即加载会议列表
        this.fetchMeetingList();
      } else {
        console.warn('未能从存储获取用户信息');
        // 尝试重新获取用户信息
        api.user.getUserInfo()
          .then(res => {
            if (res.code === 200 && res.data) {
              // 保存获取到的用户信息
              const newUserInfo = res.data;
              uni.setStorageSync('userInfo', JSON.stringify(newUserInfo));
              if (newUserInfo.id) {
                this.userId = newUserInfo.id.toString();
                console.log('重新获取用户ID成功:', this.userId);
                // 重新加载会议列表
                this.fetchMeetingList();
              }
            }
          })
          .catch(err => {
            console.error('获取用户信息失败:', err);
          });
      }
    } catch (err) {
      console.error('处理用户信息时出错:', err);
    }
  },
  async onLoad() {
    await this.fetchMeetingList();
  },
  computed: {
    // 根据当前选项卡和筛选条件获取会议列表
    filteredMeetings() {
      const meetings = this.activeTab === 'initiated' ? this.initiatedMeetings : this.participatedMeetings;
      
      return meetings.filter(meeting => {
        // 状态筛选
        if (this.statusIndex !== 0) {
          const normalizedStatus = this.normalizeStatus(meeting.status);
          const statusMap = {
            1: 'pending',
            2: 'approved',
            3: 'in-progress',
            4: 'completed',
            5: 'rejected',
            6: ['canceled', 'cancelled']
          };
          
          if (this.statusIndex === 6) {
            if (normalizedStatus !== 'canceled' && normalizedStatus !== 'cancelled') {
              return false;
            }
          } else if (normalizedStatus !== statusMap[this.statusIndex]) {
            return false;
          }
        }
        
        // 日期筛选
        if (this.startDate || this.endDate) {
          const meetingDate = new Date(meeting.date);
          meetingDate.setHours(0, 0, 0, 0);
          
          if (this.startDate) {
            const startDate = new Date(this.startDate);
            startDate.setHours(0, 0, 0, 0);
            if (meetingDate < startDate) {
              return false;
            }
          }
          
          if (this.endDate) {
            const endDate = new Date(this.endDate);
            endDate.setHours(23, 59, 59, 999);
            if (meetingDate > endDate) {
              return false;
            }
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
    activeTab: {
      handler(newVal) {
        console.log('activeTab changed to:', newVal);
        // 当切换标签时重新加载会议列表
        this.fetchMeetingList();
      },
      immediate: false
    }
  },
  methods: {
    // 获取会议列表数据
    async fetchMeetingList() {
      this.loading = true;
      
      try {
        // 调用API获取所有会议列表
        const res = await api.meeting.getMeetingList({
          pageNo: 1,
          pageSize: 1000
        });
        if (res.code === 200 && res.data) {
          let meetingList = res.data.list || [];
          console.log('获取到的会议列表:', meetingList);
          
          // 格式化会议数据（等待所有会议的参会人员信息获取完成）
          const formattedMeetings = await Promise.all(
            meetingList.map(meeting => this.formatMeeting(meeting))
          );
          
          // 获取当前用户信息
          const userInfoStr = uni.getStorageSync('userInfo');
          const userInfo = typeof userInfoStr === 'string' ? JSON.parse(userInfoStr) : userInfoStr;
          const currentUsername = userInfo?.username;
          console.log("当前用户名:", currentUsername);
          
          // 根据activeTab筛选会议
          if (this.activeTab === 'initiated') {
            // 我发起的会议：当前用户是预约人
            this.initiatedMeetings = formattedMeetings.filter(meeting => {
              const isCreator = meeting.booker === currentUsername;
              console.log('会议:', meeting.id, '状态:', meeting.status, '创建者:', meeting.booker, '当前用户:', currentUsername, '是否创建者:', isCreator);
              return isCreator;
            });
            console.log('我发起的会议:', this.initiatedMeetings);
          } else {
            // 我参与的会议：当前用户是参会人员
            this.participatedMeetings = formattedMeetings.filter(meeting => {
              const isParticipant = meeting.booker !== currentUsername && 
                meeting.participants.some(p => p.username === currentUsername);
              console.log('会议:', meeting.id, '状态:', meeting.status, '是否参与者:', isParticipant);
              return isParticipant;
            });
            console.log('我参与的会议:', this.participatedMeetings);
          }
        } else {
          uni.showToast({
            title: res.message || '获取会议列表失败',
            icon: 'none'
          });
        }
      } catch (err) {
        console.error('获取会议列表失败:', err);
        uni.showToast({
          title: '获取会议列表失败，请稍后重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
        uni.stopPullDownRefresh();
      }
    },
    
    // 查看会议详情
    viewMeetingDetail(meeting) {
      if (!meeting || !meeting.id) {
        uni.showToast({
          title: '无效的会议记录',
          icon: 'none'
        });
        return;
      }
      
      console.log('查看会议详情:', JSON.stringify(meeting));
      
      // 确保字段与后端一致
      const meetingData = {
        id: meeting.id,
        topic: meeting.topic || meeting.title || '未命名会议',
        description: meeting.description || '',
        booker: meeting.booker, // 直接使用原始booker，不做处理
        room: meeting.room || '',
        startTime: meeting.startTime || '',
        endTime: meeting.endTime || '',
        status: meeting.status || 'pending',
        reserveDate: meeting.reserveDate || meeting.date || '',
        
        // 额外提供字段用于前端组件使用
        roomName: typeof meeting.room === 'object' ? meeting.room.name : meeting.roomName || meeting.room || '',
        roomId: meeting.roomId || (typeof meeting.room === 'object' ? meeting.room.id : null) || 0,
        participants: meeting.participants || [],
        location: typeof meeting.room === 'object' ? meeting.room.name : meeting.roomName || meeting.room || ''
      };
      
      // 将会议信息转换为JSON字符串并编码
      const meetingInfo = encodeURIComponent(JSON.stringify(meetingData));
      
      // 构建URL参数
      const url = `/pages/user/meeting/detail?id=${meeting.id}&meetingInfo=${meetingInfo}`;
      
      console.log('导航到会议详情页:', url);
      
      uni.navigateTo({
        url: url,
        fail: (err) => {
          console.error('导航到会议详情页失败:', err);
          uni.showToast({
            title: '打开详情失败',
            icon: 'none'
          });
        }
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
            
            // 确保meeting.id存在
            if (!meeting || !meeting.id) {
              uni.hideLoading();
              uni.showToast({
                title: '无效的会议记录',
                icon: 'none'
              });
              return;
            }
            
            console.log('正在取消会议:', meeting.id);
            
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
                  title: '取消会议失败，请稍后重试',
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
    
    // 标准化状态值
    normalizeStatus(status) {
      if (!status) return 'pending';
      
      // 处理状态对象
      if (typeof status === 'object' && status !== null) {
        status = status.status || 'pending';
      }
      
      status = status.toLowerCase();
      
      const statusMap = {
        'pending': 'pending',
        'approved': 'approved',
        'in-progress': 'in-progress',
        'completed': 'completed',
        'rejected': 'rejected',
        'canceled': 'canceled',
        'cancelled': 'canceled',
        '待审核': 'pending',
        '已通过': 'approved',
        '进行中': 'in-progress',
        '已完成': 'completed',
        '已拒绝': 'rejected',
        '已取消': 'canceled'
      };
      
      return statusMap[status] || 'pending';
    },
    
    // 获取状态文本
    getStatusText(status) {
      // 检查输入是否为会议对象
      if (typeof status === 'object' && status !== null) {
        status = status.status || 'pending';
      }
      
      // 先将状态标准化
      const normalizedStatus = this.normalizeStatus(status);
      
      // 将英文代码转换为中文显示文本
      const statusMap = {
        'pending': '待审核',
        'approved': '已通过',
        'in-progress': '进行中',
        'completed': '已完成',
        'rejected': '已拒绝',
        'canceled': '已取消'
      };
      
      return statusMap[normalizedStatus] || '待审核';
    },
    
    // 获取状态样式类
    getStatusClass(status) {
      // 检查输入是否为会议对象
      if (typeof status === 'object' && status !== null) {
        // 如果是会议对象，获取其status属性
        status = status.status || 'pending';
      }
      
      // 先将状态标准化为英文代码
      let normalizedStatus = this.normalizeStatus(status);
      
      // 将英文代码转换为对应的CSS类名
      const classMap = {
        'pending': 'status-pending',
        'approved': 'status-approved',
        'in-progress': 'status-in-progress',
        'completed': 'status-completed',
        'rejected': 'status-rejected',
        'canceled': 'status-canceled',
        'cancelled': 'status-canceled'
      };
      
      return classMap[normalizedStatus] || '';
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
      console.log('应用筛选条件前:', {
        startDate: this.startDate,
        endDate: this.endDate,
        roomIndex: this.roomIndex
      });
      
      this.startDate = this.tempStartDate;
      this.endDate = this.tempEndDate;
      this.roomIndex = this.tempRoomIndex;
      
      console.log('应用筛选条件后:', {
        startDate: this.startDate,
        endDate: this.endDate,
        roomIndex: this.roomIndex
      });
      
      // 关闭筛选弹窗
      this.showFilter = false;
      
      // 重新加载会议列表
      this.fetchMeetingList();
    },
    
    // 处理开始日期变更
    onStartDateChange(e) {
      this.tempStartDate = e.detail.value;
      console.log('开始日期变更:', this.tempStartDate);
    },
    
    // 处理结束日期变更
    onEndDateChange(e) {
      this.tempEndDate = e.detail.value;
      console.log('结束日期变更:', this.tempEndDate);
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
    
    // 处理日期筛选
    handleDateFilter(date, isStart = true) {
      if (!date) {
        if (isStart) {
          this.startDate = '';
        } else {
          this.endDate = '';
        }
        return;
      }
      
      // 转换为本地时区的日期字符串
      const localDate = new Date(date);
      const formattedDate = localDate.toISOString().split('T')[0];
      
      if (isStart) {
        this.startDate = formattedDate;
      } else {
        this.endDate = formattedDate;
      }
    },
    
    // 格式化会议数据
    async formatMeeting(meeting) {
      if (!meeting) return null;
      
      console.log('原始会议数据:', meeting);
      
      // 提取需要的字段
      const formattedMeeting = {
        id: meeting.id || '',
        topic: meeting.topic || meeting.title || '未命名会议',
        description: meeting.description || '',
        booker: meeting.bookerName || meeting.userName || meeting.booker || meeting.user || '',
        room: meeting.room || '',
        startTime: meeting.startTime || '',
        endTime: meeting.endTime || '',
        status: this.normalizeStatus(meeting.status), // 使用normalizeStatus方法标准化状态
        reserveDate: meeting.reserveDate || meeting.date || '',
        
        // 前端显示需要的额外字段
        title: meeting.topic || meeting.title || '未命名会议',
        date: meeting.reserveDate || meeting.date || '',
        roomName: typeof meeting.room === 'object' ? meeting.room.name : (meeting.roomName || meeting.room || ''),
        user: meeting.bookerName || meeting.userName || meeting.booker || meeting.user || '',
        participants: []
      };
      
      console.log('格式化后的会议数据:', formattedMeeting);
      
      try {
        // 等待获取参会人员信息
        const res = await api.participant.getParticipantList(meeting.id);
        if (res.code === 200 && res.data) {
          const participants = Array.isArray(res.data) ? res.data : [];
          formattedMeeting.participants = participants.map(p => ({
            id: p.id || p.userId || '',
            name: p.name || p.username || p.userName || '未知用户',
            username: p.username || p.userName || p.name || '',
            avatar: p.avatar || p.avatarUrl || '',
            status: p.status || 'pending'
          }));
        }
      } catch (err) {
        console.error('获取参会人员失败:', err);
      }
      
      return formattedMeeting;
    },
    
    // 进入会议聊天室
    enterMeetingRoom(meetingId) {
      console.log('进入会议:', meetingId);
      
      // 根据当前选项卡从正确的数据源查找会议信息
      const currentMeetings = this.activeTab === 'initiated' ? this.initiatedMeetings : this.participatedMeetings;
      console.log('当前会议列表数据源:', this.activeTab, '会议数量:', currentMeetings.length);
      
      // 查找当前会议的完整信息
      const meeting = currentMeetings.find(m => m.id === meetingId);
      if (meeting) {
        console.log('找到完整会议信息:', meeting);
        
        // 格式化会议数据，确保包含所有必要字段
        const meetingData = {
          id: meeting.id,
          topic: meeting.topic || meeting.title || '未命名会议',
          description: meeting.description || '',
          booker: meeting.booker || '',
          room: meeting.room || '',
          startTime: meeting.startTime || '',
          endTime: meeting.endTime || '',
          status: meeting.status || 'pending',
          reserveDate: meeting.reserveDate || meeting.date || '',
          
          // 额外提供字段用于前端组件使用
          roomName: typeof meeting.room === 'object' ? meeting.room.name : meeting.roomName || meeting.room || '',
          roomId: meeting.roomId || (typeof meeting.room === 'object' ? meeting.room.id : null) || 0,
          participants: meeting.participants || [],
          user: meeting.user || meeting.booker || '', // 确保有用户信息
          location: meeting.roomName || (typeof meeting.room === 'object' ? meeting.room.name : meeting.room) || ''
        };
        
        try {
          const meetingJson = JSON.stringify(meetingData);
          console.log('会议信息JSON:', meetingJson);
          
          const meetingInfo = encodeURIComponent(meetingJson);
          console.log('编码后会议信息:', meetingInfo);
          
          const url = `/pages/user/meeting/room?id=${meetingId}&meetingInfo=${meetingInfo}`;
          console.log('导航URL:', url);
          
          uni.navigateTo({
            url: url,
            success: () => console.log('导航成功'),
            fail: (err) => {
              console.error('导航失败:', err);
              uni.showToast({
                title: '进入会议室失败',
                icon: 'none'
              });
            }
          });
        } catch (err) {
          console.error('处理会议信息出错:', err);
          uni.showToast({
            title: '处理会议信息出错',
            icon: 'none'
          });
        }
      } else {
        console.warn('未找到会议信息');
        uni.showToast({
          title: '未找到会议信息',
          icon: 'none'
        });
      }
    },
    
    // 判断是否是会议创建者
    isCreator(meeting) {
      const userInfo = uni.getStorageSync('userInfo');
      const user = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo;
      return meeting.booker === user.username;
    },
    
    // 处理会议列表项点击
    handleMeetingItemClick(meeting, event) {
      // 如果点击的是按钮，不执行查看详情
      if (event.target.className.includes('enter-btn') || 
          event.target.className.includes('cancel-btn')) {
        return;
      }
      
      // 否则查看会议详情
      this.viewMeetingDetail(meeting);
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

.meeting-item {
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  width: 100%;
  box-sizing: border-box;
  border-left: 6rpx solid #3498db;
  transition: transform 0.2s, box-shadow 0.2s;
}

.meeting-item:active {
  transform: translateY(2rpx);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.meeting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  width: 100%;
}

.meeting-title {
  font-size: 30rpx;
  font-weight: bold;
  flex: 1;
  margin-right: 20rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meeting-status {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 30rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-pending {
  background-color: rgba(243, 156, 18, 0.15);
  color: #f39c12;
}

.status-approved {
  background-color: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
}

.status-rejected {
  background-color: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
}

.status-canceled {
  background-color: rgba(149, 165, 166, 0.15);
  color: #95a5a6;
}

.status-in-progress {
  background-color: rgba(52, 152, 219, 0.15);
  color: #3498db;
}

.status-completed {
  background-color: rgba(39, 174, 96, 0.15);
  color: #27ae60;
}

.meeting-info {
  margin-bottom: 20rpx;
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16rpx;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
  font-size: 26rpx;
  color: #666;
  width: 100%;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item text[class^="icon-"] {
  margin-right: 16rpx;
  width: 32rpx;
  text-align: center;
  font-size: 28rpx;
  color: #3498db;
}

.meeting-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 20rpx;
  flex-wrap: wrap;
}

.attendee-count {
  display: inline-block;
  background-color: #f0f7ff;
  padding: 4rpx 16rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #3498db;
  font-weight: bold;
  white-space: nowrap;
  line-height: 32rpx;
  margin-bottom: 10rpx;
}

.meeting-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10rpx;
  flex-wrap: wrap;
}

.enter-btn, .detail-btn, .edit-btn, .cancel-btn {
  background-color: #3498db;
  color: white;
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(52, 152, 219, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100rpx;
  margin: 5rpx;
}

.enter-btn:active, .detail-btn:active, .edit-btn:active, .cancel-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
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

.icon-group:before {
  content: "👥";
}

.icon-filter:before {
  content: "🔍";
}

.icon-down:before {
  content: "▼";
}

/* 取消按钮样式 */
.cancel-btn {
  background-color: #e74c3c;
  box-shadow: 0 4rpx 12rpx rgba(231, 76, 60, 0.2);
}
</style>