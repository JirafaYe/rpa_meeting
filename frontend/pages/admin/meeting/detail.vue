<template>
  <admin-layout 
    title="会议详情" 
    active-path="/pages/admin/meeting/list"
    parent-path="/pages/admin/meeting/list"
    parent-title="会议列表">
    <view class="meeting-detail-container">
      <view class="detail-card">
        <view class="card-header">
          <text class="card-header-title">会议详情</text>
          <view class="header-actions">
            <button class="btn-back" @click="handleBack">返回列表</button>
            <view class="header-status">
              <text class="badge" :class="getStatusClass(meeting.status)">{{meeting.status}}</text>
            </view>
          </view>
        </view>
        
        <!-- 会议基本信息 -->
        <view class="card-body">
          <view class="detail-title">
            <text>{{meeting.title}}</text>
          </view>
          
          <view class="info-group">
            <view class="info-item">
              <text class="info-label">会议时间</text>
              <text class="info-value">{{meeting.date}} {{meeting.time}}</text>
            </view>
            
            <view class="info-item">
              <text class="info-label">会议室</text>
              <text class="info-value">{{meeting.room}}</text>
            </view>
            
            <view class="info-item">
              <text class="info-label">预约人</text>
              <text class="info-value">{{meeting.user}}</text>
            </view>
            
            <view class="info-item">
              <text class="info-label">参会人数</text>
              <text class="info-value">{{meeting.attendees.length}}人</text>
            </view>
            
            <view class="info-item full-width">
              <text class="info-label">会议目的</text>
              <text class="info-value">{{meeting.purpose}}</text>
            </view>
          </view>
          
          <!-- 参会人员信息 -->
          <view class="section-title">参会人员</view>
          <view class="attendees-list">
            <view class="attendee-item" v-for="(attendee, index) in meeting.attendees" :key="index">
              <text class="attendee-name">{{attendee.name}}</text>
            </view>
          </view>
          
          <!-- 会议设备需求 -->
          <view class="section-title">设备需求</view>
          <view class="equipment-list">
            <view class="equipment-item" v-for="(item, index) in meeting.equipment" :key="index">
              <text class="iconfont icon-check equipment-icon"></text>
              <text>{{item}}</text>
            </view>
            <view class="no-data" v-if="meeting.equipment.length === 0">
              <text>无特殊设备需求</text>
            </view>
          </view>
          
          <!-- 备注信息 -->
          <view class="section-title">备注信息</view>
          <view class="remark-content">
            <text v-if="meeting.remark">{{meeting.remark}}</text>
            <text v-else class="no-data">无备注信息</text>
          </view>
          
          <!-- 审批状态信息 -->
          <view class="approval-info" v-if="meeting.approvalInfo">
            <view class="section-title">审批信息</view>
            <view class="info-item">
              <text class="info-label">审批人</text>
              <text class="info-value">{{meeting.approvalInfo.approver}}</text>
            </view>
            <view class="info-item">
              <text class="info-label">审批时间</text>
              <text class="info-value">{{meeting.approvalInfo.time}}</text>
            </view>
            <view class="info-item full-width" v-if="meeting.approvalInfo.comment">
              <text class="info-label">审批备注</text>
              <text class="info-value">{{meeting.approvalInfo.comment}}</text>
            </view>
          </view>
        </view>
        
        <!-- 操作按钮 -->
        <view class="card-footer" v-if="meeting.status === '待审核'">
          <button class="btn-approve" @click="handleApprove">通过申请</button>
          <button class="btn-reject" @click="handleReject">拒绝申请</button>
        </view>
        <view class="card-footer" v-if="meeting.status === '已通过'">
          <button class="btn-cancel" @click="handleCancel">取消会议</button>
        </view>
      </view>
    </view>
  </admin-layout>
</template>

<script>
import AdminLayout from '../../../components/admin/AdminLayout.vue'
import api from '../../../api'
import apiRequest from '../../../api/api'

export default {
  components: {
    AdminLayout
  },
  data() {
    return {
      id: null,
      loading: false,
      meeting: {
        id: '',
        title: '',
        date: '',
        time: '',
        room: '',
        user: '',
        department: '',
        purpose: '',
        status: '',
        statusText: '',
        attendees: [],
        equipment: [],
        remark: '',
        approvalInfo: null
      }
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      this.fetchMeetingDetail();
    } else {
      uni.showToast({
        title: '缺少会议ID',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  methods: {
    async fetchMeetingDetail() {
      this.loading = true;
      uni.showLoading({
        title: '加载中...'
      });
      
      try {
        // 获取会议列表，而不是直接获取详情
        const targetId = Number(this.id);
        console.log('正在查找ID为', targetId, '的会议');
        
        // 获取所有会议，不使用ID参数(后端可能不支持)
        const response = await apiRequest.getReservations({
          pageSize: 100, // 设置较大的页码，提高找到目标会议的概率
          sortBy: 'id'
        });
        
        if (response.code === 200 && response.data && response.data.list) {
          // 在返回的列表中查找目标ID的会议
          const meetingList = response.data.list;
          console.log('获取到', meetingList.length, '个会议，开始查找ID:', targetId);
          
          // 查找ID匹配的会议
          const targetMeeting = meetingList.find(m => 
            (m.id === targetId) || (m.id === this.id) || (String(m.id) === this.id)
          );
          
          if (targetMeeting) {
            console.log('找到匹配的会议:', targetMeeting);
            
            // 获取参会人员
            let participants = [];
            try {
              const participantsResponse = await apiRequest.getParticipants(this.id);
              if (participantsResponse.code === 200 && participantsResponse.data) {
                participants = participantsResponse.data;
              }
            } catch (err) {
              console.error('获取参会人员失败:', err);
            }
            
            // 构建会议数据对象
            this.meeting = {
              id: targetMeeting.id,
              title: targetMeeting.topic || targetMeeting.title || '无标题会议',
              date: targetMeeting.reserveDate || targetMeeting.date || '',
              time: `${targetMeeting.startTime || ''} - ${targetMeeting.endTime || ''}`,
              room: targetMeeting.roomName || targetMeeting.room || '',
              user: targetMeeting.booker || targetMeeting.reservationUser || targetMeeting.username || '',
              department: targetMeeting.department || '',
              purpose: targetMeeting.description || targetMeeting.purpose || '',
              status: this.getStatusFromMeeting(targetMeeting),
              attendees: participants.map(p => ({
                name: p.name || p.username || '',
                department: p.department || '',
                role: p.role || ''
              })),
              equipment: targetMeeting.equipment || [],
              remark: targetMeeting.remark || '',
              approvalInfo: targetMeeting.approvalInfo || null
            };
          } else {
            console.error('未找到ID为', targetId, '的会议');
            uni.showToast({
              title: '未找到会议',
              icon: 'none'
            });
          }
        } else {
          uni.showToast({
            title: response.message || '获取会议列表失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取会议详情失败:', error);
        uni.showToast({
          title: '获取会议详情失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
        uni.hideLoading();
      }
    },

    // 从会议数据中获取状态
    getStatusFromMeeting(meeting) {
      console.log('会议完整状态数据:', {
        status: meeting.status,
        isActive: meeting.isActive
      });
      
      // 如果有status字段且是字符串，直接使用
      if (typeof meeting.status === 'string' && meeting.status) {
        return meeting.status;
      }
      
      // 如果有isActive字段，处理isActive
      if (meeting.isActive !== undefined && meeting.isActive !== null) {
        if (meeting.isActive === 0) return '已通过';
        if (meeting.isActive === 1) return '待审核';
        if (meeting.isActive === 2) return '已拒绝';
        if (meeting.isActive === 3) return '已取消';
        // 数字转换
        if (typeof meeting.isActive === 'number') {
          const statusMap = {
            0: '已通过',
            1: '待审核',
            2: '已拒绝',
            3: '已取消'
          };
          return statusMap[meeting.isActive] || '待审核';
        }
      }
      
      // 如果status是数字，处理数字status
      if (typeof meeting.status === 'number') {
        const statusMap = {
          0: '待审核',
          1: '已通过',
          2: '已拒绝',
          3: '已取消'
        };
        return statusMap[meeting.status] || '待审核';
      }
      
      // 默认返回
      return '待审核';
    },

    getStatusClass(status) {
      const statusMap = {
        '待审核': 'badge-warning',
        '已通过': 'badge-success',
        '已拒绝': 'badge-danger',
        '已取消': 'badge-secondary',
        '进行中': 'badge-info',
        '已完成': 'badge-primary'
      };
      return statusMap[status] || 'badge-secondary';
    },
    async handleApprove() {
      try {
        await uni.showModal({
        title: '确认通过',
        content: `确定要通过"${this.meeting.title}"的会议申请吗？`,
        });
        
            uni.showLoading({
              title: '处理中...'
            });
            
        const response = await apiRequest.approveReservation(this.id, true);
        if (response.code === 200) {
              uni.showToast({
            title: '已通过申请',
                icon: 'success'
              });
          
          // 重新加载会议详情
          setTimeout(() => {
            this.fetchMeetingDetail();
            }, 500);
        } else {
          uni.showToast({
            title: response.msg ,
            icon: 'none'
          });
        }
      } catch (error) {
        if (error.errMsg !== 'showModal:fail cancel') {
          uni.showToast({
            title: '操作失败',
            icon: 'none'
          });
          console.error('审批失败:', error);
        }
      } finally {
        uni.hideLoading();
      }
    },
    async handleReject() {
      try {
        await uni.showModal({
          title: '确认拒绝',
          content: `确定要拒绝"${this.meeting.title}"的会议申请吗？`,
        });
        
            uni.showLoading({
              title: '处理中...'
            });
            
        const response = await apiRequest.approveReservation(this.id, false);
        if (response.code === 200) {
              uni.showToast({
                title: '已拒绝申请',
                icon: 'success'
              });
          
          // 重新加载会议详情
          setTimeout(() => {
            this.fetchMeetingDetail();
            }, 500);
        } else {
          uni.showToast({
            title: response.msg,
            icon: 'none'
          });
        }
      } catch (error) {
        if (error.errMsg !== 'showModal:fail cancel') {
          uni.showToast({
            title: '操作失败',
            icon: 'none'
          });
          console.error('拒绝失败:', error);
        }
      } finally {
        uni.hideLoading();
      }
    },
    async handleCancel() {
      try {
        await uni.showModal({
        title: '确认取消',
        content: `确定要取消"${this.meeting.title}"的会议吗？`,
        });
        
            uni.showLoading({
              title: '处理中...'
            });
            
        const response = await apiRequest.cancelReservation(this.id);
        if (response.code === 200) {
              uni.showToast({
                title: '已取消会议',
                icon: 'success'
              });
          
          // 重新加载会议详情
          setTimeout(() => {
            this.fetchMeetingDetail();
            }, 500);
        } else {
          uni.showToast({
            title: response.msg || '操作失败',
            icon: 'none'
          });
        }
      } catch (error) {
        if (error.errMsg !== 'showModal:fail cancel') {
          uni.showToast({
            title: '操作失败',
            icon: 'none'
          });
          console.error('取消失败:', error);
        }
      } finally {
        uni.hideLoading();
      }
    },
    handleBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style>
/* 这些样式不再需要了，因为我们使用了hideHeader属性
.admin-header {
  display: none !important;
}

.admin-main {
  padding-top: 15px !important;
  margin-top: 0 !important;
}
*/

.meeting-detail-container {
  padding: 15px;
  background-color: #f5f7fa;
}

.detail-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.card-header {
  background-color: #3498db;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.card-header-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.header-actions {
  display: flex;
  align-items: center;
}

.header-status {
  margin-left: 10px;
}

.btn-back {
  background-color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  color: #3498db;
  cursor: pointer;
  font-weight: 500;
  height: 32px;
  line-height: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-back:hover {
  background-color: #f8f9fa;
}

.badge {
  display: inline-block;
  padding: 3px 8px;
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

.badge-info {
  background-color: #3498db;
}

.badge-primary {
  background-color: #9b59b6;
}

.card-body {
  padding: 15px;
}

.detail-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.info-group {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.info-item {
  width: 50%;
  margin-bottom: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}

.info-item.full-width {
  width: 100%;
}

.info-label {
  display: block;
  font-size: 14px;
  color: #777;
  margin-bottom: 5px;
}

.info-value {
  font-size: 15px;
  color: #333;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 15px 0 10px;
  color: #333;
}

.attendees-list {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 10px;
}

.attendee-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.attendee-item:last-child {
  border-bottom: none;
}

.attendee-name {
  font-weight: bold;
  font-size: 15px;
  margin-right: 10px;
}

.attendee-role {
  font-size: 13px;
  color: #666;
}

.equipment-list {
  display: flex;
  flex-wrap: wrap;
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 10px;
}

.equipment-item {
  display: flex;
  align-items: center;
  margin-right: 15px;
  margin-bottom: 5px;
  font-size: 14px;
}

.equipment-icon {
  color: #2ecc71;
  margin-right: 5px;
}

.remark-content {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 10px;
  font-size: 14px;
  color: #333;
}

.approval-info {
  border-top: 1px dashed #eee;
  padding-top: 15px;
  margin-top: 15px;
}

.no-data {
  color: #999;
  font-style: italic;
}

.card-footer {
  display: flex;
  padding: 15px;
  border-top: 1px solid #eee;
  justify-content: flex-end;
}

.btn-approve, .btn-reject, .btn-cancel {
  height: 40px;
  padding: 0 20px;
  border-radius: 4px;
  color: #fff;
  margin-left: 10px;
}

.btn-approve {
  background-color: #2ecc71;
}

.btn-reject {
  background-color: #e74c3c;
}

.btn-cancel {
  background-color: #f39c12;
}

.iconfont {
  font-family: 'iconfont';
}

@media (max-width: 768px) {
  .info-item {
    width: 100%;
  }
}
</style> 