<template>
  <div class="room-wrapper">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item" @click="navigateToHome">首页</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item" @click="navigateToMeetingList">我的会议</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item active">会议聊天室</span>
    </div>
    
  <div class="meeting-container">
    <!-- 会议头部区域 -->
    <div class="meeting-header">
      <div class="meeting-title">
        <h2>{{ meeting.title }}</h2>
        <span :class="['meeting-status', meetingStatusClass]">{{ meetingStatusText }}</span>
      </div>
      <div class="meeting-info">
          <div class="info-row">
            <span class="info-label">时间:</span>
        <span class="meeting-time">
          {{ meeting.startTime }} ~ {{ meeting.endTime || '进行中' }}
        </span>
          </div>
          <div class="info-row" v-if="meeting.location">
            <span class="info-label">地点:</span>
            <span class="meeting-location">
          {{ meeting.location }}
        </span>
          </div>
          <div class="info-row" v-if="meeting.booker || meeting.organizer">
            <span class="info-label">召集人:</span>
            <span class="meeting-organizer">
              {{ meeting.organizer?.name || meeting.booker || '未知' }}
        </span>
          </div>
          <div class="info-row" v-if="meeting.department">
            <span class="info-label">部门:</span>
            <span class="meeting-department">{{ meeting.department }}</span>
          </div>
          <div class="info-row" v-if="meeting.type">
            <span class="info-label">类型:</span>
            <span class="meeting-type">{{ meeting.type }}</span>
          </div>
          <div class="info-row" v-if="meeting.description">
            <span class="info-label">描述:</span>
            <span class="meeting-description">{{ meeting.description }}</span>
          </div>
          <div class="info-row" v-if="meeting.participants && meeting.participants.length">
            <span class="info-label">参会人员:</span>
            <div class="meeting-participants">
              <span v-for="(participant, index) in meeting.participants" :key="participant.id || index" class="participant-item">
                {{ participant.name || participant.username }}{{ index < meeting.participants.length - 1 ? '，' : '' }}
        </span>
            </div>
          </div>
      </div>
      <!-- 会议操作按钮区域 -->
      <div class="meeting-actions" v-if="isCreator && isMeetingActive">
        <button @click="confirmEndMeeting" class="end-meeting-btn">结束会议</button>
      </div>
        <!-- 会议状态提示 -->
        <div :class="['meeting-status-notice', `status-notice-${meetingStatusClass.replace('status-', '')}`]">
          <p>会议状态：{{ meetingStatusText }}</p>
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
                  <div class="agenda-actions" v-if="isCreator && isMeetingActive">
                    <button @click="editAgendaItem(item)" class="edit-btn">编辑</button>
                    <button @click="confirmDeleteAgenda(item.id)" class="delete-btn">删除</button>
                </div>
              </div>
              <div class="agenda-info">
                <p>{{ item.description }}</p>
                <div class="agenda-details">
                    <span>创建时间: {{ item.createTime }}</span>
                </div>
              </div>
                <!-- 议题文件列表 -->
                <div class="agenda-files" v-if="item.files && item.files.length > 0">
                  <h5>相关文件</h5>
                  <div class="file-list">
                    <div v-for="file in item.files" :key="file.id" class="file-item">
                      <div class="file-info">
                        <div class="file-name">{{ file.name }}</div>
                        <div class="file-meta">
                          <span>上传时间: {{ file.createTime }}</span>
                        </div>
                      </div>
                      <div class="file-actions">
                        <a :href="file.url" target="_blank" class="download-btn">下载</a>
                        <button 
                          v-if="isCreator && isMeetingActive"
                          @click="confirmDeleteFile(file.id)" 
                          class="delete-btn"
                        >删除</button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 上传文件按钮 -->
                <div class="upload-file" v-if="isMeetingActive">
                  <button @click="showUploadFileModal(item.id)" class="upload-btn">
                    上传文件
                  </button>
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
              <h3>会议录音与摘要</h3>
              <div class="recording-actions">
            <button 
              v-if="isMeetingActive" 
                  @click="showUploadRecordingModal" 
                  class="upload-btn"
            >
                  上传录音
            </button>
              </div>
          </div>
          <div class="recording-list">
            <div v-for="recording in recordingItems" :key="recording.id" class="recording-item">
              <div class="recording-info">
                  <div class="recording-name">{{ recording.name || recording.title || "会议录音" }}</div>
                <div class="recording-meta">
                  <span>创建时间: {{ recording.createTime }}</span>
                </div>
              </div>
              <div class="recording-actions">
                  <a :href="recording.url" target="_blank" class="download-btn">下载</a>
                </div>
                <!-- 添加摘要显示 -->
                <div class="recording-summary" v-if="recording.summary">
                  <h5>会议摘要</h5>
                  <div class="summary-content">{{ recording.summary }}</div>
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

    <!-- 上传文件模态框 -->
    <div v-if="showUploadFileModal" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <h3>上传文件</h3>
          <button @click="showUploadFileModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>文件类型</label>
            <select v-model="uploadForm.fileType">
              <option v-for="option in uploadFileOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="form-item">
            <label>文件名称</label>
            <input type="text" v-model="uploadForm.fileName" placeholder="请输入文件名称"/>
          </div>
          <div class="form-item">
            <label>选择文件</label>
            <div class="file-select">
              <button @click="chooseFile" class="select-file-btn">选择文件</button>
              <span class="selected-file">{{ uploadForm.selectedFileName || '未选择文件' }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showUploadFileModal = false" class="cancel-btn">取消</button>
          <button @click="handleFileUpload" class="confirm-btn">上传</button>
        </div>
      </div>
    </div>

    <!-- 上传录音模态框 -->
    <div v-if="uploadRecordingModal" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <h3>上传录音</h3>
          <button @click="uploadRecordingModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>录音名称</label>
            <input type="text" v-model="recordingForm.name" placeholder="请输入录音名称"/>
          </div>
          <div class="form-item">
            <label>录音描述</label>
            <textarea v-model="recordingForm.description" placeholder="请输入录音描述"></textarea>
          </div>
          <div class="form-item">
            <label>选择录音文件</label>
            <div class="file-select">
              <button @click="chooseRecordingFile" class="select-file-btn">选择文件</button>
              <span class="selected-file">{{ recordingForm.fileName || '未选择文件' }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="uploadRecordingModal = false" class="cancel-btn">取消</button>
          <button @click="uploadRecordingFile" class="confirm-btn">上传</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as apiRequest from '../../../api/api';

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
      currentTab: 'agenda',
      tabs: [
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
      },
      showAddAgendaModal: false
    };
  },
  
  // 页面加载
  onLoad(options) {
    console.log('会议室页面加载，参数:', options);
    
    // 获取会议ID
    if (options.id) {
      this.meetingId = options.id;
      console.log('获取到会议ID:', this.meetingId);
    }
    
    // 获取传递的会议信息
    if (options.meetingInfo) {
      try {
        console.log('接收到会议信息参数:', options.meetingInfo);
        const decodedInfo = decodeURIComponent(options.meetingInfo);
        console.log('解码后的会议信息:', decodedInfo);
        
        const meetingInfo = JSON.parse(decodedInfo);
        console.log('解析后的会议信息对象:', meetingInfo);
        
        // 直接使用传递的会议信息，避免再次请求API
        this.meeting = {
          id: meetingInfo.id,
          title: meetingInfo.topic || meetingInfo.title || '未命名会议',
          description: meetingInfo.description || '',
          startTime: meetingInfo.startTime || '',
          endTime: meetingInfo.endTime || '',
          status: this.normalizeStatus(meetingInfo.status),
          booker: meetingInfo.booker || meetingInfo.user || '',
          roomName: meetingInfo.roomName || '',
          date: meetingInfo.reserveDate || meetingInfo.date || '',
          participants: meetingInfo.participants || [],
          room: meetingInfo.room || '',
          topic: meetingInfo.topic || meetingInfo.title || '未命名会议',
          reserveDate: meetingInfo.reserveDate || meetingInfo.date || ''
        };
        
        console.log('会议信息设置完成:', this.meeting);
        
        // 更新会议状态
        this.updateMeetingStatus();
        
        // 初始化
        this.initData();
      } catch (error) {
        console.error('解析会议信息出错:', error);
        // 如果解析失败，则通过API获取
        this.getMeetingDetail();
      }
    } else {
      // 没有传递会议信息，则通过API获取
      console.log('没有接收到会议信息，将通过API获取');
      this.getMeetingDetail();
    }
  },

  // 在mounted生命周期中初始化其他数据
  async mounted() {
    try {
      // 如果meeting对象已经在onLoad中初始化，则不需要再次初始化
      if (this.meeting && (this.meeting.id || this.meeting.title !== '加载中...')) {
        console.log('会议信息已在onLoad中初始化，跳过mounted中的初始化');
      return;
    }
    
      // 如果没有在onLoad中获取完整信息，则使用ID初始化
      if (this.meetingId) {
        console.log('使用ID初始化会议信息:', this.meetingId);
        // 设置一个默认的会议标题
        this.meetingTitle = '会议详情';
        // 设置一个默认的会议对象
        this.meeting = {
          id: this.meetingId,
          title: this.meetingTitle,
          status: 'approved'
        };
        
        // 加载其他相关数据
            this.updateMeetingStatus();
            this.checkIsCreator();
            this.loadMeetingRelatedData();
          } else {
        console.error('会议ID不能为空');
            uni.showToast({
          title: '会议ID不能为空',
              icon: 'none'
            });
        
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
          }
    } catch (err) {
      console.error('初始化会议失败:', err);
          uni.showToast({
        title: '初始化会议失败，请稍后重试',
            icon: 'none'
          });
    }
  },

  methods: {
    // 加载会议相关数据
    loadMeetingRelatedData() {
      Promise.all([
        this.loadAgendaItems(),
        this.loadFileItems(),
        this.loadRecordingItems()
      ])
        .then(() => {
          console.log('所有数据加载完成');
        })
        .catch(err => {
          console.error('加载会议数据失败:', err);
        });
    },

    // 更新会议状态
    updateMeetingStatus() {
      if (!this.meeting) return;
      
      console.log('更新会议状态，原始状态:', this.meeting.status);
      console.log('会议日期:', this.meeting.reserveDate);
      console.log('会议开始时间:', this.meeting.startTime);
      console.log('会议结束时间:', this.meeting.endTime);
      
      // 标准化会议状态
      let normalizedStatus = this.normalizeStatus(this.meeting.status);
      console.log('标准化后的状态:', normalizedStatus);
      
      const now = new Date();
      console.log('当前时间:', now);
      
      // 结合日期和时间创建完整的日期时间对象
      let startDateTime = null;
      let endDateTime = null;
      
      if (this.meeting.reserveDate) {
        // 如果有会议日期
        const reserveDate = this.meeting.reserveDate;
        
        if (this.meeting.startTime) {
          // 结合会议日期和开始时间
          try {
            const [startHour, startMinute] = this.meeting.startTime.split(':').map(Number);
            startDateTime = new Date(reserveDate);
            startDateTime.setHours(startHour, startMinute, 0);
            console.log('计算后的会议开始时间:', startDateTime);
          } catch (e) {
            console.error('解析开始时间出错:', e);
          }
        }
        
        if (this.meeting.endTime) {
          // 结合会议日期和结束时间
          try {
            const [endHour, endMinute] = this.meeting.endTime.split(':').map(Number);
            endDateTime = new Date(reserveDate);
            endDateTime.setHours(endHour, endMinute, 0);
            console.log('计算后的会议结束时间:', endDateTime);
          } catch (e) {
            console.error('解析结束时间出错:', e);
          }
        }
      } else {
        // 如果没有会议日期，尝试直接解析startTime和endTime（假设其中包含完整日期时间）
        try {
          startDateTime = this.meeting.startTime ? new Date(this.meeting.startTime) : null;
        } catch (e) {
          console.error('解析开始时间出错:', e);
        }
        
        try {
          endDateTime = this.meeting.endTime ? new Date(this.meeting.endTime) : null;
        } catch (e) {
          console.error('解析结束时间出错:', e);
        }
      }
      
      // 根据状态和时间设置会议状态
      if (normalizedStatus === 'canceled' || normalizedStatus === 'cancelled') {
        this.meetingStatusText = '已取消';
        this.meetingStatusClass = 'status-canceled';
        this.isMeetingActive = false;
      } else if (normalizedStatus === 'rejected') {
        this.meetingStatusText = '已拒绝';
        this.meetingStatusClass = 'status-canceled';
        this.isMeetingActive = false;
      } else if (normalizedStatus === 'completed') {
        this.meetingStatusText = '已结束';
        this.meetingStatusClass = 'status-completed';
        this.isMeetingActive = false;
      } else if (normalizedStatus === 'pending') {
        this.meetingStatusText = '待审批';
        this.meetingStatusClass = 'status-pending';
        this.isMeetingActive = false;
      } else if (startDateTime && endDateTime) {
        // 根据时间判断会议状态
        if (now < startDateTime) {
        this.meetingStatusText = '未开始';
        this.meetingStatusClass = 'status-pending';
        this.isMeetingActive = false;
        } else if (now > endDateTime) {
        this.meetingStatusText = '已结束';
        this.meetingStatusClass = 'status-completed';
        this.isMeetingActive = false;
      } else {
        this.meetingStatusText = '进行中';
        this.meetingStatusClass = 'status-in-progress';
        this.isMeetingActive = true;
      }
      } else if (startDateTime && !endDateTime) {
        // 只有开始时间，没有结束时间
        if (now < startDateTime) {
          this.meetingStatusText = '未开始';
          this.meetingStatusClass = 'status-pending';
          this.isMeetingActive = false;
        } else {
          this.meetingStatusText = '进行中';
          this.meetingStatusClass = 'status-in-progress';
          this.isMeetingActive = true;
        }
      } else if (normalizedStatus === 'approved' || normalizedStatus === 'in-progress') {
        // 状态为已批准或进行中，但没有时间信息
        this.meetingStatusText = '进行中';
        this.meetingStatusClass = 'status-in-progress';
        this.isMeetingActive = true;
      } else {
        // 默认状态
        this.meetingStatusText = '未开始';
        this.meetingStatusClass = 'status-pending';
        this.isMeetingActive = false;
      }
      
      console.log('最终会议状态:', this.meetingStatusText, this.meetingStatusClass, '活动状态:', this.isMeetingActive);
    },
    
    // 标准化状态值
    normalizeStatus(status) {
      if (!status) return 'pending';
      
      // 处理状态对象
      if (typeof status === 'object' && status !== null) {
        status = status.status || status.value || 'pending';
      }
      
      // 处理数字状态
      if (typeof status === 'number' || /^\d+$/.test(status)) {
        const numStatus = parseInt(status);
        switch(numStatus) {
          case 0: return 'pending';
          case 1: return 'approved';
          case 2: return 'in-progress';
          case 3: return 'completed';
          case 4: return 'cancelled';
          case 5: return 'rejected';
          default: return 'pending';
        }
      }
      
      // 处理字符串状态
      if (typeof status === 'string') {
        status = status.toLowerCase().trim();
        
        // 中文状态转换
        if (status === '待审核' || status === '待审批') {
          return 'pending';
        } else if (status === '已通过' || status === '已审批' || status === '通过') {
          return 'approved';
        } else if (status === '进行中') {
          return 'in-progress';
        } else if (status === '已完成' || status === '完成') {
          return 'completed';
        } else if (status === '已拒绝' || status === '拒绝') {
          return 'rejected';
        } else if (status === '已取消' || status === '取消') {
          return 'cancelled';
        }
        
        // 统一 canceled/cancelled 拼写
        if (status === 'canceled' || status === 'cancelled') {
          return 'cancelled';
        }
        
        // 常见状态名称匹配
        if (status.includes('pend') || status.includes('wait')) {
          return 'pending';
        } else if (status.includes('approv') || status.includes('accept')) {
          return 'approved';
        } else if (status.includes('progress') || status.includes('ongoing') || status.includes('active')) {
          return 'in-progress';
        } else if (status.includes('complet') || status.includes('finish') || status.includes('done') || status.includes('end')) {
          return 'completed';
        } else if (status.includes('cancel')) {
          return 'cancelled';
        } else if (status.includes('reject') || status.includes('deny') || status.includes('declin')) {
          return 'rejected';
        }
      }
      
      return 'pending'; // 默认状态
    },

    // 检查当前用户是否是会议创建者
    checkIsCreator() {
      if (!this.meeting || !this.meeting.organizer) {
        this.isCreator = false;
        return;
      }
      
      this.isCreator = this.meeting.organizer.name === this.currentUser;
    },
    
    // 加载会议议题
    loadAgendaItems() {
      return apiRequest.getSubtopicsByReservationId(this.meetingId)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.agendaItems = res.data.map(item => ({
              id: item.id,
              title: item.title,
              description: item.description,
              status: item.status || 'pending',
              createTime: item.createTime || new Date().toISOString()
            }));
            } else {
              this.agendaItems = [];
          }
        })
        .catch(err => {
          console.error('加载议题失败:', err);
          this.agendaItems = [];
        });
    },
    
    // 加载议题文件
    loadFileItems() {
      console.log('加载文件列表');
      
      // 如果有传入议题ID，则加载特定议题的文件
      if (arguments.length > 0 && arguments[0]) {
        const subId = arguments[0];
        console.log('加载议题文件, 议题ID:', subId);
        return apiRequest.getSubtopicFileList(subId)
        .then(res => {
            console.log('获取议题文件响应:', res);
          if (res.code === 200 && res.data) {
              // 将文件列表附加到对应的议题项
              const files = res.data.map(file => ({
                id: file.id,
                name: file.fileName,
                url: file.fileUrl,
                createTime: file.createTime
              }));
              
              // 查找并更新议题的文件列表
              const agendaItem = this.agendaItems.find(item => item.id === subId);
              if (agendaItem) {
                agendaItem.files = files;
                // 强制视图更新
                this.agendaItems = [...this.agendaItems];
              }
              
              return files;
            }
            return [];
        })
        .catch(err => {
            console.error('加载议题文件失败:', err);
            return [];
          });
      }
      
      // 否则加载整个会议的文件
      console.log('加载会议所有文件');
      this.fileItems = []; // 暂时保持为空
      return Promise.resolve([]);
    },
    
    // 加载会议录音
    loadRecordingItems() {
      return apiRequest.getMeetingSummary(this.meetingId)
        .then(res => {
          if (res.code === 200 && res.data) {
            console.log('获取会议摘要成功:', res.data);
            
            // 处理不同格式的响应数据
            if (Array.isArray(res.data)) {
              this.recordingItems = res.data.map(item => this.formatRecordingItem(item));
            } else if (res.data.list && Array.isArray(res.data.list)) {
              this.recordingItems = res.data.list.map(item => this.formatRecordingItem(item));
            } else if (res.data.summary) {
              // 单个摘要的情况
              this.recordingItems = [{
                id: res.data.id || Date.now().toString(),
                name: res.data.title || '会议摘要',
                summary: res.data.summary,
                createTime: res.data.createTime || new Date().toISOString(),
                url: res.data.audioUrl || ''
              }];
            } else {
              this.recordingItems = [];
            }
          } else {
            this.recordingItems = [];
          }
        })
        .catch(err => {
          console.error('加载会议录音失败:', err);
          this.recordingItems = [];
        });
    },
    
    // 格式化录音项目数据
    formatRecordingItem(item) {
      return {
        id: item.id || Date.now().toString(),
        name: item.title || item.name || '会议录音',
        summary: item.summary || item.content || '',
        createTime: item.createTime || new Date().toISOString(),
        url: item.audioUrl || item.url || '',
        duration: item.duration || ''
      };
    },
    
    // 确认结束会议
    confirmEndMeeting() {
      uni.showModal({
        title: '结束会议',
        content: '确定要结束会议吗？',
        success: (res) => {
          if (res.confirm) {
            this.endMeeting();
          }
        }
      });
    },
    
    // 结束会议
    endMeeting() {
      uni.showLoading({
        title: '处理中'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '会议已结束',
          icon: 'success'
        });
        
        this.meeting.status = 'completed';
        this.updateMeetingStatus();
        
        this.addSystemMessage('会议已结束');
        
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }, 1000);
    },
    
    // 播放录音
    playRecording(recording) {
      uni.showToast({
        title: '播放录音: ' + recording.name,
        icon: 'none'
      });
    },
    
    // 下载录音
    downloadRecording(recording) {
      uni.showToast({
        title: '开始下载录音: ' + recording.name,
        icon: 'none'
      });
      
      uni.showLoading({
        title: '下载中'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '下载完成',
          icon: 'success'
        });
      }, 2000);
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
      if (this.isRecording) return;
      
      this.isRecording = true;
      
      uni.showToast({
        title: '开始录音',
        icon: 'none'
      });
    },
    
    // 停止录音
    stopRecording() {
      if (!this.isRecording) return;
      
      this.isRecording = false;
      
      uni.showToast({
        title: '录音已停止',
        icon: 'success'
      });
    },
    
    // 显示上传文件模态框
    showUploadFileModal(agendaId) {
      console.log('显示上传文件模态框', agendaId);
      this.uploadForm = {
        fileName: '',
        fileType: 'doc',
        filePath: '',
        selectedFileName: '',
        agendaId: agendaId || ''
      };
      this.showUploadFileModal = true;
    },
    
    // 选择文件
    chooseFile() {
      console.log('选择文件');
      // 在H5环境中使用chooseFile
      // #ifdef H5
      uni.chooseFile({
        count: 1,
        success: (res) => {
          console.log('选择文件成功H5:', res);
          const file = res.tempFiles[0];
          this.uploadForm.selectedFileName = file.name;
          this.uploadForm.filePath = file.path;
          this.uploadForm.fileName = file.name;
        },
        fail: (err) => {
          console.error('选择文件失败H5:', err);
          uni.showToast({
            title: '选择文件失败',
            icon: 'none'
          });
        }
      });
      // #endif
      
      // 在APP或小程序环境中使用chooseImage
      // #ifdef APP-PLUS || MP
      uni.chooseImage({
        count: 1,
        success: (res) => {
          console.log('选择文件成功APP/MP:', res);
          const file = res.tempFiles[0] || {
            path: res.tempFilePaths[0],
            name: '文件' + new Date().getTime()
          };
          this.uploadForm.selectedFileName = file.name || '已选择1个文件';
          this.uploadForm.filePath = file.path;
          this.uploadForm.fileName = file.name || '文件' + new Date().getTime();
        },
        fail: (err) => {
          console.error('选择文件失败APP/MP:', err);
          uni.showToast({
            title: '选择文件失败',
            icon: 'none'
          });
        }
      });
      // #endif
    },
    
    // 重置上传表单
    resetUploadForm() {
      this.uploadForm = {
        fileName: '',
        fileType: 'doc',
        filePath: '',
        selectedFileName: '',
        agendaId: ''
      };
    },
    
    // 上传文件处理
    handleFileUpload() {
      console.log('开始处理文件上传', this.uploadForm);
      if (!this.uploadForm.selectedFileName) {
        uni.showToast({
          title: '请选择文件',
          icon: 'none'
        });
        return;
      }
      
      uni.showLoading({
        title: '上传中...'
      });
      
      // 创建文件对象
      const fileData = {
        fileKey: Date.now().toString(),
        file: {
          name: this.uploadForm.fileName,
          path: this.uploadForm.filePath
        }
      };
      
      console.log('准备上传文件', fileData, '议题ID:', this.uploadForm.agendaId);
      
      // 如果有议题ID，上传到议题下；否则上传到会议文件中
      if (this.uploadForm.agendaId) {
        apiRequest.uploadSubtopicFile(this.uploadForm.agendaId, fileData.fileKey, fileData.file)
          .then(res => {
            console.log('上传文件响应:', res);
        uni.hideLoading();
            if (res.code === 200) {
        uni.showToast({
          title: '上传成功',
          icon: 'success'
        });
              this.loadAgendaItems(); // 重新加载议题列表，包含文件
            } else {
              uni.showToast({
                title: res.msg || '上传失败',
                icon: 'none'
              });
            }
          })
          .catch(err => {
            console.error('上传文件失败:', err);
            uni.hideLoading();
            uni.showToast({
              title: '上传失败，请稍后重试',
              icon: 'none'
            });
          })
          .finally(() => {
            this.showUploadFileModal = false;
            this.resetUploadForm();
          });
      } else {
        // 通用文件上传
        apiRequest.uploadFile(fileData.file)
          .then(res => {
            console.log('上传文件响应:', res);
            uni.hideLoading();
            if (res.code === 200) {
              uni.showToast({
                title: '上传成功',
                icon: 'success'
              });
        this.loadFileItems();
            } else {
              uni.showToast({
                title: res.msg || '上传失败',
                icon: 'none'
              });
            }
          })
          .catch(err => {
            console.error('上传文件失败:', err);
            uni.hideLoading();
            uni.showToast({
              title: '上传失败，请稍后重试',
              icon: 'none'
            });
          })
          .finally(() => {
        this.showUploadFileModal = false;
        this.resetUploadForm();
          });
      }
    },

    // 显示上传录音模态框
    showUploadRecordingModal() {
      console.log('显示上传录音模态框');
      this.resetRecordingForm();
      this.uploadRecordingModal = true;
    },
    
    // 上传录音文件
    uploadRecordingFile() {
      console.log('上传录音文件', this.recordingForm);
      if (!this.recordingForm.fileName) {
        uni.showToast({
          title: '请选择录音文件',
          icon: 'none'
        });
        return;
      }
      
      uni.showLoading({
        title: '上传中...'
      });
      
      // 创建文件对象
      const fileData = {
        url: Date.now().toString(),  // 临时URL
        file: {
          name: this.recordingForm.fileName,
          path: this.recordingForm.filePath
        }
      };
      
      // 调用API上传录音
      apiRequest.uploadAudioAndGenerateSummary(this.meetingId, fileData.url, fileData.file)
        .then(res => {
        uni.hideLoading();
          if (res.code === 200) {
        uni.showToast({
          title: '上传成功',
          icon: 'success'
        });
        this.loadRecordingItems();
          } else {
            uni.showToast({
              title: res.msg || '上传失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('上传录音失败:', err);
          uni.hideLoading();
          uni.showToast({
            title: '上传失败，请稍后重试',
            icon: 'none'
          });
        })
        .finally(() => {
        this.uploadRecordingModal = false;
        this.resetRecordingForm();
        });
    },
    
    // 删除录音
    deleteRecording(recordingId) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个录音吗？此操作不可撤销。',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '删除中...'
            });
            
            setTimeout(() => {
              uni.hideLoading();
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });
              
              this.recordingItems = this.recordingItems.filter(item => item.id !== recordingId);
            }, 1000);
          }
        }
      });
    },

    // 选择录音文件
    chooseRecordingFile() {
      // 使用uni-app的api选择文件
      // #ifdef H5
      uni.chooseFile({
        count: 1,
        type: 'file',
        extension: ['.mp3', '.wav', '.aac', '.m4a'],
        success: (res) => {
          const file = res.tempFiles[0];
          this.recordingForm.fileName = file.name;
          this.recordingForm.filePath = file.path;
          if (!this.recordingForm.name) {
            this.recordingForm.name = file.name.split('.')[0]; // 默认使用文件名
          }
        },
        fail: (err) => {
          console.error('选择文件失败:', err);
        }
      });
      // #endif
      
      // #ifdef APP-PLUS || MP
      plus.io.resolveLocalFileSystemURL('_www/', (entry) => {
        entry.getDirectory('_doc/', {
          create: true
        }, (dir) => {
          uni.chooseFile({
            count: 1,
            success: (res) => {
              const file = res.tempFiles[0] || {
                path: res.tempFilePaths[0],
                name: '录音' + new Date().getTime() + '.mp3'
              };
              this.recordingForm.fileName = file.name || '录音.mp3';
              this.recordingForm.filePath = file.path;
              if (!this.recordingForm.name) {
                this.recordingForm.name = (file.name || '录音').split('.')[0];
              }
            },
            fail: (err) => {
              console.error('选择录音文件失败:', err);
              uni.showToast({
                title: '选择录音文件失败',
                icon: 'none'
              });
            }
          });
        });
      });
      // #endif
    },
    
    // 重置录音表单
    resetRecordingForm() {
      this.recordingForm = {
        name: '',
        filePath: '',
        fileName: '',
        description: ''
      };
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
      if (!size) return '未知大小';
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

    // 确认删除议题
    confirmDeleteAgenda(agendaId) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个议题吗？此操作将同时删除相关的文件。',
        success: (res) => {
          if (res.confirm) {
            this.deleteAgendaItem(agendaId);
          }
        }
      });
    },
    
    // 删除议题
    deleteAgendaItem(agendaId) {
      uni.showLoading({
        title: '删除中...'
      });
      
      apiRequest.deleteSubtopic(agendaId)
        .then(res => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
            this.loadAgendaItems();
          } else {
            uni.showToast({
              title: res.msg || '删除失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          uni.hideLoading();
          console.error('删除议题失败:', err);
          uni.showToast({
            title: '删除失败，请稍后重试',
            icon: 'none'
          });
        });
    },
    
    // 编辑议题
    editAgendaItem(item) {
      // 在实现编辑议题功能前先显示提示
      uni.showToast({
        title: '编辑功能即将上线',
        icon: 'none'
      });
    },
    
    // 确认删除文件
    confirmDeleteFile(fileId) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个文件吗？此操作不可撤销。',
        success: (res) => {
          if (res.confirm) {
            this.deleteFile(fileId);
          }
        }
      });
    },
    
    // 删除文件
    deleteFile(fileId) {
      uni.showLoading({
        title: '删除中...'
      });
      
      apiRequest.deleteSubtopicFile(fileId)
        .then(res => {
          uni.hideLoading();
          if (res.code === 200) {
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
            this.loadAgendaItems();
          } else {
            uni.showToast({
              title: res.msg || '删除失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          uni.hideLoading();
          console.error('删除文件失败:', err);
          uni.showToast({
            title: '删除失败，请稍后重试',
            icon: 'none'
          });
        });
    },

    // 导航到首页
    navigateToHome() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    
    // 导航到会议列表
    navigateToMeetingList() {
      uni.navigateTo({
        url: '/pages/user/meeting/list'
      });
    },

    // 初始化数据
    initData() {
      console.log('初始化会议室数据');
      
      // 从会议信息中提取标题
      this.meetingTitle = this.meeting.topic || this.meeting.title || '会议详情';
      
      // 检查当前用户是否是会议创建者
      this.checkIsCreator();
      
      // 加载会议相关数据(议题、文件、录音等)
      this.loadMeetingRelatedData();
      
      // 连接聊天
      if (this.isMeetingActive && this.meetingId) {
        this.connectChat();
      }
    }
  }
};
</script>

<style>
/* 会议室样式 */
.room-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.breadcrumb {
  background-color: #fff;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
  border-bottom: 1px solid #eaeaea;
}

.breadcrumb-item {
  color: #606266;
  cursor: pointer;
}

.breadcrumb-item:hover {
  color: #3498db;
}

.breadcrumb-item.active {
  color: #3498db;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #909399;
}

.meeting-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.meeting-header {
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.meeting-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.meeting-title h2 {
  margin: 0;
  font-size: 1.3em;
  color: #303133;
}

.meeting-info {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: bold;
  color: #606266;
  margin-right: 8px;
  min-width: 70px;
}

.meeting-description {
  color: #606266;
  white-space: pre-wrap;
}

.meeting-participants {
  display: flex;
  flex-wrap: wrap;
}

.participant-item {
  margin-right: 5px;
  color: #606266;
}

.meeting-status {
  display: inline-block;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 20px;
  font-weight: 500;
}

.status-pending {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-in-progress {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-completed {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
}

.status-canceled {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.meeting-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f5f7fa;
}

.tabs-container {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;
}

.tab-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 15px;
  color: #606266;
  position: relative;
}

.tab-item.active {
  color: #409eff;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 2px;
  background-color: #409eff;
}

.tab-content {
  flex: 1;
  overflow: auto;
  background-color: #f5f7fa;
  padding: 20px;
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
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message-item {
  margin-bottom: 20px;
  max-width: 80%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-weight: 500;
  font-size: 16px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  font-size: 14px;
  color: #303133;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.message-content {
  padding: 12px 16px;
  background-color: #f4f4f5;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #303133;
  position: relative;
  word-break: break-word;
}

.my-message {
  margin-left: auto;
}

.my-message .message-content {
  background-color: #ecf5ff;
  color: #303133;
}

.my-message .user-avatar {
  background-color: #67c23a;
}

.system-message {
  margin: 15px auto;
  text-align: center;
  color: #909399;
  font-size: 13px;
  background-color: #f4f4f5;
  padding: 8px 16px;
  border-radius: 16px;
  max-width: 60%;
}

.chat-input {
  display: flex;
  padding: 15px;
  border-top: 1px solid #e4e7ed;
  background-color: #fff;
  align-items: center;
}

.input-area {
  flex: 1;
  margin-right: 12px;
}

.message-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  transition: all 0.3s;
  background-color: #f5f7fa;
}

.message-input:focus {
  border-color: #409eff;
  background-color: #fff;
}

.send-btn {
  padding: 12px 24px;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.send-btn:hover {
  background-color: #66b1ff;
}

.send-btn:active {
  background-color: #3a8ee6;
}

.send-btn:disabled {
  background-color: #c0c4cc;
  cursor: not-allowed;
}

.icon-send {
  margin-left: 6px;
  font-size: 16px;
}

.empty-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #909399;
  font-size: 14px;
  background-color: #f5f7fa;
  border-radius: 8px;
  margin: 20px;
}

.agenda-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.agenda-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.agenda-header h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.agenda-info p {
  margin: 0;
  color: #606266;
  line-height: 1.5;
}

.agenda-details {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}

.add-btn {
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
}

.add-btn:hover {
  background-color: #66b1ff;
}

/* 模态框样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  width: 500px;
  max-width: 90%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #909399;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e4e7ed;
}

.form-item {
  margin-bottom: 15px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.form-item input,
.form-item select,
.form-item textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  transition: all 0.3s;
  background-color: #fff;
}

.form-item input:focus,
.form-item select:focus,
.form-item textarea:focus {
  border-color: #409eff;
  outline: none;
}

.form-item textarea {
  height: 100px;
  resize: vertical;
}

.file-select {
  display: flex;
  align-items: center;
}

.select-file-btn {
  background-color: #ecf5ff;
  color: #409eff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 10px;
}

.select-file-btn:hover {
  background-color: #d9ecff;
}

.selected-file {
  flex: 1;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cancel-btn {
  background-color: #fff;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 10px;
}

.cancel-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.confirm-btn {
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
}

.confirm-btn:hover {
  background-color: #66b1ff;
}

.edit-btn, .delete-btn, .upload-btn, .download-btn {
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 13px;
  cursor: pointer;
  margin-left: 5px;
}

.edit-btn {
  background-color: #ecf5ff;
  color: #409eff;
}

.delete-btn {
  background-color: #fef0f0;
  color: #f56c6c;
}

.upload-btn {
  background-color: #f0f9eb;
  color: #67c23a;
}

.download-btn {
  background-color: #f4f4f5;
  color: #909399;
  text-decoration: none;
  display: inline-block;
}

.edit-btn:hover {
  background-color: #d9ecff;
}

.delete-btn:hover {
  background-color: #fde2e2;
}

.upload-btn:hover {
  background-color: #e1f3d8;
}

.download-btn:hover {
  background-color: #e9e9eb;
}

/* 录音项和摘要样式 */
.recording-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.recording-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.recording-meta {
  font-size: 12px;
  color: #909399;
  margin-bottom: 10px;
}

.recording-summary {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #e4e7ed;
}

.recording-summary h5 {
  font-size: 14px;
  color: #606266;
  margin: 0 0 10px 0;
}

.summary-content {
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  white-space: pre-line;
}

.meeting-status-notice {
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #f5f7fa;
  border-radius: 6px;
  border-left: 4px solid #909399;
  font-size: 14px;
}

.meeting-status-notice p {
  margin: 0;
  color: #606266;
}

.status-notice-pending {
  border-left-color: #f59e0b;
}

.status-notice-in-progress {
  border-left-color: #10b981;
}

.status-notice-completed {
  border-left-color: #4f46e5;
}

.status-notice-canceled {
  border-left-color: #ef4444;
}
</style> 