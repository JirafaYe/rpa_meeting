<template>
  <view class="meeting-detail-container">
    <view class="status-bar" :class="getStatusClass(meeting.status)">
      <text class="status-text">{{ getStatusText(meeting.status) }}</text>
    </view>
    
    <view class="meeting-header">
      <view class="meeting-title">{{ meeting.title }}</view>
      <view class="organizer-info">
        <text class="label">组织者：</text>
        <text class="value">{{ meeting.organizer.name }}</text>
      </view>
    </view>
    
    <view class="info-card">
      <view class="card-title">会议信息</view>
      
      <view class="info-item">
        <text class="info-icon">🕒</text>
        <view class="info-content">
          <text class="info-label">时间</text>
          <text class="info-value">{{ meeting.date ? meeting.date + ' ' + meeting.startTime + '-' + meeting.endTime : '未知时间' }}</text>
        </view>
      </view>
      
      <view class="info-item">
        <text class="info-icon">📍</text>
        <view class="info-content">
          <text class="info-label">地点</text>
          <text class="info-value">{{ meeting.room?.name || '未知会议室' }}</text>
        </view>
      </view>
      
      <view class="info-item">
        <text class="info-icon">📝</text>
        <view class="info-content">
          <text class="info-label">会议类型</text>
          <text class="info-value">{{ meeting.type }}</text>
        </view>
      </view>
      
      <view class="info-item">
        <text class="info-icon">🔄</text>
        <view class="info-content">
          <text class="info-label">重复</text>
          <text class="info-value">{{ meeting.repeat || '不重复' }}</text>
        </view>
      </view>
      
      <view class="info-item" v-if="meeting.createTime">
        <text class="info-icon">📅</text>
        <view class="info-content">
          <text class="info-label">创建时间</text>
          <text class="info-value">{{ meeting.createTime }}</text>
        </view>
      </view>
    </view>
    
    <view class="info-card">
      <view class="card-title">会议说明</view>
      <view class="description">{{ meeting.description || '暂无会议说明' }}</view>
    </view>
    
    <view class="info-card">
      <view class="card-title">参与人员 ({{ meeting.participants.length }}人)</view>
      <view class="attendees-list">
        <view 
          class="attendee-item" 
          v-for="(participant, index) in meeting.participants" 
          :key="index"
        >
          <view class="attendee-avatar">{{ participant.name.charAt(0) }}</view>
          <text class="attendee-name">{{ participant.name }}</text>
          <text class="attendee-status" :class="participant.confirmed ? 'status-accepted' : 'status-pending'">
            {{ participant.confirmed ? '已确认' : '待确认' }}
          </text>
        </view>
      </view>
    </view>
    
    <view class="info-card" v-if="meeting.equipment && meeting.equipment.length > 0">
      <view class="card-title">设备需求</view>
      <view class="equipment-list">
        <view 
          class="equipment-item" 
          v-for="(item, index) in meeting.equipment" 
          :key="index"
        >
          <text class="equipment-icon">{{ getEquipmentIcon(item) }}</text>
          <text class="equipment-name">{{ item }}</text>
        </view>
      </view>
    </view>
    
    <view class="info-card" v-if="meeting.attachments && meeting.attachments.length > 0">
      <view class="card-title">会议附件</view>
      <view class="attachment-list">
        <view 
          class="attachment-item" 
          v-for="(item, index) in meeting.attachments" 
          :key="index"
          @click="openAttachment(item)"
        >
          <text class="attachment-icon">{{ getFileIcon(item.type) }}</text>
          <view class="attachment-info">
            <text class="attachment-name">{{ item.name }}</text>
            <text class="attachment-size">{{ formatFileSize(item.size) }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="info-card" v-if="meeting.status === 'rejected'">
      <view class="card-title">拒绝原因</view>
      <view class="reject-reason">{{ meeting.rejectReason || '无' }}</view>
    </view>
    
    <!-- 审批信息 -->
    <view class="info-card" v-if="meeting.approveInfo">
      <view class="card-title">审批信息</view>
      <view class="approval-info">
        <view class="approval-item">
          <text class="approval-label">审批人：</text>
          <text class="approval-value">{{ meeting.approveInfo.approver }}</text>
        </view>
        <view class="approval-item">
          <text class="approval-label">审批时间：</text>
          <text class="approval-value">{{ meeting.approveInfo.time }}</text>
        </view>
        <view class="approval-item" v-if="meeting.approveInfo.remark">
          <text class="approval-label">备注：</text>
          <text class="approval-value">{{ meeting.approveInfo.remark }}</text>
        </view>
      </view>
    </view>
    
    <view class="action-bar" v-if="canOperate">
      <!-- 会议组织者且会议未开始时可取消会议 -->
      <button 
        v-if="(meeting.status === 'pending' || meeting.status === 'approved') && isOrganizer" 
        class="action-btn cancel-btn" 
        @click="cancelMeeting"
      >
        取消会议
      </button>
      
      <!-- 会议组织者且会议已通过审批但未开始时可编辑会议 -->
      <button 
        v-if="meeting.status === 'approved' && isOrganizer" 
        class="action-btn primary-btn" 
        @click="editMeeting"
      >
        编辑会议
      </button>
      
      <!-- 会议组织者且会议已通过审批但未开始时可开始会议 -->
      <button 
        v-if="meeting.status === 'approved' && isOrganizer" 
        class="action-btn start-btn" 
        @click="startMeeting"
      >
        开始会议
      </button>
      
      <!-- 会议进行中时可进入会议室 -->
      <button 
        v-if="meeting.status === 'in-progress'" 
        class="action-btn enter-btn" 
        @click="enterMeetingRoom"
      >
        进入会议
      </button>
      
      <!-- 会议已完成时可查看会议纪要 -->
      <button 
        v-if="meeting.status === 'completed'" 
        class="action-btn minutes-btn" 
        @click="viewMeetingMinutes"
      >
        查看纪要
      </button>
    </view>
  </view>
</template>

<script>
import api from '../../../utils/api.js'

export default {
  data() {
    return {
      id: null,
      meeting: {
        id: 0,
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        status: 'pending',
        type: '',
        repeat: '',
        description: '',
        room: {
          id: 0,
          name: ''
        },
        organizer: {
          id: 0,
          name: ''
        },
        participants: [],
        equipment: [],
        attachments: [],
        approveInfo: null,
        rejectReason: ''
      },
      isLoading: false,
      userId: '1', // 当前登录用户ID，实际项目中应该从storage中获取
      files: [],
      loading: {
        files: false
      }
    };
  },
  computed: {
    canOperate() {
      // 检查当前用户是否有操作权限（会议发起人或参与者）
      return this.isOrganizer || this.meeting.participants.some(participant => participant.id === this.userId);
    },
    isOrganizer() {
      // 检查当前用户是否是组织者
      return this.meeting.organizer && this.meeting.organizer.id === this.userId;
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      this.loadMeetingDetail();
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  methods: {
    loadMeetingDetail() {
      this.isLoading = true;
      console.log('获取会议详情:', this.id);
      
      api.meeting.getMeetingDetail(this.id)
        .then(res => {
          console.log('会议详情API响应:', res);
          
          if (res.code === 200 && res.data) {
            // 处理会议时间
            const meetingData = res.data;
            const timeInfo = {
              '原始开始时间': meetingData.startTime,
              '原始结束时间': meetingData.endTime,
              '提取日期': meetingData.startTime ? meetingData.startTime.split(' ')[0] : '',
              '提取开始时间': meetingData.startTime ? meetingData.startTime.split(' ')[1] : '',
              '提取结束时间': meetingData.endTime ? meetingData.endTime.split(' ')[1] : ''
            };
            console.log('处理会议时间:', timeInfo);
            
            // 设置状态
            meetingData.status = this.formatMeetingStatus(meetingData.status);
            
            // 格式化会议数据
            this.meeting = {
              id: meetingData.id,
              title: meetingData.title,
              date: meetingData.startTime ? meetingData.startTime.split(' ')[0] : '',
              startTime: meetingData.startTime ? meetingData.startTime.split(' ')[1] : '',
              endTime: meetingData.endTime ? meetingData.endTime.split(' ')[1] : '',
              fullStartTime: meetingData.startTime || '',
              fullEndTime: meetingData.endTime || '',
              location: meetingData.roomName || '未指定',
              roomId: meetingData.roomId || '',
              status: meetingData.status,
              statusText: this.getStatusText(meetingData.status),
              description: meetingData.description || '',
              organizer: meetingData.organizer || {},
              participants: meetingData.participants || [],
              attachments: meetingData.attachments || [],
              createTime: meetingData.createTime || '',
              equipment: meetingData.equipment || [],
              isRpa: meetingData.isRpa || false,
              rpaConfig: meetingData.rpaConfig || null
            };
            
            console.log('格式化后的会议数据:', this.meeting);
          } else {
            uni.showToast({
              title: res.message || '获取会议详情失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取会议详情异常:', err);
          uni.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none'
          });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    
    cancelMeeting() {
      uni.showModal({
        title: '取消会议',
        content: '确定要取消该会议吗？',
        success: (res) => {
          if (res.confirm) {
            this.isLoading = true;
            uni.showLoading({ title: '处理中...' });
            
            // 直接使用API层取消会议
            api.meeting.cancelMeeting(this.id)
              .then(res => {
                if (res.code === 200) {
                  uni.showToast({
                    title: '会议已取消',
                    icon: 'success'
                  });
                  
                  // 返回会议列表页
                  setTimeout(() => {
                    uni.navigateBack();
                  }, 1500);
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
                this.isLoading = false;
              });
          }
        }
      });
    },
    
    editMeeting() {
      uni.navigateTo({
        url: `/pages/user/meeting/create?id=${this.id}`
      });
    },
    
    enterMeetingRoom() {
      uni.navigateTo({
        url: `/pages/user/meeting/room?id=${this.id}`
      });
    },
    
    getStatusClass(status) {
      switch (status) {
        case 'pending': return 'status-pending';
        case 'approved': return 'status-approved';
        case 'in-progress': return 'status-in-progress';
        case 'completed': return 'status-completed';
        case 'rejected': return 'status-rejected';
        case 'canceled': return 'status-canceled';
        default: return 'status-unknown';
      }
    },
    
    getStatusText(status) {
      switch (status) {
        case 'pending': return '待审批';
        case 'approved': return '已通过';
        case 'in-progress': return '进行中';
        case 'completed': return '已完成';
        case 'rejected': return '已拒绝';
        case 'canceled': return '已取消';
        default: return '未知状态';
      }
    },
    
    getAttendeeStatus(status) {
      switch (status) {
        case 'accepted': return '已接受';
        case 'pending': return '待回复';
        case 'rejected': return '已拒绝';
        default: return '未知';
      }
    },
    
    getEquipmentIcon(type) {
      switch (type) {
        case '投影仪': return '📽️';
        case '白板': return '🖌️';
        case '视频设备': return '📹';
        case '音响': return '🔊';
        case '麦克风': return '🎤';
        default: return '🔌';
      }
    },
    
    getFileIcon(type) {
      switch (type) {
        case 'doc':
        case 'docx':
          return '📄';
        case 'xls':
        case 'xlsx':
          return '📊';
        case 'ppt':
        case 'pptx':
          return '📑';
        case 'pdf':
          return '📕';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return '🖼️';
        default:
          return '📎';
      }
    },
    
    formatFileSize(size) {
      if (!size) return '未知大小';
      
      // 如果已经是格式化的字符串，直接返回
      if (typeof size === 'string' && (size.includes('KB') || size.includes('MB') || size.includes('GB'))) {
        return size;
      }
      
      // 将字符串转换为数字
      const fileSize = typeof size === 'string' ? parseInt(size) : size;
      
      if (fileSize < 1024) {
        return fileSize + 'B';
      } else if (fileSize < 1024 * 1024) {
        return (fileSize / 1024).toFixed(1) + 'KB';
      } else if (fileSize < 1024 * 1024 * 1024) {
        return (fileSize / (1024 * 1024)).toFixed(1) + 'MB';
      } else {
        return (fileSize / (1024 * 1024 * 1024)).toFixed(1) + 'GB';
      }
    },
    
    openAttachment(attachment) {
      // 实际项目中应该下载和打开文件
      console.log('打开附件:', attachment);
      uni.showToast({
        title: '打开附件: ' + attachment.name,
        icon: 'none'
      });
    },
    
    // 在组件加载时获取文件
    onShow() {
      // 获取会议附件
      this.getMeetingFiles();
    },
    
    // 获取会议附件
    getMeetingFiles() {
      if (!this.id) return;
      
      this.loading.files = true;
      
      api.meeting.getRoomData(this.id)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.files = res.data.files || [];
            console.log('会议附件:', this.files);
            
            // 更新会议数据中的附件部分
            if (this.meeting && this.meeting.id) {
              this.meeting.attachments = this.files;
            }
          }
        })
        .catch(err => {
          console.error('获取会议附件失败:', err);
        })
        .finally(() => {
          this.loading.files = false;
        });
    },
    
    startMeeting() {
      uni.showModal({
        title: '开始会议',
        content: '确定要开始该会议吗？一旦开始，会议状态将变为"进行中"。',
        success: (res) => {
          if (res.confirm) {
            this.isLoading = true;
            uni.showLoading({ title: '处理中...' });
            
            // 调用开始会议API
            api.meeting.startMeeting(this.id)
              .then(res => {
                if (res.code === 200) {
                  uni.showToast({
                    title: '会议已开始',
                    icon: 'success'
                  });
                  
                  // 更新会议状态
                  this.meeting.status = 'in-progress';
                  
                  // 刷新会议详情
                  setTimeout(() => {
                    this.loadMeetingDetail();
                  }, 1000);
                } else {
                  uni.showToast({
                    title: res.message || '开始会议失败',
                    icon: 'none'
                  });
                }
              })
              .catch(err => {
                console.error('开始会议失败:', err);
                uni.showToast({
                  title: '开始会议失败',
                  icon: 'none'
                });
              })
              .finally(() => {
                uni.hideLoading();
                this.isLoading = false;
              });
          }
        }
      });
    },
    
    viewMeetingMinutes() {
      // 导航到会议纪要页面
      uni.navigateTo({
        url: `/pages/user/meeting/minutes?id=${this.id}`
      });
    },
    
    // 格式化会议状态
    formatMeetingStatus(status) {
      // 如果状态是数字
      if (typeof status === 'number' || /^\d+$/.test(status)) {
        const numStatus = parseInt(status);
        switch(numStatus) {
          case 1: return 'pending';
          case 2: return 'in-progress';
          case 3: return 'completed';
          case 4: return 'cancelled';
          default: return 'pending';
        }
      } else if (typeof status === 'string') {
        // 统一小写处理
        status = status.toLowerCase();
        // 统一状态名称
        if (status.includes('pend') || status.includes('wait') || status.includes('creat')) {
          return 'pending';
        } else if (status.includes('progress') || status.includes('ongo') || status.includes('start')) {
          return 'in-progress';
        } else if (status.includes('complet') || status.includes('finish') || status.includes('end')) {
          return 'completed';
        } else if (status.includes('cancel')) {
          return 'cancelled';
        } else {
          return 'pending';
        }
      }
      
      return 'pending';
    }
  }
};
</script>

<style>
.meeting-detail-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 80px;
}

.status-bar {
  padding: 15px;
  text-align: center;
  background-color: #3498db;
  color: white;
  font-weight: bold;
}

.status-pending {
  background-color: #f39c12;
}

.status-approved {
  background-color: #2ecc71;
}

.status-rejected {
  background-color: #e74c3c;
}

.status-canceled {
  background-color: #95a5a6;
}

.status-text {
  font-size: 16px;
}

.meeting-header {
  padding: 20px 15px;
  background-color: #fff;
}

.meeting-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.organizer-info {
  font-size: 14px;
  color: #666;
}

.label {
  color: #999;
  margin-right: 5px;
}

.info-card {
  margin: 15px;
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #3498db;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
}

.info-icon {
  margin-right: 10px;
  font-size: 18px;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 5px;
  display: block;
}

.info-value {
  font-size: 15px;
  color: #333;
}

.description {
  font-size: 15px;
  color: #666;
  line-height: 1.5;
}

.attendees-list {
  margin-top: 10px;
}

.attendee-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.attendee-item:last-child {
  border-bottom: none;
}

.attendee-avatar {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.attendee-name {
  flex: 1;
  font-size: 15px;
  color: #333;
}

.attendee-status {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  background-color: #f0f0f0;
  color: #666;
}

.status-accepted {
  background-color: #e8f7f0;
  color: #2ecc71;
}

.status-pending {
  background-color: #fef5e9;
  color: #f39c12;
}

.status-rejected {
  background-color: #fcedeb;
  color: #e74c3c;
}

.equipment-list {
  display: flex;
  flex-wrap: wrap;
}

.equipment-item {
  display: flex;
  align-items: center;
  margin-right: 15px;
  margin-bottom: 10px;
}

.equipment-icon {
  margin-right: 5px;
  font-size: 16px;
}

.equipment-name {
  font-size: 14px;
  color: #666;
}

.attachment-list {
  margin-top: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.attachment-item:last-child {
  border-bottom: none;
}

.attachment-icon {
  font-size: 20px;
  margin-right: 10px;
}

.attachment-info {
  flex: 1;
}

.attachment-name {
  font-size: 15px;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

.attachment-size {
  font-size: 12px;
  color: #999;
}

.reject-reason {
  font-size: 15px;
  color: #e74c3c;
  line-height: 1.5;
}

.approval-info {
  font-size: 14px;
  color: #666;
}

.approval-item {
  margin-bottom: 8px;
  display: flex;
}

.approval-label {
  color: #999;
  width: 80px;
}

.approval-value {
  flex: 1;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 15px;
  background-color: #fff;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
}

.action-btn {
  flex: 1;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 20px;
  font-size: 15px;
  margin: 0 5px;
}

.cancel-btn {
  background-color: #fff;
  color: #e74c3c;
  border: 1px solid #e74c3c;
}

.primary-btn {
  background-color: #3498db;
  color: #fff;
}

.enter-btn {
  background-color: #2ecc71;
  color: #fff;
}

.start-btn {
  background-color: #f39c12;
  color: #fff;
}

.minutes-btn {
  background-color: #9b59b6;
  color: #fff;
}

.status-in-progress {
  background-color: #3498db;
}

.status-completed {
  background-color: #27ae60;
}
</style> 