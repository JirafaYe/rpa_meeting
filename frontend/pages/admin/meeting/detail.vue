<template>
  <view class="meeting-detail-container">
    <view class="detail-card">
      <view class="card-header">
        <text class="header-title">会议详情</text>
        <view class="header-status">
          <text class="badge" :class="getStatusClass(meeting.status)">{{meeting.statusText}}</text>
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
            <text class="info-value">{{meeting.user}} ({{meeting.department}})</text>
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
            <text class="attendee-role">{{attendee.department}} - {{attendee.role}}</text>
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
      <view class="card-footer" v-if="meeting.status === 'pending'">
        <button class="btn-approve" @click="handleApprove">通过申请</button>
        <button class="btn-reject" @click="handleReject">拒绝申请</button>
      </view>
      <view class="card-footer" v-if="meeting.status === 'approved'">
        <button class="btn-cancel" @click="handleCancel">取消会议</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      meeting: {
        id: 1,
        title: '项目启动会议',
        date: '2023-07-20',
        time: '09:30 - 11:00',
        room: '会议室A',
        user: '张三',
        department: '研发部',
        purpose: '讨论新项目的目标、时间线和任务分配，确定项目组成员及职责。',
        status: 'pending',
        statusText: '待审批',
        attendees: [
          { name: '张三', department: '研发部', role: '项目经理' },
          { name: '李四', department: '研发部', role: '技术负责人' },
          { name: '王五', department: '产品部', role: '产品经理' },
          { name: '赵六', department: '设计部', role: 'UI设计师' },
          { name: '钱七', department: '测试部', role: '测试负责人' }
        ],
        equipment: [
          '投影仪',
          '白板',
          'HDMI接口'
        ],
        remark: '请提前15分钟做好准备，会议文档已上传至共享文件夹。',
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
    fetchMeetingDetail() {
      uni.showLoading({
        title: '加载中...'
      });
      
      // 模拟网络请求
      setTimeout(() => {
        uni.hideLoading();
        
        // 实际项目中应该调用API获取会议详情
        if (this.id === '2') {
          this.meeting = {
            id: 2,
            title: '团队周会',
            date: '2023-07-20',
            time: '14:00 - 15:30',
            room: '会议室B',
            user: '李四',
            department: '研发部',
            purpose: '汇报本周工作进度，讨论遇到的问题，安排下周工作计划。',
            status: 'approved',
            statusText: '已通过',
            attendees: [
              { name: '李四', department: '研发部', role: '技术负责人' },
              { name: '王五', department: '产品部', role: '产品经理' },
              { name: '赵六', department: '设计部', role: 'UI设计师' },
              { name: '钱七', department: '测试部', role: '测试负责人' }
            ],
            equipment: [
              '投影仪',
              '视频会议系统'
            ],
            remark: '需要各部门负责人准备周报。',
            approvalInfo: {
              approver: '管理员',
              time: '2023-07-19 16:35',
              comment: '已审批通过，请准时参加。'
            }
          };
        } else if (this.id === '3') {
          this.meeting = {
            id: 3,
            title: '产品评审会议',
            date: '2023-07-21',
            time: '10:00 - 12:00',
            room: '会议室C',
            user: '王五',
            department: '产品部',
            purpose: '评审新版本产品原型，确认需求和功能点。',
            status: 'rejected',
            statusText: '已拒绝',
            attendees: [
              { name: '王五', department: '产品部', role: '产品经理' },
              { name: '张三', department: '研发部', role: '项目经理' },
              { name: '赵六', department: '设计部', role: 'UI设计师' }
            ],
            equipment: [
              '电子白板'
            ],
            remark: '需要提前准备产品原型展示。',
            approvalInfo: {
              approver: '管理员',
              time: '2023-07-19 17:20',
              comment: '该时间段会议室已被预订，请选择其他时间或会议室。'
            }
          };
        }
      }, 500);
    },
    getStatusClass(status) {
      const statusMap = {
        'pending': 'badge-warning',
        'approved': 'badge-success',
        'rejected': 'badge-danger',
        'cancelled': 'badge-secondary'
      };
      return statusMap[status] || 'badge-secondary';
    },
    handleApprove() {
      uni.showModal({
        title: '确认通过',
        content: `确定要通过"${this.meeting.title}"的会议申请吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            // 模拟网络请求
            setTimeout(() => {
              uni.hideLoading();
              
              // 更新会议状态
              this.meeting.status = 'approved';
              this.meeting.statusText = '已通过';
              this.meeting.approvalInfo = {
                approver: '管理员',
                time: new Date().toLocaleString('zh-CN', { hour12: false }),
                comment: '已审批通过，请准时参加。'
              };
              
              uni.showToast({
                title: '已通过审批',
                icon: 'success'
              });
            }, 500);
          }
        }
      });
    },
    handleReject() {
      uni.showModal({
        title: '拒绝申请',
        content: '请输入拒绝原因',
        editable: true,
        placeholderText: '请输入拒绝原因',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            // 模拟网络请求
            setTimeout(() => {
              uni.hideLoading();
              
              // 更新会议状态
              this.meeting.status = 'rejected';
              this.meeting.statusText = '已拒绝';
              this.meeting.approvalInfo = {
                approver: '管理员',
                time: new Date().toLocaleString('zh-CN', { hour12: false }),
                comment: res.content || '申请被拒绝'
              };
              
              uni.showToast({
                title: '已拒绝申请',
                icon: 'success'
              });
            }, 500);
          }
        }
      });
    },
    handleCancel() {
      uni.showModal({
        title: '确认取消',
        content: `确定要取消"${this.meeting.title}"的会议吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            // 模拟网络请求
            setTimeout(() => {
              uni.hideLoading();
              
              // 更新会议状态
              this.meeting.status = 'cancelled';
              this.meeting.statusText = '已取消';
              
              uni.showToast({
                title: '已取消会议',
                icon: 'success'
              });
            }, 500);
          }
        }
      });
    }
  }
}
</script>

<style>
.meeting-detail-container {
  padding: 15px;
  background-color: #f5f7fa;
  min-height: 100vh;
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
}

.header-title {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
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