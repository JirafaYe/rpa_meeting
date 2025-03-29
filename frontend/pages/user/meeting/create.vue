<template>
  <view class="create-meeting-container">
    <form @submit="handleSubmit">
      <view class="form-section">
        <view class="form-title">基本信息</view>
        
        <view class="form-item">
          <text class="form-label required">会议主题</text>
          <input 
            class="form-input" 
            type="text" 
            v-model="form.title" 
            placeholder="请输入会议主题" 
          />
        </view>
        
        <view class="form-item">
          <text class="form-label required">会议类型</text>
          <picker 
            class="form-picker" 
            :range="meetingTypes" 
            :value="typeIndex" 
            @change="handleTypeChange"
          >
            <view class="picker-value">{{ meetingTypes[typeIndex] }}</view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label">所属部门</text>
          <picker 
            class="form-picker" 
            :range="departmentOptions" 
            :value="departmentIndex" 
            @change="handleDepartmentChange"
          >
            <view class="picker-value">{{ departmentOptions[departmentIndex] }}</view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label">优先级</text>
          <picker 
            class="form-picker" 
            :range="priorityOptions" 
            :value="priorityIndex" 
            @change="handlePriorityChange"
          >
            <view class="picker-value">
              <view class="priority-indicator" :class="getPriorityClass(form.priority)"></view>
              {{ priorityOptions[priorityIndex] }}
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label required">日期</text>
          <picker 
            class="form-picker" 
            mode="date" 
            :value="form.date" 
            start="2023-01-01" 
            end="2025-12-31" 
            @change="handleDateChange"
          >
            <view class="picker-value">{{ form.date || '请选择日期' }}</view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label required">开始时间</text>
          <picker 
            class="form-picker" 
            mode="time" 
            :value="form.startTime" 
            @change="handleStartTimeChange"
          >
            <view class="picker-value">{{ form.startTime || '请选择时间' }}</view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label required">结束时间</text>
          <picker 
            class="form-picker" 
            mode="time" 
            :value="form.endTime" 
            @change="handleEndTimeChange"
          >
            <view class="picker-value">{{ form.endTime || '请选择时间' }}</view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label">重复</text>
          <picker 
            class="form-picker" 
            :range="repeatOptions" 
            :value="repeatIndex" 
            @change="handleRepeatChange"
          >
            <view class="picker-value">{{ repeatOptions[repeatIndex] }}</view>
          </picker>
        </view>
      </view>
      
      <view class="form-section">
        <view class="form-title">会议室</view>
        <view class="room-selection" v-if="isLoading">
          <text class="loading-text">加载可用会议室...</text>
        </view>
        <view class="room-selection" v-else>
          <scroll-view class="room-list" scroll-y>
            <radio-group @change="handleRoomChange">
              <label 
                class="room-item" 
                v-for="(room, index) in availableRooms" 
                :key="room.id"
                :class="{ 'selected': form.roomId === room.id }"
              >
                <view class="room-info">
                  <view class="room-name">{{ room.name }}</view>
                  <view class="room-detail">
                    <text class="room-capacity">容量：{{ room.capacity }}人</text>
                    <text class="room-location">{{ room.location }}</text>
                  </view>
                </view>
                <radio :value="room.id.toString()" :checked="form.roomId === room.id" />
              </label>
            </radio-group>
          </scroll-view>
        </view>
      </view>
      
      <view class="form-section">
        <view class="form-title">参会人员</view>
        <view class="attendees-selection">
          <view class="selected-attendees" v-if="form.attendees.length > 0">
            <view 
              class="attendee-tag" 
              v-for="(attendee, index) in form.attendees" 
              :key="index"
            >
              <text class="attendee-name">{{ attendee.name }}</text>
              <text class="remove-btn" @click="removeAttendee(index)">×</text>
            </view>
          </view>
          <view class="add-attendee" @click="showAttendeeSelector">
            <text class="add-icon">+</text>
            <text>添加参会人员</text>
          </view>
        </view>
      </view>
      
      <view class="form-section">
        <view class="form-title">设备需求</view>
        <view class="equipment-list">
          <checkbox-group @change="handleEquipmentChange">
            <label 
              class="equipment-item" 
              v-for="(item, index) in equipmentOptions" 
              :key="index"
            >
              <checkbox 
                :value="item" 
                :checked="form.equipment.includes(item)" 
              />
              <text class="equipment-name">{{ item }}</text>
            </label>
          </checkbox-group>
        </view>
      </view>
      
      <view class="form-section">
        <view class="form-title">会议议程</view>
        <view class="agenda-list">
          <view class="agenda-items">
            <view 
              class="agenda-item" 
              v-for="(item, index) in form.agenda" 
              :key="index"
            >
              <view class="agenda-header">
                <view class="agenda-time">
                  <input 
                    class="time-input" 
                    type="text" 
                    v-model="item.time" 
                    placeholder="时间点" 
                  />
                </view>
                <view class="agenda-actions">
                  <text class="move-up-btn" @click="moveAgendaItem(index, -1)" v-if="index > 0">↑</text>
                  <text class="move-down-btn" @click="moveAgendaItem(index, 1)" v-if="index < form.agenda.length - 1">↓</text>
                  <text class="delete-btn" @click="removeAgendaItem(index)">×</text>
                </view>
              </view>
              <view class="agenda-content">
                <textarea 
                  class="content-input" 
                  v-model="item.content" 
                  placeholder="议程内容" 
                  auto-height
                />
              </view>
              <view class="agenda-speaker" v-if="form.type !== '普通会议'">
                <input 
                  class="speaker-input" 
                  type="text" 
                  v-model="item.speaker" 
                  placeholder="负责人/发言人" 
                />
              </view>
            </view>
          </view>
          
          <view class="add-agenda" @click="addAgendaItem">
            <text class="add-icon">+</text>
            <text>添加议程项</text>
          </view>
        </view>
      </view>
      
      <view class="form-section">
        <view class="form-title">会议说明</view>
        <textarea 
          class="form-textarea" 
          v-model="form.description" 
          placeholder="请输入会议说明等补充信息" 
          auto-height
        />
      </view>
      
      <!-- 添加会议附件上传部分 -->
      <view class="form-section">
        <view class="form-title">会议附件</view>
        <view class="attachments-area">
          <view class="attachment-list" v-if="form.attachments.length > 0">
            <view 
              class="attachment-item" 
              v-for="(file, index) in form.attachments" 
              :key="index"
            >
              <view class="file-icon" :class="getFileIconClass(file.type)">
                <text class="iconfont" :class="getFileIcon(file.type)"></text>
              </view>
              <view class="file-info">
                <text class="file-name">{{ file.name }}</text>
                <text class="file-size">{{ file.size }}</text>
              </view>
              <text class="remove-btn" @click="removeAttachment(index)">×</text>
            </view>
          </view>
          <view class="add-attachment" @click="chooseFile">
            <text class="add-icon">+</text>
            <text>添加附件</text>
          </view>
          <view class="attachment-hint">
            <text>支持文档、图片、PDF等格式，单个文件不超过10MB</text>
          </view>
        </view>
      </view>
      
      <view class="submit-section">
        <button 
          class="submit-btn" 
          :disabled="isSubmitting" 
          :loading="isSubmitting" 
          form-type="submit"
        >{{ isEdit ? '保存修改' : '提交申请' }}</button>
        <button 
          class="cancel-btn" 
          type="default" 
          @click="handleCancel"
        >取消</button>
      </view>
    </form>
  </view>
</template>

<script>
import api from '../../../utils/api.js'

export default {
  data() {
    return {
      isEdit: false,
      meetingId: null,
      meetingTypes: ['普通会议', '项目评审', '团队周会', '培训会议', '客户会议'],
      typeIndex: 0,
      priorityOptions: ['普通', '重要', '紧急'],
      priorityIndex: 0,
      departmentOptions: ['技术部', '产品部', '市场部', '销售部', '人事部', '财务部', '行政部'],
      departmentIndex: 0,
      repeatOptions: ['不重复', '每天', '每周', '每两周', '每月'],
      repeatIndex: 0,
      equipmentOptions: ['投影仪', '白板', '视频会议设备', '话筒', '电视'],
      availableRooms: [],
      isLoading: false,
      isSubmitting: false,
      form: {
        title: '',
        type: '普通会议',
        priority: '普通', // 会议优先级
        department: '技术部', // 所属部门
        date: '',
        startTime: '',
        endTime: '',
        repeat: '不重复',
        roomId: '',
        attendees: [],
        equipment: [],
        description: '',
        attachments: [],
        agenda: []
      }
    };
  },
  onLoad(options) {
    // 设置默认的日期为今天
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.form.date = `${year}-${month}-${day}`;
    
    // 设置默认的开始时间为当前小时往后一小时
    const hour = (today.getHours() + 1).toString().padStart(2, '0');
    this.form.startTime = `${hour}:00`;
    this.form.endTime = `${(today.getHours() + 2).toString().padStart(2, '0')}:00`;
    
    // 如果url参数中有日期，则使用参数的日期
    if (options.date) {
      this.form.date = options.date;
    }
    
    // 如果url参数中有id，则是编辑模式
    if (options.id) {
      this.isEdit = true;
      this.meetingId = options.id;
      this.loadMeetingDetail();
    } else {
      this.loadAvailableRooms();
    }
  },
  methods: {
    // 加载会议详情
    loadMeetingDetail() {
      uni.showLoading({ title: '加载中...' });
      
      api.meeting.getDetail(this.meetingId)
        .then(res => {
          if (res.code === 200 && res.data) {
            // 填充表单数据
            const meeting = res.data;
            
            this.form.title = meeting.title;
            this.form.date = meeting.date;
            
            // 解析时间
            if (meeting.time) {
              const timeParts = meeting.time.split(' - ');
              this.form.startTime = timeParts[0];
              this.form.endTime = timeParts[1];
            }
            
            // 设置会议类型
            const typeIndex = this.meetingTypes.findIndex(type => type === meeting.type);
            this.typeIndex = typeIndex !== -1 ? typeIndex : 0;
            this.form.type = this.meetingTypes[this.typeIndex];
            
            // 设置部门
            if (meeting.department) {
              const deptIndex = this.departmentOptions.findIndex(dept => dept === meeting.department);
              this.departmentIndex = deptIndex !== -1 ? deptIndex : 0;
              this.form.department = this.departmentOptions[this.departmentIndex];
            }
            
            // 设置优先级
            if (meeting.priority !== undefined) {
              this.priorityIndex = meeting.priority;
              this.form.priority = meeting.priority;
            }
            
            // 设置重复选项
            const repeatIndex = this.repeatOptions.findIndex(opt => opt === meeting.repeat);
            this.repeatIndex = repeatIndex !== -1 ? repeatIndex : 0;
            this.form.repeat = this.repeatOptions[this.repeatIndex];
            
            // 设置会议室
            this.form.roomId = meeting.roomId;
            
            // 设置参会人员
            this.form.attendees = meeting.participants || [];
            
            // 设置设备需求
            this.form.equipment = meeting.equipment || [];
            
            // 设置会议说明
            this.form.description = meeting.description || '';
            
            // 设置议程
            this.form.agenda = meeting.agenda || [];
            
            // 如果没有议程但有描述，可以尝试从描述中提取议程
            if (!this.form.agenda.length && meeting.description) {
              this.tryExtractAgendaFromDescription(meeting.description);
            }
            
            // 设置附件
            this.form.attachments = meeting.attachments || [];
          } else {
            uni.showToast({
              title: res.message || '获取会议详情失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取会议详情失败:', err);
          uni.showToast({
            title: '获取会议详情失败',
            icon: 'none'
          });
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    // 加载可用会议室
    loadAvailableRooms() {
      this.isLoading = true;
      
      const params = {
        date: this.form.date,
        startTime: this.form.startTime,
        endTime: this.form.endTime
      };
      
      api.room.getAvailableList(params)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.availableRooms = res.data;
          } else {
            uni.showToast({
              title: res.message || '获取可用会议室失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取可用会议室失败:', err);
          uni.showToast({
            title: '获取可用会议室失败',
            icon: 'none'
          });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    // 处理会议类型变更
    handleTypeChange(e) {
      this.typeIndex = e.detail.value;
      this.form.type = this.meetingTypes[this.typeIndex];
    },
    // 获取状态对应的CSS类名
    getStatusClass(status) {
      const statusClasses = {
        0: 'status-pending',
        1: 'status-approved',
        2: 'status-rejected',
        3: 'status-cancelled'
      };
      return statusClasses[status] || 'status-unknown';
    },
    // 处理日期变更
    handleDateChange(e) {
      this.form.date = e.detail.value;
      // 日期变化后重新加载可用会议室
      if (this.form.startTime && this.form.endTime) {
        this.loadAvailableRooms();
      }
    },
    // 处理开始时间变更
    handleStartTimeChange(e) {
      const newStartTime = e.detail.value;
      this.form.startTime = newStartTime;
      
      // 检查结束时间是否需要调整
      if (this.form.endTime && this.form.endTime <= newStartTime) {
        // 计算新的结束时间为开始时间后一小时
        const [hours, minutes] = newStartTime.split(':').map(Number);
        const newHour = (hours + 1) % 24;
        this.form.endTime = `${newHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        uni.showToast({
          title: '结束时间已自动调整',
          icon: 'none'
        });
      }
      
      // 时间变化后重新加载可用会议室
      if (this.form.date && this.form.endTime) {
        this.loadAvailableRooms();
      }
    },
    // 处理结束时间变更
    handleEndTimeChange(e) {
      const newEndTime = e.detail.value;
      
      // 验证结束时间是否晚于开始时间
      if (this.form.startTime && newEndTime <= this.form.startTime) {
        uni.showToast({
          title: '结束时间必须晚于开始时间',
          icon: 'none'
        });
        // 如果已有有效的结束时间，则保持原值，否则设置为开始时间后一小时
        if (this.form.endTime && this.form.endTime > this.form.startTime) {
          // 保持原有的有效结束时间
          return;
        } else if (this.form.startTime) {
          // 计算开始时间后一小时作为结束时间
          const [hours, minutes] = this.form.startTime.split(':').map(Number);
          const newHour = (hours + 1) % 24;
          this.form.endTime = `${newHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          return;
        }
      }
      
      // 时间有效，更新结束时间
      this.form.endTime = newEndTime;
      
      // 时间变化后重新加载可用会议室
      if (this.form.date && this.form.startTime) {
        this.loadAvailableRooms();
      }
    },
    // 处理重复选项变更
    handleRepeatChange(e) {
      this.repeatIndex = e.detail.value;
      this.form.repeat = this.repeatOptions[this.repeatIndex];
    },
    // 处理会议室选择变更
    handleRoomChange(e) {
      this.form.roomId = e.detail.value;
    },
    // 显示参会人员选择器
    showAttendeeSelector() {
      uni.navigateTo({
        url: '/pages/user/contact-selector',
        events: {
          // 接收选中的联系人
          selectedContacts: (contacts) => {
            console.log('收到选中的联系人:', contacts);
            // 去重处理
            const existingIds = this.form.attendees.map(attendee => attendee.id.toString());
            const newAttendees = contacts.filter(contact => !existingIds.includes(contact.id.toString()));
            
            // 添加新选择的联系人
            if (newAttendees.length > 0) {
              this.form.attendees = [...this.form.attendees, ...newAttendees];
              console.log('更新后的参会人员:', this.form.attendees);
            }
          }
        },
        success: (res) => {
          // 确保事件通道被正确创建
          console.log('导航到联系人选择器成功');
          const eventChannel = res.eventChannel;
          // 发送当前已选择的联系人
          if (eventChannel) {
            console.log('事件通道已创建，发送当前已选择的联系人');
            eventChannel.emit('selectedContacts', this.form.attendees);
          } else {
            console.error('无法创建事件通道');
          }
        },
        fail: (err) => {
          console.error('导航到联系人选择器失败:', err);
          uni.showToast({
            title: '无法打开联系人选择器',
            icon: 'none'
          });
        }
      });
    },
    // 移除参会人员
    removeAttendee(index) {
      this.form.attendees.splice(index, 1);
    },
    // 处理设备需求变更
    handleEquipmentChange(e) {
      this.form.equipment = e.detail.value;
    },
    // 选择文件作为附件
    chooseFile() {
      // 使用条件编译，根据不同平台选择不同的文件选择方法
      // #ifdef H5
      // 在H5平台，创建一个隐藏的input元素来选择文件
      const inputEl = document.createElement('input');
      inputEl.type = 'file';
      inputEl.accept = '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.txt';
      inputEl.style.display = 'none';
      
      inputEl.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // 检查文件大小
        if (file.size > 10 * 1024 * 1024) {
          uni.showToast({
            title: '文件大小不能超过10MB',
            icon: 'none'
          });
          return;
        }
        
        // 获取文件扩展名
        const fileName = file.name;
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        
        // 添加到附件列表
        this.form.attachments.push({
          name: fileName,
          size: this.formatFileSize(file.size),
          type: fileExtension,
          file: file // 保存文件对象
        });
      };
      
      document.body.appendChild(inputEl);
      inputEl.click();
      
      // 使用完后移除
      setTimeout(() => {
        document.body.removeChild(inputEl);
      }, 100);
      // #endif
      
      // #ifdef APP-PLUS
      // 在APP环境下使用plus.nativeUI.actionSheet来选择文件来源
      plus.nativeUI.actionSheet({
        title: '选择文件来源',
        cancel: '取消',
        buttons: [
          { title: '拍照' },
          { title: '从相册选择' },
          { title: '从文件选择' }
        ]
      }, (e) => {
        switch (e.index) {
          case 1: // 拍照
            this.captureImage();
            break;
          case 2: // 从相册选择
            this.chooseFromAlbum();
            break;
          case 3: // 从文件选择
            this.chooseFromFiles();
            break;
        }
      });
      // #endif
      
      // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
      // 在小程序环境，先使用chooseImage，后续可考虑其他文件类型的选择方法
      uni.chooseImage({
        count: 1,
        success: (res) => {
          const file = res.tempFiles[0];
          
          // 检查文件大小
          if (file.size > 10 * 1024 * 1024) {
            uni.showToast({
              title: '文件大小不能超过10MB',
              icon: 'none'
            });
            return;
          }
          
          // 获取文件名和类型
          const filePath = file.path;
          const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
          // 从文件名或路径获取扩展名，默认为jpg
          let fileExtension = 'jpg';
          if (fileName.includes('.')) {
            fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
          }
          
          // 添加到附件列表
          this.form.attachments.push({
            name: fileName,
            size: this.formatFileSize(file.size),
            type: fileExtension,
            path: file.path
          });
        }
      });
      // #endif
    },
    // 拍照获取图片（APP环境）
    captureImage() {
      const camera = plus.camera.getCamera();
      camera.captureImage(
        (path) => {
          // 将本地URL路径转换为平台绝对路径
          plus.io.resolveLocalFileSystemURL(path, (entry) => {
            // 获取文件信息
            entry.file((file) => {
              const fileName = path.substring(path.lastIndexOf('/') + 1);
              
              // 添加到附件列表
              this.form.attachments.push({
                name: fileName,
                size: this.formatFileSize(file.size || 0),
                type: 'jpg',
                path: path
              });
            });
          });
        },
        (error) => {
          console.error('拍照失败: ' + error.message);
        },
        { filename: '_doc/camera/' }
      );
    },
    
    // 从相册选择（APP环境）
    chooseFromAlbum() {
      plus.gallery.pick(
        (paths) => {
          const path = paths.files[0];
          plus.io.resolveLocalFileSystemURL(path, (entry) => {
            entry.file((file) => {
              const fileName = path.substring(path.lastIndexOf('/') + 1);
              let fileExtension = 'jpg';
              if (fileName.includes('.')) {
                fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
              }
              
              // 添加到附件列表
              this.form.attachments.push({
                name: fileName,
                size: this.formatFileSize(file.size || 0),
                type: fileExtension,
                path: path
              });
            });
          });
        },
        (error) => {
          console.error('选择图片失败: ' + error.message);
        },
        { filter: 'image', maximum: 1, system: false, onmaxed: () => {
          uni.showToast({ title: '最多只能选择1个文件', icon: 'none' });
        }}
      );
    },
    
    // 从文件选择（APP环境）
    chooseFromFiles() {
      // 尝试使用第三方文件选择器插件，如果不可用则提示用户
      if (plus.os.name.toLowerCase() === 'android') {
        // Android环境下
        try {
          const Intent = plus.android.importClass("android.content.Intent");
          const intent = new Intent(Intent.ACTION_GET_CONTENT);
          intent.setType("*/*");
          intent.addCategory(Intent.CATEGORY_OPENABLE);
          
          const main = plus.android.runtimeMainActivity();
          main.startActivityForResult(intent, 1);
          
          // 设置选择文件结果监听
          main.onActivityResult = (requestCode, resultCode, data) => {
            if (requestCode === 1) {
              const uri = data.getData();
              if (uri) {
                const path = plus.android.invoke(uri, "getPath");
                const fileName = path.substring(path.lastIndexOf('/') + 1);
                const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
                
                // 获取文件大小（这里简化处理）
                const size = '未知大小';
                
                // 添加到附件列表
                this.form.attachments.push({
                  name: fileName,
                  size: size,
                  type: fileExtension,
                  path: path
                });
              }
            }
          };
        } catch (e) {
          console.error('文件选择错误:', e);
          uni.showToast({
            title: '暂不支持该操作，请选择其他方式',
            icon: 'none'
          });
        }
      } else if (plus.os.name.toLowerCase() === 'ios') {
        // iOS环境下
        uni.showToast({
          title: '暂不支持iOS文件选择，请选择其他方式',
          icon: 'none'
        });
      }
    },
    // 移除附件
    removeAttachment(index) {
      this.form.attachments.splice(index, 1);
    },
    // 获取文件图标CSS类
    getFileIconClass(type) {
      switch (type) {
        case 'doc':
        case 'docx':
          return 'doc-icon';
        case 'xls':
        case 'xlsx':
          return 'excel-icon';
        case 'ppt':
        case 'pptx':
          return 'ppt-icon';
        case 'pdf':
          return 'pdf-icon';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return 'image-icon';
        default:
          return 'file-icon';
      }
    },
    // 获取文件图标
    getFileIcon(type) {
      switch (type) {
        case 'doc':
        case 'docx':
          return 'icon-doc';
        case 'xls':
        case 'xlsx':
          return 'icon-excel';
        case 'ppt':
        case 'pptx':
          return 'icon-ppt';
        case 'pdf':
          return 'icon-pdf';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return 'icon-image';
        default:
          return 'icon-file';
      }
    },
    // 格式化文件大小
    formatFileSize(size) {
      if (size < 1024) {
        return size + 'B';
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(1) + 'KB';
      } else {
        return (size / (1024 * 1024)).toFixed(1) + 'MB';
      }
    },
    // 验证表单
    validateForm() {
      if (!this.form.title.trim()) {
        uni.showToast({
          title: '请输入会议主题',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.form.date) {
        uni.showToast({
          title: '请选择会议日期',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.form.startTime) {
        uni.showToast({
          title: '请选择开始时间',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.form.endTime) {
        uni.showToast({
          title: '请选择结束时间',
          icon: 'none'
        });
        return false;
      }
      
      // 检查结束时间是否晚于开始时间
      if (this.form.startTime >= this.form.endTime) {
        uni.showToast({
          title: '结束时间必须晚于开始时间',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.form.roomId) {
        uni.showToast({
          title: '请选择会议室',
          icon: 'none'
        });
        return false;
      }
      
      if (this.form.attendees.length === 0) {
        uni.showToast({
          title: '请添加至少一位参会人员',
          icon: 'none'
        });
        return false;
      }
      
      // 验证议程
      if (this.form.agenda.length > 0) {
        const hasInvalidAgenda = this.form.agenda.some(item => !item.time || !item.content);
        if (hasInvalidAgenda) {
          uni.showToast({
            title: '请完善议程内容',
            icon: 'none'
          });
          return false;
        }
      }
      
      return true;
    },
    // 处理表单提交
    handleSubmit() {
      if (!this.validateForm()) {
        return;
      }
      
      this.isSubmitting = true;
      uni.showLoading({ title: '提交中...' });
      
      // 准备提交的数据，确保时间格式正确
      const formatTime = (date, time) => {
        if (!date || !time) return '';
        return `${date} ${time}`;
      };
      
      const meetingData = {
        title: this.form.title,
        description: this.form.description,
        roomId: this.form.roomId,
        startTime: formatTime(this.form.date, this.form.startTime),
        endTime: formatTime(this.form.date, this.form.endTime),
        type: this.form.type,
        priority: this.form.priority,
        department: this.form.department,
        repeat: this.form.repeat,
        participants: this.form.attendees || [], // 直接提交参会人员完整对象
        equipment: this.form.equipment || [],
        agenda: this.form.agenda || [], // 添加议程数据
        isRpa: this.form.isRpa || false,
        rpaConfig: this.form.isRpa ? {
          recordAudio: true,
          recordVideo: false,
          autoTranscribe: true,
          autoSummary: true,
          settings: {
            audioQuality: 'high',
            language: 'zh-CN',
            speakerIdentification: true,
            noiseReduction: true
          }
        } : null
      };
      
      console.log('提交会议数据:', meetingData);
      
      // 判断是新建还是编辑
      if (!api.meeting.createMeeting || !api.meeting.updateMeeting) {
        console.error('API方法未定义:', api.meeting);
        uni.showToast({
          title: 'API方法未定义',
          icon: 'none'
        });
        this.isSubmitting = false;
        uni.hideLoading();
        return;
      }
      
      // 安全调用API
      const apiMethod = this.isEdit ? 'updateMeeting' : 'createMeeting';
      
      try {
        const apiPromise = this.isEdit 
          ? api.meeting[apiMethod](this.meetingId, meetingData)
          : api.meeting[apiMethod](meetingData);
          
        apiPromise
          .then(res => {
            uni.hideLoading();
            this.isSubmitting = false;
            
            if (res.code === 200) {
              uni.showToast({
                title: this.isEdit ? '会议已更新' : '会议已提交',
                icon: 'success'
              });
              
              // 提交附件
              if (this.form.attachments && this.form.attachments.length > 0) {
                this.uploadAttachments(res.data.id);
              } else {
                setTimeout(() => {
                  uni.navigateBack();
                }, 1500);
              }
            } else {
              uni.showToast({
                title: res.message || '提交失败',
                icon: 'none'
              });
            }
          })
          .catch(err => {
            console.error(this.isEdit ? '更新会议失败:' : '创建会议失败:', err);
            uni.hideLoading();
            this.isSubmitting = false;
            uni.showToast({
              title: '提交失败',
              icon: 'none'
            });
          });
      } catch (error) {
        console.error('API调用异常:', error);
        uni.hideLoading();
        this.isSubmitting = false;
        uni.showToast({
          title: 'API调用异常',
          icon: 'none'
        });
      }
    },
    // 上传附件
    uploadAttachments(meetingId) {
      // 显示上传提示
      uni.showLoading({ title: '上传附件中...' });
      
      // 记录上传成功的数量
      let uploadedCount = 0;
      const totalAttachments = this.form.attachments.length;
      
      // 依次上传每个附件
      this.form.attachments.forEach((file, index) => {
        // 构建上传数据
        const fileData = {
          meetingId: meetingId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        };
        
        // 实际项目中，这里应该是真实的文件上传
        // 如果有文件对象或路径，可以使用以下方式上传
        if (file.file) {
          // H5环境，有实际的文件对象
          console.log('上传文件对象:', file.file);
          // 这里可以使用FormData来上传文件
          // const formData = new FormData();
          // formData.append('file', file.file);
          // formData.append('meetingId', meetingId);
          // 然后通过HTTP请求上传文件
        } else if (file.path) {
          // APP或小程序环境，有文件路径
          console.log('上传文件路径:', file.path);
          // 这里可以使用uni.uploadFile来上传文件
          /*
          uni.uploadFile({
            url: 'your-upload-url',
            filePath: file.path,
            name: 'file',
            formData: {
              'meetingId': meetingId
            },
            success: (uploadRes) => {
              console.log('上传成功', uploadRes);
              // 处理上传成功
            },
            fail: (err) => {
              console.error('上传失败', err);
              // 处理上传失败
            }
          });
          */
        }
        
        // 调用上传文件接口（当前使用模拟接口）
        api.meeting.uploadFile(fileData)
          .then(res => {
            console.log(`文件 ${file.name} 上传结果:`, res);
            uploadedCount++;
            
            // 所有文件上传完成后处理
            if (uploadedCount === totalAttachments) {
              uni.hideLoading();
              uni.showToast({
                title: '上传附件成功',
                icon: 'success',
                duration: 1500
              });
              
              // 返回上一页
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            }
          })
          .catch(err => {
            console.error(`文件 ${file.name} 上传失败:`, err);
            uploadedCount++;
            
            // 显示错误提示
            uni.showToast({
              title: `文件 ${file.name} 上传失败`,
              icon: 'none'
            });
            
            // 所有文件上传完成后处理
            if (uploadedCount === totalAttachments) {
              uni.hideLoading();
              // 返回上一页
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            }
          });
      });
    },
    // 处理取消按钮
    handleCancel() {
      uni.navigateBack();
    },
    // 添加议程项
    addAgendaItem() {
      this.form.agenda.push({
        time: '',
        content: '',
        speaker: ''
      });
    },
    
    // 移除议程项
    removeAgendaItem(index) {
      this.form.agenda.splice(index, 1);
    },
    
    // 移动议程项
    moveAgendaItem(index, direction) {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= this.form.agenda.length) return;
      
      const item = this.form.agenda[index];
      this.form.agenda.splice(index, 1);
      this.form.agenda.splice(newIndex, 0, item);
    },
    
    // 尝试从描述中提取议程
    tryExtractAgendaFromDescription(description) {
      // 简单的议程提取逻辑，假设格式为：时间：内容
      const lines = description.split('\n');
      const agendaItems = [];
      
      lines.forEach(line => {
        // 匹配类似 "10:00-10:15：开场介绍" 或 "10:00：开场介绍" 的格式
        const timeMatch = line.match(/^(\d{1,2}:\d{2}(?:-\d{1,2}:\d{2})?)[:：](.*)/);
        if (timeMatch) {
          agendaItems.push({
            time: timeMatch[1],
            content: timeMatch[2].trim(),
            speaker: ''
          });
        }
      });
      
      if (agendaItems.length > 0) {
        this.form.agenda = agendaItems;
      }
    },
    // 处理部门选择变更
    handleDepartmentChange(e) {
      this.departmentIndex = e.detail.value;
      this.form.department = this.departmentOptions[this.departmentIndex];
    },
    
    // 处理优先级变更
    handlePriorityChange(e) {
      this.priorityIndex = e.detail.value;
      this.form.priority = this.priorityIndex;
    },
    
    // 获取优先级对应的CSS类名
    getPriorityClass(priority) {
      const priorityClasses = {
        0: 'priority-normal',
        1: 'priority-important',
        2: 'priority-urgent'
      };
      return priorityClasses[priority] || 'priority-normal';
    },
  }
};
</script>

<style>
.create-meeting-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 30px;
}

.form-section {
  background-color: #ffffff;
  margin: 15px;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #3498db;
}

.form-item {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.required::after {
  content: ' *';
  color: #e74c3c;
}

.form-input {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-picker {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 14px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.picker-value {
  color: #333;
}

.room-selection {
  margin-top: 10px;
}

.loading-text {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 20px 0;
}

.room-list {
  max-height: 250px;
}

.room-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.room-item.selected {
  background-color: #e6f7ff;
}

.room-info {
  flex: 1;
}

.room-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.room-detail {
  display: flex;
  font-size: 12px;
  color: #666;
}

.room-capacity {
  margin-right: 15px;
}

.attendees-selection {
  margin-top: 10px;
}

.selected-attendees {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.attendee-tag {
  display: flex;
  align-items: center;
  background-color: #e6f7ff;
  border-radius: 15px;
  padding: 5px 10px;
  margin-right: 8px;
  margin-bottom: 8px;
}

.attendee-name {
  font-size: 14px;
  color: #333;
}

.remove-btn {
  margin-left: 5px;
  color: #999;
  font-size: 16px;
}

.add-attendee, .add-attachment {
  display: flex;
  align-items: center;
  color: #3498db;
  font-size: 14px;
}

.add-icon {
  font-size: 18px;
  margin-right: 5px;
}

.equipment-list {
  margin-top: 10px;
}

.equipment-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.equipment-name {
  margin-left: 8px;
  font-size: 14px;
  color: #333;
}

.form-textarea {
  width: 100%;
  min-height: 100px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  box-sizing: border-box;
}

.attachments-area {
  margin-top: 10px;
}

.attachment-list {
  margin-bottom: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
}

.file-icon {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: white;
}

.icon-doc {
  background-color: #2a5699;
}

.icon-excel {
  background-color: #217346;
}

.icon-ppt {
  background-color: #d24726;
}

.icon-pdf {
  background-color: #f40f02;
}

.icon-image {
  background-color: #f9a825;
}

.icon-other {
  background-color: #757575;
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: 14px;
  color: #333;
}

.file-size {
  font-size: 12px;
  color: #999;
}

.attachment-hint {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.submit-section {
  margin: 20px 15px;
}

.submit-btn {
  background-color: #3498db;
  color: white;
  border-radius: 5px;
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  margin-bottom: 15px;
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #666;
  border-radius: 5px;
  height: 45px;
  line-height: 45px;
  font-size: 16px;
}

.agenda-list {
  margin-top: 10px;
}

.agenda-items {
  margin-bottom: 15px;
}

.agenda-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}

.agenda-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.agenda-time {
  flex: 1;
}

.time-input {
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 14px;
  background-color: #fff;
}

.agenda-actions {
  display: flex;
  align-items: center;
}

.move-up-btn, .move-down-btn, .delete-btn {
  margin: 0 5px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: #f0f0f0;
  border-radius: 50%;
  color: #666;
  font-size: 16px;
}

.delete-btn {
  color: #e74c3c;
}

.agenda-content {
  margin-bottom: 10px;
}

.content-input {
  width: 100%;
  min-height: 80px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  box-sizing: border-box;
  background-color: #fff;
}

.agenda-speaker {
  margin-top: 5px;
}

.speaker-input {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 14px;
  box-sizing: border-box;
  background-color: #fff;
}

.add-agenda {
  display: flex;
  align-items: center;
  padding: 12px;
  color: #3498db;
  font-size: 14px;
  background-color: #f0f7fc;
  border-radius: 8px;
  border: 1px dashed #a6d0ee;
  justify-content: center;
}

.add-agenda .add-icon {
  margin-right: 5px;
  font-size: 18px;
  font-weight: bold;
}

.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-pending {
  background-color: #faad14;
}

.status-approved {
  background-color: #52c41a;
}

.status-rejected {
  background-color: #f5222d;
}

.status-cancelled {
  background-color: #bfbfbf;
}

.priority-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.priority-normal {
  background-color: #52c41a;
}

.priority-important {
  background-color: #faad14;
}

.priority-urgent {
  background-color: #f5222d;
}
</style> 