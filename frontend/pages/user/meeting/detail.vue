<template>
  <view class="meeting-detail-container">
    <!-- 面包屑导航 -->
    <view class="breadcrumb">
      <view class="breadcrumb-item" @click="navigateBack">
        {{ fromPage === 'schedule' ? '日程' : '会议列表' }}
      </view>
      <text class="breadcrumb-separator">/</text>
      <view class="breadcrumb-item">会议详情</view>
    </view>
    
    <view class="status-bar" :class="getStatusClass(meeting.status)">
      <text class="status-text">{{ getStatusText(meeting.status) }}</text>
    </view>
    
    <view class="meeting-header">
      <view class="meeting-title">{{ meeting.title }}</view>
    </view>
    
    <view class="info-card">
      <view class="card-title">会议信息</view>
      
      <view class="info-section">
        <view class="info-item">
          <text class="info-icon">📋</text>
          <view class="info-content">
            <text class="info-label">主题</text>
            <text class="info-value">{{ meeting.topic || '未填写主题' }}</text>
          </view>
        </view>
        
        <view class="info-item">
          <text class="info-icon">👤</text>
          <view class="info-content">
            <text class="info-label">预约人</text>
            <text class="info-value">{{ meeting.booker || '未知' }}</text>
          </view>
        </view>
        
        <view class="info-item">
          <text class="info-icon">🕒</text>
          <view class="info-content">
            <text class="info-label">时间</text>
            <text class="info-value">{{ meeting.reserveDate ? meeting.reserveDate + ' ' + meeting.startTime + '-' + meeting.endTime : '未知时间' }}</text>
          </view>
        </view>
        
        <view class="info-item">
          <text class="info-icon">📍</text>
          <view class="info-content">
            <text class="info-label">地点</text>
            <text class="info-value">{{ meeting.room || '未指定地点' }}</text>
          </view>
        </view>
        
        <view class="info-item" v-if="meeting.description">
          <text class="info-icon">📝</text>
          <view class="info-content">
            <text class="info-label">描述</text>
            <text class="info-value description-text">{{ meeting.description }}</text>
          </view>
        </view>
        
        <view class="info-item">
          <text class="info-icon">🔄</text>
          <view class="info-content">
            <text class="info-label">状态</text>
            <text class="info-value status-text" :class="getStatusClass(meeting.status)">{{ meeting.status }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="info-card">
      <view class="card-title">会议说明</view>
      <view class="description">{{ meeting.description || '暂无会议说明' }}</view>
    </view>
    
    <view class="attendees-list">
      <view class="section-title">参会人员</view>
      <view v-if="meeting.attendees && meeting.attendees.length > 0" class="attendees-container">
        <view class="attendee-item" v-for="(attendee, index) in meeting.attendees" :key="attendee.id || index">
          <image :src="attendee.avatar || '/static/avatar/default-user.svg'" mode="aspectFill" class="attendee-avatar" />
          <view class="attendee-info">
            <view class="attendee-name">{{ attendee.name || '未知用户' }}</view>
          </view>
        </view>
      </view>
      <view v-else-if="meeting.participants && meeting.participants.length > 0" class="attendees-container">
        <view class="attendee-item" v-for="(participant, index) in meeting.participants" :key="participant.id || index">
          <image :src="participant.avatar || '/static/avatar/default-user.svg'" mode="aspectFill" class="attendee-avatar" />
          <view class="attendee-info">
            <view class="attendee-name">{{ participant.name || (participant.username || '未知用户') }}</view>
          </view>
        </view>
      </view>
      <view v-else class="empty-attendees">
        <text>暂无参会人员</text>
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
    
    <!-- 议程列表 -->
    <view class="info-card" v-if="meeting.subtopics && meeting.subtopics.length > 0">
      <view class="card-title">会议议程</view>
      <view class="agenda-list">
        <view 
          class="agenda-item" 
          v-for="(item, index) in meeting.subtopics" 
          :key="item.id || index"
        >
          <view class="agenda-time">{{ formatAgendaTime(item) }}</view>
          <view class="agenda-content">
            <view class="agenda-title">{{ item.title || '未命名议程' }}</view>
            <view class="agenda-description" v-if="item.content">{{ item.content }}</view>
            
            <!-- 议程项的文件列表 -->
            <view class="agenda-files" v-if="item.files && item.files.length > 0">
              <view 
                class="file-item" 
                v-for="(file, fileIndex) in item.files" 
                :key="file.id || fileIndex"
                @click="openAttachment(file)"
              >
                <text class="file-icon">{{ getFileIcon(getFileType(file.name || file.fileName)) }}</text>
                <view class="file-info">
                  <text class="file-name">{{ file.name || file.fileName || '未命名文件' }}</text>
                  <text class="file-size" v-if="file.size">{{ formatFileSize(file.size) }}</text>
                </view>
              </view>
            </view>
          </view>
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
      
      <!-- 已通过且已开始的会议可以进入会议室 -->
      <button 
        v-if="meeting.status === 'approved'" 
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
import api from '../../../api/index'

export default {
  data() {
    return {
      id: '',
      meeting: {
        id: '',
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        reserveDate: '',
        room: '',
        status: 'pending',
        booker: '',
        participants: [],
        subtopics: [],
        attachments: [],
        equipment: []
      },
      isLoading: true,
      userId: null,
      files: [],
      loading: {
        participants: false,
        subtopics: false,
        files: false
      },
      fromPage: 'list', // 默认来源是会议列表
      originalMeetingData: null,
      source: null
    };
  },
  created() {
    // 尝试从存储获取用户ID
    try {
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo && userInfo.id) {
        this.userId = userInfo.id.toString();
      } else {
        console.warn('未能从存储获取用户信息，使用默认ID');
      }
    } catch (e) {
      console.error('获取用户信息失败:', e);
    }
  },
  computed: {
    canOperate() {
      // 检查当前用户是否有操作权限（会议发起人或参与者）
      return this.isOrganizer || this.meeting.participants.some(participant => participant.id === this.userId);
    },
    isOrganizer() {
      // 检查当前用户是否是组织者
      return this.meeting.organizer && this.meeting.organizer.id === this.userId;
    },
    isMeetingStarted() {
      const now = new Date();
      const startTime = new Date(this.meeting.startTime);
      return now >= startTime;
    }
  },
  onLoad(options) {
    console.log('Entering Detail Page with:', options);
    
    // 从路由参数获取会议id
    if (options.id) {
      this.id = options.id;
      console.log('会议ID:', this.id);
      
      // 记录来源页面
      if (options.from) {
        this.source = options.from;
        console.log('来源页面:', this.source);
      }
      
      // 如果传递了会议信息，使用传递的信息初始化
      if (options.meetingInfo) {
        try {
          const meetingInfo = JSON.parse(decodeURIComponent(options.meetingInfo));
          console.log('收到预加载的会议信息:', meetingInfo);
          
          // 保存原始数据用于调试
          this.originalMeetingData = meetingInfo;
          
          // 更新会议数据，但保留id以便API调用
          const meetingId = options.id || meetingInfo.id;
          this.id = meetingId; // 确保id字段被设置
          
          // 将传递的会议信息合并到meeting对象
          this.meeting = {
            ...this.meeting, // 保留默认结构
            ...meetingInfo,  // 添加传递的数据
            id: meetingId    // 确保ID一致
          };
          
          console.log('使用传递的会议信息初始化了详情页:', JSON.stringify(this.meeting));
          
          // 处理时间格式
          if (this.meeting.startTime && this.meeting.startTime.includes(' ')) {
            this.meeting.startTime = this.meeting.startTime.split(' ')[1];
          }
          
          if (this.meeting.endTime && this.meeting.endTime.includes(' ')) {
            this.meeting.endTime = this.meeting.endTime.split(' ')[1];
          }
          
          // 不再调用API获取会议详情
          this.isLoading = false;
          
          // 只获取参会人员信息
          this.fetchParticipants();
        } catch (e) {
          console.error('解析传递的会议信息失败:', e);
          uni.showToast({
            title: '解析会议信息失败',
            icon: 'none'
          });
        }
      } else {
        // 如果没有传递会议信息，则调用API获取
        this.fetchMeetingDetail();
      }
    } else {
      console.error('未提供会议ID');
      uni.showToast({
        title: '无效的会议',
        icon: 'none'
      });
      
      // 延迟返回
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  methods: {
    fetchMeetingDetail() {
      this.isLoading = true;
      console.log('开始获取会议详情，ID:', this.id);
      
      // 同时获取会议详情和参会人员信息
      Promise.all([
        api.meeting.getMeetingDetail(this.id),
        api.participant.getParticipantList(this.id)
      ])
        .then(([meetingRes, participantsRes]) => {
          // 处理会议详情
          if (meetingRes.code === 200 && meetingRes.data) {
            console.log('API返回的会议详情:', meetingRes.data);
            
            // 保留原始的预约人信息
            const originalBooker = this.meeting.booker;
            
            // 更新会议数据，但保留原始的预约人信息
            this.meeting = {
              ...meetingRes.data,
              booker: originalBooker || meetingRes.data.booker // 优先使用原始预约人信息
            };
            
            // 处理时间格式
            if (this.meeting.startTime && this.meeting.startTime.includes(' ')) {
              this.meeting.startTime = this.meeting.startTime.split(' ')[1];
            }
            
            if (this.meeting.endTime && this.meeting.endTime.includes(' ')) {
              this.meeting.endTime = this.meeting.endTime.split(' ')[1];
            }
          }
          
          // 处理参会人员信息
          if (participantsRes.code === 200 && participantsRes.data) {
            const participants = Array.isArray(participantsRes.data) ? participantsRes.data : [];
            
            // 格式化参会人员数据
            this.meeting.participants = participants.map(p => ({
              id: p.id || p.userId || '',
              name: p.name || p.username || p.userName || '未知用户',
              username: p.username || p.userName || p.name || '',
              avatar: p.avatar || p.avatarUrl || '',
              status: p.status || 'pending'
            }));
          }
        })
        .catch(err => {
          console.error('获取会议详情或参会人员异常:', err);
          
          // 如果API调用异常但有预加载数据，则使用预加载数据
          if (this.originalMeetingData) {
            console.log('API调用异常，使用预加载的会议信息');
            uni.showToast({
              title: '使用缓存数据显示',
              icon: 'none'
            });
          } else {
            uni.showToast({
              title: '获取会议详情失败，请稍后重试',
              icon: 'none'
            });
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    
    // 获取参会人员
    fetchParticipants() {
      this.loading.participants = true;
      return api.participant.getParticipantList(this.id)
        .then(res => {
          if (res.code === 200 && res.data) {
            // 处理参会人员数据
            const participants = Array.isArray(res.data) ? res.data : [];
            
            // 格式化参会人员数据
            const formattedParticipants = participants.map(p => ({
              id: p.id || p.userId || '',
              name: p.name || p.username || p.userName || '未知用户',
              username: p.username || p.userName || p.name || '',
              avatar: p.avatar || p.avatarUrl || '',
              status: p.status || 'pending'
            }));
            
            this.meeting.attendees = formattedParticipants;
            return res;
          }
          return res;
        })
        .catch(err => {
          return { code: 500, message: '获取参会人员失败', data: [] };
        })
        .finally(() => {
          this.loading.participants = false;
        });
    },
    
    // 获取会议子议题/议程
    fetchSubtopics() {
      this.loading.subtopics = true;
      return api.subtopic.getSubtopicsByReservationId(this.id)
        .then(res => {
          if (res.code === 200 && res.data) {
            // 处理子议题数据
            const subtopics = Array.isArray(res.data) ? res.data : [];
            this.meeting.subtopics = subtopics;
            
            // 提取附件信息
            const attachments = [];
            subtopics.forEach(topic => {
              if (topic.files && Array.isArray(topic.files)) {
                topic.files.forEach(file => {
                  attachments.push({
                    id: file.id || file.fileId,
                    name: file.name || file.fileName || '未命名文件',
                    type: this.getFileType(file.name || file.fileName),
                    size: file.size || 0,
                    fileKey: file.fileKey,
                    subtopicId: topic.id
                  });
                });
              }
            });
            
            this.meeting.attachments = attachments;
            return res;
          }
          return res;
        })
        .catch(err => {
          return { code: 500, message: '获取会议子议题失败', data: [] };
        })
        .finally(() => {
          this.loading.subtopics = false;
        });
    },
    
    // 获取文件类型
    getFileType(fileName) {
      if (!fileName) return 'unknown';
      const extension = fileName.split('.').pop().toLowerCase();
      return extension;
    },
    
    // 下载文件
    downloadFile(fileKey) {
      if (!fileKey) {
        uni.showToast({
          title: '文件标识符无效',
          icon: 'none'
        });
        return;
      }
      
      uni.showLoading({
        title: '正在获取文件...'
      });
      
      api.file.getFileUrl(fileKey)
        .then(res => {
          if (res.code === 200 && res.data && res.data.url) {
            const url = res.data.url;
            
            // 打开文件
            uni.showLoading({
              title: '正在打开文件...'
            });
            
            // 使用系统浏览器打开文件
            uni.setClipboardData({
              data: url,
              success: () => {
                uni.hideLoading();
                uni.showModal({
                  title: '文件链接已复制',
                  content: '文件链接已复制到剪贴板，您可以在浏览器中打开查看',
                  showCancel: false
                });
              },
              fail: () => {
                uni.hideLoading();
                uni.showToast({
                  title: '复制链接失败',
                  icon: 'none'
                });
              }
            });
          } else {
            uni.hideLoading();
            uni.showToast({
              title: '获取文件地址失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          uni.hideLoading();
          uni.showToast({
            title: '获取文件地址失败',
            icon: 'none'
          });
        });
    },
    
    // 打开附件
    openAttachment(attachment) {
      if (attachment && attachment.fileKey) {
        this.downloadFile(attachment.fileKey);
      } else {
        uni.showToast({
          title: '无效的附件',
          icon: 'none'
        });
      }
    },
            
            // 获取附件信息
    fetchAttachments() {
      this.loading.files = true;
      
      const files = this.meeting.files;
      if (!files || !Array.isArray(files) || files.length === 0) {
        this.loading.files = false;
        return;
      }
      
      // 处理文件获取逻辑
      this.files = files.map(file => {
        return {
          ...file,
          name: file.name || file.fileName || '未命名文件',
          url: file.url || '',
          type: file.type || this.getFileType(file.name || file.fileName || '')
        };
      });
      
      // 移除console.log
      this.loading.files = false;
    },
    
    startMeeting() {
      uni.showLoading({
        title: '处理中'
      });
      
      // 假设这里有一个开始会议的API
      setTimeout(() => {
        // 模拟API调用
        const success = Math.random() > 0.2; // 80%的成功率
        
        if (success) {
          uni.hideLoading();
          uni.showToast({
            title: '会议已开始',
            icon: 'success'
          });
          
          // 更新会议状态
          this.meeting.status = 'in-progress';
          
          // 跳转到会议室页面
          setTimeout(() => {
            this.enterMeetingRoom();
          }, 1000);
          } else {
          // 模拟失败
          uni.hideLoading();
            uni.showToast({
            title: '开始会议失败，请稍后重试',
              icon: 'none'
            });
          }
      }, 1500);
    },
    
    viewMeetingMinutes() {
      // 导航到会议纪要页面
      uni.navigateTo({
        url: `/pages/user/meeting/minutes?id=${this.id}`
      });
    },
    
    handleBack() {
      // 优先尝试返回上一页
      uni.navigateBack({
        fail: () => {
          // 如果无法返回上一页，则导航到会议列表
          uni.navigateTo({
            url: '/pages/user/meeting/list'
          });
        }
      });
    },
    
    navigateBack() {
      if (this.source === 'schedule') {
        // 返回日程页面
        uni.navigateTo({
          url: '/pages/user/schedule'
        });
      } else if (this.source === 'list') {
        // 返回会议列表页面
        uni.navigateTo({
          url: '/pages/user/meeting/list'
        });
      } else {
        // 默认返回上一页
        uni.navigateBack();
      }
    },
    
    cancelMeeting() {
      uni.showModal({
        title: '确认取消',
        content: '确定要取消该会议吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中'
            });
            
            api.meeting.cancelMeeting(this.meeting.id)
              .then(res => {
                if (res.code === 200) {
                  uni.showToast({
                    title: '会议已取消',
                    icon: 'success'
                  });
                  
                  // 刷新会议详情
                  setTimeout(() => {
                    this.fetchMeetingDetail();
                  }, 1500);
                } else {
                  uni.showToast({
                    title: res.message || '取消会议失败',
                    icon: 'none'
                  });
                }
              })
              .catch(err => {
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
    
    editMeeting() {
      uni.navigateTo({
        url: `/pages/user/meeting/create?id=${this.id}`
      });
    },
    
    enterMeetingRoom() {
      console.log('从详情页进入会议室，传递完整会议信息:', this.meeting);
      const meetingInfo = encodeURIComponent(JSON.stringify(this.meeting));
      uni.navigateTo({
        url: `/pages/user/meeting/room?id=${this.meeting.id}&meetingInfo=${meetingInfo}`
      });
    },
    
    getStatusClass(status) {
      if (!status) return '';
      
      const statusMap = {
        'pending': 'status-pending',
        'approved': 'status-approved',
        'in-progress': 'status-in-progress',
        'completed': 'status-completed',
        'rejected': 'status-rejected',
        'cancelled': 'status-canceled',
        'canceled': 'status-canceled',
        
        // 中文状态映射
        '待审核': 'status-pending',
        '已通过': 'status-approved',
        '进行中': 'status-in-progress',
        '已完成': 'status-completed',
        '已拒绝': 'status-rejected',
        '已取消': 'status-canceled'
      };
      
      return statusMap[status] || '';
    },
    
    getStatusText(status) {
      // 先将状态标准化为英文代码
      let normalizedStatus = this.normalizeStatus(status);
      
      // 然后将英文代码转换为中文显示文本
      const statusMap = {
        'pending': '待审批',
        'approved': '已通过',
        'in-progress': '进行中',
        'completed': '已完成',
        'rejected': '已拒绝',
        'cancelled': '已取消'
      };
      
      return statusMap[normalizedStatus] || '未知状态';
    },
    
    normalizeStatus(status) {
      // 检查输入是否为会议对象
      if (typeof status === 'object' && status !== null) {
        // 如果是会议对象，获取其status属性
        status = status.status || 'pending';
      }
      
      // 处理数字类型状态
      if (typeof status === 'number' || /^\d+$/.test(status)) {
        const numStatus = parseInt(status);
        switch(numStatus) {
          case 0: return 'pending';
          case 1: return 'approved';
          case 2: return 'in-progress';
          case 3: return 'completed';
          case 4: return 'cancelled';  // 统一使用英式拼写
          case 5: return 'rejected';
          default: return 'pending';
        }
      } else if (typeof status === 'string') {
        // 统一小写处理
        status = status.toLowerCase();
        
        // 处理中文状态
        if (status === '待审核' || status === '待审批') {
          return 'pending';
        } else if (status === '已通过' || status === '已审批') {
          return 'approved';
        } else if (status === '进行中') {
          return 'in-progress';
        } else if (status === '已完成') {
          return 'completed';
        } else if (status === '已拒绝') {
          return 'rejected';
        } else if (status === '已取消') {
          return 'cancelled';
        }
        
        // 统一 canceled/cancelled 拼写
        if (status === 'canceled' || status === 'cancelled') {
          return 'cancelled';  // 统一使用英式拼写
        }
        
        // 统一状态名称
        if (status.includes('pend') || status.includes('wait') || status.includes('creat')) {
          return 'pending';
        } else if (status.includes('progress') || status.includes('ongo') || status.includes('start')) {
          return 'in-progress';
        } else if (status.includes('complet') || status.includes('finish') || status.includes('end')) {
          return 'completed';
        } else if (status.includes('cancel')) {
          return 'cancelled';
        } else if (status.includes('reject') || status.includes('deny')) {
          return 'rejected';
        } else if (status.includes('approv') || status.includes('accept')) {
          return 'approved';
        }
      }
      
      return 'pending';
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
    
    formatAgendaTime(item) {
      // 从议题标题中提取时间信息
      if (!item || !item.title) return '';
      
      // 检查标题是否包含时间格式 "HH:MM - 内容"
      const timeMatch = item.title.match(/^(\d{1,2}:\d{2})\s*-\s*/);
      if (timeMatch) {
        return timeMatch[1]; // 返回匹配到的时间
      }
      
      // 如果没有时间格式，尝试从标题中识别时间
      if (item.startTime) {
        return item.startTime;
      }
      
      return '';
    }
  }
};
</script>

<style>
.meeting-detail-container {
  background-color: #f5f7fa;
  padding-bottom: 80px;
  padding-top: 10px;
}

.breadcrumb {
  display: flex;
  padding: 10px 15px;
  background-color: #fff;
  font-size: 14px;
  color: #666;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin: 0 10px 15px;
  border-radius: 4px;
}

.breadcrumb-item {
  color: #3498db;
  cursor: pointer;
}

.breadcrumb-item:last-child {
  color: #333;
  font-weight: 500;
  cursor: default;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #ccc;
}

.status-bar {
  padding: 15px;
  text-align: center;
  background-color: #3498db;
  color: white;
  font-weight: bold;
  margin: 0 10px 15px;
  border-radius: 4px;
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
  margin: 0 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.meeting-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.info-card {
  margin: 15px 10px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
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

.info-section {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 15px;
}

.info-item {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.info-icon {
  margin-right: 12px;
  font-size: 20px;
  width: 24px;
  text-align: center;
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
  line-height: 1.4;
  word-break: break-all;
}

.description {
  font-size: 15px;
  color: #666;
  line-height: 1.5;
  padding: 5px;
}

.attendees-list {
  margin: 15px 10px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #3498db;
}

.attendees-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 15px;
}

.attendee-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  background-color: #f8f9fa;
  width: calc(50% - 6px);
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.attendee-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f0f7ff;
}

.attendee-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  background-color: #f5f5f5;
  border: 2px solid #eaeaea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

.attendee-info {
  flex: 1;
}

.attendee-name {
  font-size: 15px;
  color: #333;
  line-height: 1.4;
  font-weight: 500;
}

.empty-attendees {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #999;
  font-size: 14px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #ddd;
  margin-top: 15px;
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
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 20px;
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
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: #f8f9fa;
}

.attachment-item:last-child {
  margin-bottom: 0;
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
  padding: 10px;
  background-color: #fef0f0;
  border-radius: 6px;
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
  z-index: 100;
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

/* 议程列表样式 */
.agenda-list {
  margin-top: 10px;
}

.agenda-item {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.agenda-time {
  min-width: 60px;
  color: #666;
  font-weight: bold;
  padding-right: 10px;
}

.agenda-content {
  flex: 1;
}

.agenda-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.agenda-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.agenda-files {
  margin-top: 10px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 5px;
}

.file-icon {
  font-size: 20px;
  margin-right: 10px;
}

.file-info {
  flex: 1;
}

.file-name {
  display: block;
  font-size: 14px;
}

.file-size {
  display: block;
  font-size: 12px;
  color: #999;
}

@media screen and (max-width: 500px) {
  .attendee-item {
    width: 100%;
  }
}
</style>