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
            <h3>会议录音</h3>
            <div class="recording-actions">
              <button 
                v-if="isMeetingActive" 
                @click="showUploadRecordingModal = true" 
                class="upload-btn"
              >
                上传录音
              </button>
            </div>
          </div>
          <div class="recording-list">
            <div v-for="recording in recordingItems" :key="recording.id" class="recording-item">
              <div class="recording-info">
                <div class="recording-name">{{ recording.name }}</div>
                <div class="recording-meta">
                  <span>创建时间: {{ recording.createTime }}</span>
                </div>
              </div>
              <div class="recording-actions">
                <a :href="recording.url" target="_blank" class="download-btn">下载</a>
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
      }
    }
  },
  
  // 在onLoad生命周期中获取会议ID
  onLoad(options) {
    // 获取会议ID
    if (options && options.id) {
      this.meetingId = options.id;
    } else {
      uni.showToast({
        title: '缺少会议ID参数',
        icon: 'none'
      });
      
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },

  // 在mounted生命周期中初始化其他数据
  async mounted() {
    try {
      // 不再调用getMeetingDetail API，直接使用传入的ID
      if (this.meetingId) {
        // 设置一个默认的会议标题
        this.meetingTitle = '会议详情';
        // 设置一个默认的会议对象
        this.meeting = {
          id: this.meetingId,
          topic: this.meetingTitle,
          status: 'approved'
        };
        
        // 加载其他相关数据
        this.updateMeetingStatus();
        this.checkIsCreator();
        this.loadMeetingRelatedData();
      } else {
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
    // 初始化会议数据
    initMeetingData() {
      if (!this.meetingId) {
        uni.showToast({
          title: '会议ID不能为空',
          icon: 'none'
        });
        return;
      }
      
      uni.showLoading({
        title: '加载中...'
      });
    },

    // 加载会议相关数据
    loadMeetingRelatedData() {
      Promise.all([
        this.loadAgendaItems(),
        this.loadFileItems(),
        this.loadRecordingItems()
      ])
        .then(() => {
        })
        .catch(err => {
          console.error('加载会议数据失败:', err);
        });
    },

    // 加载测试会议数据
    loadTestMeetingData() {
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
      
      uni.setNavigationBarTitle({
        title: this.meeting.title
      });
      
      this.updateMeetingStatus();
      
      this.loadTestChatMessages();
      this.loadTestAgendaItems();
      this.loadTestFileItems();
      this.loadTestRecordingItems();
    },

    // 更新会议状态
    updateMeetingStatus() {
      if (!this.meeting) return;
      
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
    },

    // 检查当前用户是否是会议创建者
    checkIsCreator() {
      if (!this.meeting || !this.meeting.organizer) {
        this.isCreator = false;
        return;
      }
      
      this.isCreator = this.meeting.organizer.name === this.currentUser;
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
            this.loadTestAgendaItems();
          }
        })
        .catch(err => {
          console.error('加载议题失败:', err);
          this.loadTestAgendaItems();
        });
    },

    // 添加议题
    addAgendaItem(agendaData) {
      return apiRequest.createSubtopic({
        reservationId: this.meetingId,
        title: agendaData.title,
        description: agendaData.description
      })
        .then(res => {
          if (res.code === 200) {
            uni.showToast({
              title: '添加议题成功',
              icon: 'success'
            });
            this.loadAgendaItems();
          } else {
            uni.showToast({
              title: res.msg || '添加议题失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('添加议题失败:', err);
          uni.showToast({
            title: '添加议题失败',
            icon: 'none'
          });
        });
    },

    // 更新议题
    updateAgendaItem(agendaData) {
      return apiRequest.updateSubtopic({
        id: agendaData.id,
        reservationId: this.meetingId,
        title: agendaData.title,
        description: agendaData.description
      })
        .then(res => {
          if (res.code === 200) {
            uni.showToast({
              title: '更新议题成功',
              icon: 'success'
            });
            this.loadAgendaItems();
          } else {
            uni.showToast({
              title: res.msg || '更新议题失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('更新议题失败:', err);
          uni.showToast({
            title: '更新议题失败',
            icon: 'none'
          });
        });
    },

    // 删除议题
    deleteAgendaItem(agendaId) {
      return apiRequest.deleteSubtopic(agendaId)
        .then(res => {
          if (res.code === 200) {
            uni.showToast({
              title: '删除议题成功',
              icon: 'success'
            });
            this.loadAgendaItems();
          } else {
            uni.showToast({
              title: res.msg || '删除议题失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('删除议题失败:', err);
          uni.showToast({
            title: '删除议题失败',
            icon: 'none'
          });
        });
    },

    // 加载议题文件
    loadFileItems(subId) {
      return apiRequest.getSubtopicFileList(subId)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.fileItems = res.data.map(file => ({
              id: file.id,
              name: file.fileName,
              url: file.fileUrl,
              createTime: file.createTime
            }));
          } else {
            this.loadTestFileItems();
          }
        })
        .catch(err => {
          console.error('加载文件失败:', err);
          this.loadTestFileItems();
        });
    },

    // 上传文件
    uploadFile(subId, fileData) {
      return apiRequest.uploadSubtopicFile(subId, fileData.fileKey, fileData.file)
        .then(res => {
          if (res.code === 200) {
            uni.showToast({
              title: '上传文件成功',
              icon: 'success'
            });
            this.loadFileItems(subId);
          } else {
            uni.showToast({
              title: res.msg || '上传文件失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('上传文件失败:', err);
          uni.showToast({
            title: '上传文件失败',
            icon: 'none'
          });
        });
    },

    // 删除文件
    deleteFile(fileId) {
      return apiRequest.deleteSubtopicFile(fileId)
        .then(res => {
          if (res.code === 200) {
            uni.showToast({
              title: '删除文件成功',
              icon: 'success'
            });
            this.loadFileItems();
          } else {
            uni.showToast({
              title: res.msg || '删除文件失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('删除文件失败:', err);
          uni.showToast({
            title: '删除文件失败',
            icon: 'none'
          });
        });
    },

    // 上传录音文件
    uploadRecording(fileData) {
      return apiRequest.uploadAudioAndGenerateSummary(this.meetingId, fileData.url, fileData.file)
        .then(res => {
          if (res.code === 200) {
            uni.showToast({
              title: '上传录音成功',
              icon: 'success'
            });
            this.loadRecordingItems();
          } else {
            uni.showToast({
              title: res.msg || '上传录音失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('上传录音失败:', err);
          uni.showToast({
            title: '上传录音失败',
            icon: 'none'
          });
        });
    },
    
    // 加载会议录音
    loadRecordingItems() {
      return apiRequest.getMeetingSummary(this.meetingId)
        .then(res => {
          if (res.code === 200 && res.data) {
            if (Array.isArray(res.data)) {
              this.recordingItems = res.data;
            } else if (res.data.list && Array.isArray(res.data.list)) {
              this.recordingItems = res.data.list;
            } else {
              this.recordingItems = [];
            }
          } else {
            this.loadTestRecordingItems();
          }
        })
        .catch(err => {
          console.error('加载会议录音失败:', err);
          this.loadTestRecordingItems();
        });
    },
    
    // 加载测试录音数据
    loadTestRecordingItems() {
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
    
    // 下载文件
    downloadFile(file) {
      uni.showToast({
        title: '开始下载: ' + file.name,
        icon: 'none'
      });
      
      setTimeout(() => {
        uni.showToast({
          title: '下载完成',
          icon: 'success'
        });
      }, 2000);
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
    
    // 上传文件处理
    handleFileUpload() {
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
      
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '上传成功',
          icon: 'success'
        });
        
        this.loadFileItems();
        
        this.showUploadFileModal = false;
        
        this.resetUploadForm();
      }, 2000);
    },
    
    // 上传录音文件
    uploadRecordingFile() {
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
      
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '上传成功',
          icon: 'success'
        });
        
        this.loadRecordingItems();
        
        this.uploadRecordingModal = false;
        
        this.resetRecordingForm();
      }, 2000);
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
  align-items: center;
  margin-bottom: 12px;
}

.meeting-title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-right: 12px;
}

.meeting-status {
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.status-pending {
  background-color: #f4f4f5;
  color: #909399;
}

.status-in-progress {
  background-color: #f0f9eb;
  color: #67c23a;
}

.status-completed {
  background-color: #ecf5ff;
  color: #409eff;
}

.status-canceled {
  background-color: #fef0f0;
  color: #f56c6c;
}

.meeting-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 14px;
  color: #606266;
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
</style> 