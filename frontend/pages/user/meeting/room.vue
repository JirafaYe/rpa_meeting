<template>
  <div class="meeting-container">
    <!-- 会议头部区域 -->
    <div class="meeting-header">
      <div class="meeting-title">
        <h2>{{ meeting.title }}</h2>
        <span :class="['meeting-status', meetingStatusClass]">{{ meetingStatusText }}</span>
      </div>
      <div class="meeting-info">
        <span class="meeting-time">
          {{ meeting.startTime }} ~ {{ meeting.endTime || '进行中' }}
        </span>
        <span class="meeting-location" v-if="meeting.location">
          {{ meeting.location }}
        </span>
        <span class="meeting-department" v-if="meeting.department">
          部门: {{ meeting.department }}
        </span>
        <span class="meeting-type" v-if="meeting.type">
          类型: {{ meeting.type }}
        </span>
      </div>
      <!-- 会议操作按钮区域 -->
      <div class="meeting-actions" v-if="isCreator && isMeetingActive">
        <button @click="confirmEndMeeting" class="end-meeting-btn">结束会议</button>
      </div>
      <!-- 会议结束提示 -->
      <div v-if="!isMeetingActive" class="meeting-status-notice">
        <p>此会议{{ meetingStatusText }}，{{ meeting.status === 'completed' ? '您正在查看历史记录' : '您可以查看会议信息' }}</p>
      </div>
    </div>

    <!-- 会议内容区域 -->
    <div class="meeting-content">
      <div class="tabs-container">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-item', { active: currentTab === tab.id }]"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </div>

      <div class="tab-content">
        <!-- 聊天面板 -->
        <div v-if="currentTab === 'chat'" class="meeting-panel">
          <div class="panel-header">
            <h3>实时聊天</h3>
          </div>
          <div class="chat-panel">
            <div class="chat-messages" ref="chatMessages">
              <div 
                v-for="(message, index) in messages" 
                :key="index" 
                :class="['message-item', message.sender === currentUser ? 'my-message' : '', message.isSystem ? 'system-message' : '']"
              >
                <div v-if="!message.isSystem" class="message-header">
                  <div class="user-avatar">
                    {{ message.sender ? message.sender.charAt(0).toUpperCase() : 'U' }}
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ message.sender }}</span>
                    <span class="message-time">{{ message.time }}</span>
                  </div>
                </div>
                <div class="message-content">
                  {{ message.content }}
                </div>
              </div>
            </div>
            <div class="chat-input">
              <div class="input-area">
                <input 
                  v-model="newMessage" 
                  @keyup.enter="sendMessage"
                  :disabled="!isMeetingActive"
                  class="message-input"
                  placeholder="请输入消息..." 
                />
              </div>
              <button 
                @click="sendMessage" 
                class="send-btn"
                :disabled="!newMessage.trim() || !isMeetingActive"
              >
                <i class="icon-send">➤</i>
              </button>
            </div>
          </div>
        </div>

        <!-- 议题面板 -->
        <div v-if="currentTab === 'agenda'" class="meeting-panel">
          <div class="panel-header">
            <h3>会议议题</h3>
            <button 
              v-if="isCreator && isMeetingActive" 
              @click="showAddAgendaModal = true" 
              class="add-btn"
            >添加议题</button>
          </div>
          <div class="agenda-list">
            <div v-for="item in agendaItems" :key="item.id" class="agenda-item">
              <div class="agenda-header">
                <h4>{{ item.title }}</h4>
                <div class="agenda-status">
                  <span :class="'status-badge status-' + item.status">{{ getAgendaStatusText(item.status) }}</span>
                </div>
              </div>
              <div class="agenda-info">
                <p>{{ item.description }}</p>
                <div class="agenda-details">
                  <span>负责人: {{ item.owner }}</span>
                  <span>时长: {{ item.duration }}分钟</span>
                </div>
              </div>
            </div>
            <div v-if="agendaItems.length === 0" class="empty-notice">
              <p>暂无议题</p>
            </div>
          </div>
        </div>

        <!-- 文件面板 -->
        <div v-if="currentTab === 'file'" class="meeting-panel">
          <div class="panel-header">
            <h3>会议文件</h3>
            <button 
              v-if="isMeetingActive" 
              @click="showUploadFileModal = true" 
              class="add-btn"
            >上传文件</button>
          </div>
          <div class="file-list">
            <div v-for="file in fileItems" :key="file.id" class="file-item">
              <div class="file-icon">
                <i :class="getFileIcon(file.type)"></i>
              </div>
              <div class="file-info">
                <div class="file-name">{{ file.name }}</div>
                <div class="file-meta">
                  <span>{{ formatFileSize(file.size) }}</span>
                  <span>上传时间: {{ file.uploadTime }}</span>
                  <span>上传者: {{ file.uploader }}</span>
                </div>
              </div>
              <div class="file-actions">
                <button @click="downloadFile(file)">下载</button>
                <button 
                  v-if="isMeetingActive"
                  @click="confirmDeleteFile(file.id)" 
                  class="delete-btn"
                >删除</button>
              </div>
            </div>
            <div v-if="fileItems.length === 0" class="empty-notice">
              <p>暂无文件</p>
            </div>
          </div>
        </div>

        <!-- 录音面板 -->
        <div v-if="currentTab === 'recording'" class="meeting-panel">
          <div class="panel-header">
            <h3>会议录音</h3>
            <button 
              v-if="isMeetingActive" 
              @click="toggleRecording" 
              :class="isRecording ? 'stop-btn' : 'record-btn'"
            >
              {{ isRecording ? '停止录音' : '开始录音' }}
            </button>
          </div>
          <div class="recording-list">
            <div v-for="recording in recordingItems" :key="recording.id" class="recording-item">
              <div class="recording-info">
                <div class="recording-name">{{ recording.name }}</div>
                <div class="recording-meta">
                  <span>时长: {{ recording.duration }}</span>
                  <span>创建时间: {{ recording.createTime }}</span>
                </div>
              </div>
              <div class="recording-actions">
                <button @click="playRecording(recording)">播放</button>
                <button @click="downloadRecording(recording)">下载</button>
                <button 
                  v-if="isMeetingActive"
                  @click="deleteRecording(recording.id)" 
                  class="delete-btn"
                >删除</button>
              </div>
            </div>
            <div v-if="recordingItems.length === 0" class="empty-notice">
              <p>暂无录音</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  getMeetingDetailAPI, 
  getMeetingAgendasAPI,
  getMeetingFilesAPI, 
  getMeetingRecordingsAPI, 
  getMeetingMessagesAPI, 
  sendMeetingChatMessage,
  uploadFile,
  uploadRecording
} from '@/api/meeting.js';

export default {
  data() {
    return {
      // 会议信息
      meetingId: '',
      meeting: {
        title: '加载中...',
        status: 'pending',
        startTime: '',
        endTime: '',
        organizer: {}
      },
      
      // 页面状态
      currentTab: 'chat',
      tabs: [
        { id: 'chat', name: '聊天' },
        { id: 'agenda', name: '议题' },
        { id: 'file', name: '文件' },
        { id: 'recording', name: '录音' }
      ],
      
      // 用户状态
      currentUser: '张三',
      isCreator: false,
      isMeetingActive: false,
      meetingStatusText: '未开始',
      meetingStatusClass: 'status-pending',
      
      // 聊天消息
      messages: [],
      newMessage: '',
      
      // 会议议题
      agendaItems: [],
      
      // 会议文件
      fileItems: [],
      showUploadFileModal: false,
      uploadForm: {
        fileName: '',
        fileType: 'doc',
        filePath: '',
        selectedFileName: '',
        agendaId: ''
      },
      uploadFileOptions: [
        { value: 'doc', label: '文档' },
        { value: 'ppt', label: '演示文稿' },
        { value: 'pdf', label: 'PDF' },
        { value: 'xls', label: '表格' },
        { value: 'img', label: '图片' },
        { value: 'other', label: '其他' }
      ],
      
      // 会议录音
      recordingItems: [],
      isRecording: false,
      recordingStartTime: null,
      recordingDuration: '00:00',
      recordingTimer: null,
      uploadRecordingModal: false,
      recordingForm: {
        name: '',
        filePath: '',
        fileName: '',
        description: ''
      }
    }
  },
  
  // 在onLoad生命周期中获取会议ID
  onLoad(options) {
    console.log('会议室页面加载参数:', options);
    
    // 获取会议ID
    this.meetingId = options.id || '';
    
    if (!this.meetingId) {
      console.error('缺少会议ID参数');
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      });
      
      // 延迟返回上一页
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
      return;
    }
    
    console.log('会议ID:', this.meetingId);
    
    // 加载会议数据
    this.initMeetingData();
  },

  // 在mounted生命周期中初始化其他数据
  mounted() {
    console.log('会议室页面初始化');
  },

  methods: {
    // 初始化会议数据
    initMeetingData() {
      if (!this.meetingId) {
        console.error('会议ID不能为空');
        return;
      }
      
      console.log('初始化会议数据:', this.meetingId);
      
      // 显示加载中
      uni.showLoading({
        title: '加载中...'
      });
      
      // 获取会议详情
      getMeetingDetailAPI(this.meetingId)
        .then(res => {
          console.log('会议详情API返回:', res);
          
          if (res.code === 200 && res.data) {
            // 设置会议数据
            this.meeting = res.data;
            
            // 设置页面标题
            uni.setNavigationBarTitle({
              title: this.meeting.title || '会议详情'
            });
            
            // 检查会议状态并更新UI状态
            this.updateMeetingStatus();
            
            // 检查是否是会议创建者
            this.checkIsCreator();
            
            // 加载会议相关数据
            this.loadMeetingRelatedData();
          } else {
            console.error('获取会议详情失败:', res.message);
            this.loadTestMeetingData();
          }
        })
        .catch(err => {
          console.error('获取会议详情异常:', err);
          this.loadTestMeetingData();
        })
        .finally(() => {
          uni.hideLoading();
        });
    },

    // 加载会议相关数据
    loadMeetingRelatedData() {
      console.log('加载会议相关数据');
      
      // 同步加载所有相关数据
      Promise.all([
        this.loadChatMessages(),
        this.loadAgendaItems(),
        this.loadFileItems(),
        this.loadRecordingItems()
      ])
      .then(() => {
        console.log('所有会议相关数据加载完成');
      })
      .catch(err => {
        console.error('加载会议相关数据异常:', err);
      });
    },

    // 加载测试会议数据
    loadTestMeetingData() {
      console.log('加载测试会议数据');
      
      this.meeting = {
        id: this.meetingId,
        title: '项目进度例会',
        status: 'in-progress',
        startTime: '2023-05-20 09:00',
        endTime: '2023-05-20 10:30',
        location: '线上会议',
        department: '研发部',
        type: '项目会议',
        organizer: { id: '1', name: '张三' }
      };
      
      // 设置页面标题
      uni.setNavigationBarTitle({
        title: this.meeting.title
      });
      
      // 检查会议状态
      this.updateMeetingStatus();
      
      // 加载相关测试数据
      this.loadTestChatMessages();
      this.loadTestAgendaItems();
      this.loadTestFileItems();
      this.loadTestRecordingItems();
    },

    // 更新会议状态
    updateMeetingStatus() {
      if (!this.meeting) return;
      
      // 检查会议状态
      const now = new Date();
      const startTime = new Date(this.meeting.startTime);
      const endTime = this.meeting.endTime ? new Date(this.meeting.endTime) : null;
      
      if (this.meeting.status === 'cancelled') {
        this.meetingStatusText = '已取消';
        this.meetingStatusClass = 'status-canceled';
        this.isMeetingActive = false;
      } else if (now < startTime) {
        this.meetingStatusText = '未开始';
        this.meetingStatusClass = 'status-pending';
        this.isMeetingActive = false;
      } else if (endTime && now > endTime) {
        this.meetingStatusText = '已结束';
        this.meetingStatusClass = 'status-completed';
        this.isMeetingActive = false;
      } else {
        this.meetingStatusText = '进行中';
        this.meetingStatusClass = 'status-in-progress';
        this.isMeetingActive = true;
      }
      
      console.log('会议状态:', this.meetingStatusText, '是否活跃:', this.isMeetingActive);
    },

    // 检查当前用户是否是会议创建者
    checkIsCreator() {
      if (!this.meeting || !this.meeting.organizer) {
        this.isCreator = false;
        return;
      }
      
      // 在实际环境中应该获取当前登录用户信息并比较
      // 这里只是根据预设的currentUser进行简单比较
      this.isCreator = this.meeting.organizer.name === this.currentUser;
      console.log('当前用户是否是会议创建者:', this.isCreator);
    },
    
    // 获取议题状态文本
    getAgendaStatusText(status) {
      const statusMap = {
        'pending': '未开始',
        'in-progress': '进行中',
        'completed': '已完成',
        'cancelled': '已取消'
      };
      return statusMap[status] || status;
    },
    
    // 获取文件图标
    getFileIcon(type) {
      const typeMap = {
        'doc': 'icon-doc',
        'docx': 'icon-doc',
        'ppt': 'icon-ppt',
        'pptx': 'icon-ppt',
        'xls': 'icon-xls',
        'xlsx': 'icon-xls',
        'pdf': 'icon-pdf',
        'img': 'icon-img',
        'jpg': 'icon-img',
        'png': 'icon-img',
        'zip': 'icon-zip'
      };
      return typeMap[type] || 'icon-file';
    },
    
    // 格式化文件大小
    formatFileSize(size) {
      if (size < 1024) {
        return size + ' B';
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(1) + ' KB';
      } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(1) + ' MB';
      } else {
        return (size / 1024 / 1024 / 1024).toFixed(1) + ' GB';
      }
    },
    
    // 加载聊天消息
    loadChatMessages() {
      console.log('加载会议聊天消息:', this.meetingId);
      
      // 调用API获取消息列表
      return getMeetingMessagesAPI(this.meetingId)
        .then(res => {
          console.log('消息列表API返回:', res);
          
          if (res.code === 200 && res.data) {
            // 处理消息列表数据
            if (Array.isArray(res.data)) {
              this.messages = res.data.map(msg => this.formatChatMessage(msg));
            } else if (res.data.list && Array.isArray(res.data.list)) {
              this.messages = res.data.list.map(msg => this.formatChatMessage(msg));
            } else {
              console.warn('消息数据格式不正确');
              this.messages = [];
            }
            
            // 滚动到底部
            this.$nextTick(() => {
              this.scrollToBottom();
            });
          } else {
            console.error('获取消息列表失败:', res.message);
            this.loadTestChatMessages();
          }
        })
        .catch(err => {
          console.error('获取消息列表错误:', err);
          this.loadTestChatMessages();
        });
    },
    
    // 加载测试聊天消息数据
    loadTestChatMessages() {
      console.log('加载测试聊天消息数据');
      
      this.messages = [
        {
          id: '1',
          sender: '系统',
          content: '会议已开始，请各位参会人员就位',
          time: '09:00',
          isSystem: true
        },
        {
          id: '2',
          sender: '张三',
          content: '大家好，我们开始讨论今天的议题',
          time: '09:01',
          isSystem: false
        },
        {
          id: '3',
          sender: '李四',
          content: '好的，首先是关于项目进度的问题',
          time: '09:02',
          isSystem: false
        },
        {
          id: '4',
          sender: '王五',
          content: '我这边准备了一份进度报告，稍后分享给大家',
          time: '09:04',
          isSystem: false
        },
        {
          id: '5',
          sender: '系统',
          content: '王五分享了文件：项目进度报告.pdf',
          time: '09:05',
          isSystem: true
        }
      ];
      
      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    
    // 加载会议议题
    loadAgendaItems() {
      console.log('加载会议议题:', this.meetingId);
      
      // 调用API获取议题列表
      return getMeetingAgendasAPI(this.meetingId)
        .then(res => {
          console.log('议题列表API返回:', res);
          
          if (res.code === 200 && res.data) {
            // 处理议题列表数据
            if (Array.isArray(res.data)) {
              this.agendaItems = res.data;
            } else if (res.data.list && Array.isArray(res.data.list)) {
              this.agendaItems = res.data.list;
            } else {
              console.warn('议题数据格式不正确');
              this.agendaItems = [];
            }
          } else {
            console.error('获取议题列表失败:', res.message);
            this.loadTestAgendaItems();
          }
        })
        .catch(err => {
          console.error('获取议题列表错误:', err);
          this.loadTestAgendaItems();
        });
    },
    
    // 加载测试议题数据
    loadTestAgendaItems() {
      console.log('加载测试议题数据');
      
      this.agendaItems = [
        {
          id: '1',
          title: '项目进度汇报',
          description: '各小组汇报当前项目进展情况',
          duration: 20,
          owner: '张三',
          status: 'completed'
        },
        {
          id: '2',
          title: '技术方案讨论',
          description: '讨论新功能的技术实现方案',
          duration: 30,
          owner: '李四',
          status: 'in-progress'
        },
        {
          id: '3',
          title: '下一阶段计划',
          description: '制定下一阶段的工作计划和时间节点',
          duration: 15,
          owner: '王五',
          status: 'pending'
        }
      ];
    },
    
    // 加载会议文件
    loadFileItems() {
      console.log('加载会议文件:', this.meetingId);
      
      // 调用API获取文件列表
      return getMeetingFilesAPI(this.meetingId)
        .then(res => {
          console.log('文件列表API返回:', res);
          
          if (res.code === 200 && res.data) {
            // 处理文件列表数据
            if (Array.isArray(res.data)) {
              this.fileItems = res.data;
            } else if (res.data.list && Array.isArray(res.data.list)) {
              this.fileItems = res.data.list;
            } else {
              console.warn('文件数据格式不正确');
              this.fileItems = [];
            }
          } else {
            console.error('获取文件列表失败:', res.message);
            this.loadTestFileItems();
          }
        })
        .catch(err => {
          console.error('获取文件列表错误:', err);
          this.loadTestFileItems();
        });
    },
    
    // 加载测试文件数据
    loadTestFileItems() {
      console.log('加载测试文件数据');
      
      this.fileItems = [
        {
          id: '1',
          name: '项目需求文档.pdf',
          type: 'pdf',
          size: 2048000,
          uploadTime: '2023-05-20 10:15',
          uploader: '张三'
        },
        {
          id: '2',
          name: '技术方案.docx',
          type: 'doc',
          size: 1536000,
          uploadTime: '2023-05-20 10:30',
          uploader: '李四'
        },
        {
          id: '3',
          name: '前端开发计划.pptx',
          type: 'ppt',
          size: 3072000,
          uploadTime: '2023-05-20 10:45',
          uploader: '王五'
        }
      ];
    },
    
    // 加载会议录音
    loadRecordingItems() {
      console.log('加载会议录音:', this.meetingId);
      
      // 调用API获取录音列表
      return getMeetingRecordingsAPI(this.meetingId)
        .then(res => {
          console.log('录音列表API返回:', res);
          
          if (res.code === 200 && res.data) {
            // 处理录音列表数据
            if (Array.isArray(res.data)) {
              this.recordingItems = res.data;
            } else if (res.data.list && Array.isArray(res.data.list)) {
              this.recordingItems = res.data.list;
            } else {
              console.warn('录音数据格式不正确');
              this.recordingItems = [];
            }
          } else {
            console.error('获取录音列表失败:', res.message);
            this.loadTestRecordingItems();
          }
        })
        .catch(err => {
          console.error('获取录音列表错误:', err);
          this.loadTestRecordingItems();
        });
    },
    
    // 加载测试录音数据
    loadTestRecordingItems() {
      console.log('加载测试录音数据');
      
      this.recordingItems = [
        {
          id: '1',
          name: '会议开场讨论',
          duration: '15:30',
          createTime: '2023-05-20 09:15',
          size: 3072000,
          creator: '张三'
        },
        {
          id: '2',
          name: '技术方案讨论',
          duration: '28:45',
          createTime: '2023-05-20 09:45',
          size: 5120000,
          creator: '李四'
        }
      ];
    },
    
    // 发送消息
    sendMessage() {
      if (!this.newMessage.trim() || !this.isMeetingActive) return;
      
      console.log('发送消息:', this.newMessage);
      
      // 创建本地消息对象并添加到消息列表
      const localMessage = {
        id: 'temp_' + Date.now(),
        sender: this.currentUser,
        content: this.newMessage.trim(),
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isSystem: false
      };
      
      // 清空输入框
      const message = this.newMessage.trim();
      this.newMessage = '';
      
      // 添加本地消息
      this.messages.push(localMessage);
      
      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      
      // 发送消息到服务器
      sendMeetingChatMessage(this.meetingId, message, {
        senderId: 'user_1',
        senderName: this.currentUser
      })
        .then(res => {
          console.log('发送消息结果:', res);
          
          if (res.code !== 200) {
            // 发送失败
            console.error('发送消息失败:', res.message);
            uni.showToast({
              title: '发送失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('发送消息异常:', err);
          uni.showToast({
            title: '发送失败',
            icon: 'none'
          });
        });
    },
    
    // 格式化聊天消息对象
    formatChatMessage(msg) {
      return {
        id: msg.id,
        sender: msg.senderName || msg.sender || '未知用户',
        content: msg.content || '',
        time: msg.createTime ? new Date(msg.createTime).toLocaleTimeString('zh-CN') : new Date().toLocaleTimeString('zh-CN'),
        isSystem: msg.isSystem || false
      };
    },
    
    // 添加系统消息
    addSystemMessage(content) {
      if (!content) return;
      
      const systemMessage = {
        id: 'system_' + Date.now(),
        sender: '系统',
        content: content,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      };
      
      this.messages.push(systemMessage);
      
      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    
    // 滚动聊天区域到底部
    scrollToBottom() {
      const chatMessagesElement = this.$refs.chatMessages;
      if (chatMessagesElement) {
        chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
      }
    },
    
    // 下载文件
    downloadFile(file) {
      console.log('下载文件:', file);
      
      uni.showToast({
        title: '正在下载: ' + file.name,
        icon: 'none'
      });
    },
    
    // 确认结束会议
    confirmEndMeeting() {
      uni.showModal({
        title: '确认结束会议',
        content: '确定要结束当前会议吗？会议结束后将无法再修改会议内容。',
        confirmText: '结束会议',
        confirmColor: '#ff0000',
        success: (res) => {
          if (res.confirm) {
            this.endMeeting();
          }
        }
      });
    },
    
    // 结束会议
    endMeeting() {
      console.log('结束会议:', this.meetingId);
      
      uni.showLoading({
        title: '正在结束会议...',
        mask: true
      });
      
      // 这里调用结束会议的API
      setTimeout(() => {
        uni.hideLoading();
        
        // 更新会议状态
        this.meeting.status = 'completed';
        this.updateMeetingStatus();
        
        // 添加系统消息
        this.addSystemMessage('会议已结束');
        
        uni.showToast({
          title: '会议已结束',
          icon: 'success'
        });
      }, 1500);
    },
    
    // 播放录音
    playRecording(recording) {
      console.log('播放录音:', recording);
      
      uni.showToast({
        title: '正在播放: ' + recording.name,
        icon: 'none'
      });
    },
    
    // 下载录音
    downloadRecording(recording) {
      console.log('下载录音:', recording);
      
      uni.showToast({
        title: '正在下载: ' + recording.name,
        icon: 'none'
      });
    },
    
    // 切换录音状态
    toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    },
    
    // 开始录音
    startRecording() {
      console.log('开始录音');
      
      // 显示录音中的状态
      this.isRecording = true;
      this.recordingStartTime = new Date();
      
      // 添加系统消息
      this.addSystemMessage('开始录音');
      
      uni.showToast({
        title: '开始录音',
        icon: 'none'
      });
    },
    
    // 停止录音
    stopRecording() {
      console.log('停止录音');
      
      // 更新状态
      this.isRecording = false;
      
      // 添加系统消息
      this.addSystemMessage('停止录音');
      
      uni.showToast({
        title: '录音已保存',
        icon: 'success'
      });
      
      // 创建测试录音记录
      const now = new Date();
      const newRecording = {
        id: 'rec_' + Date.now(),
        name: '会议录音 ' + now.toLocaleTimeString(),
        duration: '05:30',
        createTime: now.toLocaleString(),
        size: 2048000,
        creator: this.currentUser
      };
      
      // 添加到录音列表
      this.recordingItems.unshift(newRecording);
    }
  }
}
</script>

<style>
/* 会议室样式 */
.meeting-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.meeting-header {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  background-color: #fff;
}

.meeting-title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.meeting-title h2 {
  margin: 0;
  font-size: 18px;
  margin-right: 10px;
}

.meeting-status {
  padding: 3px 8px;
  border-radius: 15px;
  font-size: 12px;
}

.status-pending {
  background-color: #f8f9fa;
  color: #6c757d;
}

.status-in-progress {
  background-color: #d4edda;
  color: #155724;
}

.status-completed {
  background-color: #cce5ff;
  color: #004085;
}

.status-canceled {
  background-color: #f8d7da;
  color: #721c24;
}

.meeting-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 14px;
  color: #6c757d;
}

.meeting-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs-container {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #e9ecef;
}

.tab-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-item.active {
  border-bottom: 2px solid #007bff;
  color: #007bff;
}

.tab-content {
  flex: 1;
  overflow: auto;
  background-color: #fff;
}

.meeting-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
}

.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.message-item {
  margin-bottom: 15px;
  max-width: 80%;
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e9ecef;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  font-size: 14px;
}

.message-time {
  font-size: 12px;
  color: #6c757d;
}

.message-content {
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
}

.my-message {
  margin-left: auto;
  background-color: #e7f3ff;
}

.system-message {
  margin: 10px auto;
  text-align: center;
  color: #6c757d;
  font-size: 12px;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #e9ecef;
  background-color: #fff;
}

.input-area {
  flex: 1;
  margin-right: 10px;
}

.message-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  outline: none;
}

.send-btn {
  padding: 8px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.empty-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #6c757d;
}
</style> 