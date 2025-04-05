<template>
  <view class="create-meeting-container">
    <!-- 添加面包屑导航 -->
    <view class="breadcrumb">
      <view class="breadcrumb-item" @click="navigateToList">会议列表</view>
      <text class="breadcrumb-separator">/</text>
      <view class="breadcrumb-item">{{ isEdit ? '编辑会议' : '创建会议' }}</view>
    </view>

    <form @submit="handleSubmit">
      <view class="form-section">
        <view class="form-title">基本信息</view>
        
        <view class="form-item">
          <view class="form-label">会议名称</view>
          <input 
            class="form-input" 
            type="text" 
            v-model="form.title" 
            placeholder="请输入会议名称"
          />
        </view>
        
        <view class="form-item">
          <view class="form-label">会议日期</view>
          <picker 
            mode="date" 
            :value="form.date" 
            @change="handleDateChange"
          >
            <view class="picker-value">{{ form.date || '请选择日期' }}</view>
          </picker>
        </view>
        
        <view class="form-item">
          <view class="form-label">开始时间</view>
          <picker 
            mode="time" 
            :value="form.startTime" 
            @change="handleStartTimeChange"
          >
            <view class="picker-value">{{ form.startTime || '请选择开始时间' }}</view>
          </picker>
        </view>
        
        <view class="form-item">
          <view class="form-label">结束时间</view>
          <picker 
            mode="time" 
            :value="form.endTime" 
            @change="handleEndTimeChange"
          >
            <view class="picker-value">{{ form.endTime || '请选择结束时间' }}</view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label">会议类型</text>
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
              <view class="agenda-files">
                <view v-if="item.files && item.files.length > 0" class="files-list">
                  <view v-for="(file, fileIndex) in item.files" :key="fileIndex" class="file-item">
                    <text class="file-name">{{ file.name }}</text>
                    <text class="file-size">{{ file.size }}</text>
                    <text class="delete-btn" @click="removeAgendaFile(index, fileIndex)">×</text>
                  </view>
                </view>
                <view class="add-file-btn" @click="selectAgendaFile(index)">
                  <text class="add-icon">+</text>
                  <text>添加议程文件</text>
                </view>
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
          @click="handleSubmit"
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
import api from '../../../api/index'

export default {
  data() {
    return {
      isEdit: false,
      meetingId: null,
      meetingTypes: ['普通会议', '项目评审', '团队周会', '培训会议', '客户会议'],
      typeIndex: 0,
      priorityOptions: ['普通', '重要', '紧急'],
      priorityIndex: 0,
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
        date: '',
        startTime: '',
        endTime: '',
        repeat: '不重复',
        roomId: '',
        attendees: [],
        equipment: [],
        description: '',
        attachments: [],
        agenda: [
          {
            time: '',
            content: '',
            speaker: '',
            files: []
          }
        ]
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
    
    // 初始化参会人员列表为空数组
    this.form.attendees = [];
    
    // 尝试获取当前登录用户信息
    try {
      // 优先从vuex或全局用户状态获取
      const app = getApp();
      let userInfo = null;
      
      // 如果有全局用户状态管理，尝试从那里获取
      if (app && app.globalData && app.globalData.userInfo) {
        userInfo = app.globalData.userInfo;
        console.log('从全局状态获取到用户信息:', userInfo);
      } else {
        // 尝试从本地存储获取
        userInfo = uni.getStorageSync('userInfo');
        console.log('从本地存储获取到用户信息:', userInfo);
      }
      
      // 如果有用户信息且包含ID
      if (userInfo && userInfo.id) {
        // 确保ID是整数类型
        const userId = parseInt(userInfo.id);
        const userName = userInfo.username || userInfo.name || '我';
        
        // 只有在有效ID的情况下添加用户
        if (!isNaN(userId) && userId > 0) {
          this.form.attendees.push({
            id: userId,
            name: userName,
            avatar: userInfo.avatarUrl || ''
          });
          
          console.log('初始化参会人员列表:', JSON.stringify(this.form.attendees));
        } else {
          console.error('获取到的用户ID无效:', userInfo.id);
        }
      } else {
        // 尝试通过API获取用户信息
        console.warn('本地未找到用户信息，尝试通过API获取');
        api.user.getUserInfo()
          .then(res => {
            if (res.code === 200 && res.data) {
              const apiUserInfo = res.data;
              const userId = parseInt(apiUserInfo.id);
              
              if (!isNaN(userId) && userId > 0) {
                this.form.attendees.push({
                  id: userId,
                  name: apiUserInfo.username || apiUserInfo.name || '我',
                  avatar: apiUserInfo.avatarUrl || ''
                });
                console.log('从API获取并添加用户到参会列表:', this.form.attendees);
              }
            } else {
              console.error('API获取用户信息失败:', res);
            }
          })
          .catch(err => {
            console.error('获取用户信息API异常:', err);
          });
      }
    } catch (error) {
      console.error('处理用户信息时出错:', error);
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
  onReady() {
    // 注册全局事件监听，接收来自联系人选择器的数据
    uni.$on('updateSelectedAttendees', (selectedContacts) => {
      console.log('接收到联系人选择器返回的参会人员:', selectedContacts);
      if (selectedContacts && Array.isArray(selectedContacts)) {
        this.handleSelectedAttendees(selectedContacts);
      }
    });
  },
  onUnload() {
    uni.$off('updateSelectedAttendees');
  },
  methods: {
    navigateToList() {
      uni.navigateTo({
        url: '/pages/user/meeting/list',
        fail: () => {
          uni.showToast({
            title: '导航失败',
            icon: 'none'
          });
        }
      });
    },
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
      // 检查必要的参数是否存在
      if (!this.form.date || !this.form.startTime || !this.form.endTime) {
        console.log('缺少必要的参数:', {
          date: this.form.date,
          startTime: this.form.startTime,
          endTime: this.form.endTime
        });
        return;
      }

      this.isLoading = true;
      uni.showLoading({ title: '加载会议室...' });
      
      // 处理时间格式
      const formatTimeWithSeconds = (time) => {
        if (!time) return '';
        // 如果已经有秒级格式，直接返回
        if (time.split(':').length === 3) return time;
        // 否则补充秒
        return `${time}:00`;
      };
      
      // 构建查询参数 - 直接使用扁平结构
      const params = {
        pageNo: 1,
        pageSize: 100,
        isAsc: true,
        sortBy: 'id'
      };
      
      // 添加日期和时间参数，确保正确格式
      params.date = this.form.date;
      params.startTime = formatTimeWithSeconds(this.form.startTime);
      params.endTime = formatTimeWithSeconds(this.form.endTime);
      
      console.log('请求会议室参数:', params);
      
      // 使用API获取会议室列表
      api.room.getRooms(params)
        .then(res => {
          if (res.code === 200 && res.data) {
            // 提取会议室数据
            let roomList = [];
            
            // 根据响应结构解析数据
            if (Array.isArray(res.data)) {
              roomList = res.data;
            } else if (res.data.list && Array.isArray(res.data.list)) {
              roomList = res.data.list;
            } else if (res.data.records && Array.isArray(res.data.records)) {
              roomList = res.data.records;
            }
            
            // 格式化会议室数据
            this.availableRooms = roomList.map(room => ({
              id: room.id,
              name: room.name || '未命名会议室',
              capacity: room.capacity || 0,
              equipment: room.equipment || [],
              location: room.location || '未知位置',
              available: room.status !== 'unavailable' // 根据状态判断可用性
            }));
            
            console.log('可用会议室:', this.availableRooms);
            
            // 如果当前选中的会议室不在可用列表中，清除选择
            if (this.form.roomId) {
              const isCurrentRoomAvailable = this.availableRooms.some(room => room.id.toString() === this.form.roomId.toString());
              if (!isCurrentRoomAvailable) {
                this.form.roomId = '';
                uni.showToast({
                  title: '之前选择的会议室已不可用，请重新选择',
                  icon: 'none'
                });
              }
            }
            
            // 如果没有可用会议室，提示用户
            if (this.availableRooms.length === 0) {
              uni.showToast({
                title: '当前时间段没有可用会议室',
                icon: 'none'
              });
            }
          } else {
            console.error('获取会议室失败:', res);
            uni.showToast({
              title: res.message || '获取会议室失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取会议室失败:', err);
          uni.showToast({
            title: '获取会议室失败',
            icon: 'none'
          });
        })
        .finally(() => {
          uni.hideLoading();
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
        return;
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
      try {
        // 获取当前已选择的参会人ID
        const selectedAttendeeIds = Array.isArray(this.form.attendees) 
          ? this.form.attendees.map(a => parseInt(a.id)).filter(id => !isNaN(id))
          : [];
          
        // 获取当前用户ID
        const currentUserId = this.getCurrentUserId();
        
        console.log('当前选中参会人:', selectedAttendeeIds);
        console.log('当前用户ID:', currentUserId);
        
        // 跳转到联系人选择页面
        uni.navigateTo({
          url: '/pages/user/contact-selector',
          events: {
            // 定义事件，用于接收选择结果
            updateSelectedAttendees: (data) => {
              console.log('通过事件通道收到联系人选择结果:', data);
              this.handleSelectedAttendees(data);
            }
          },
          success: (res) => {
            // 向打开的页面传递参数
            res.eventChannel.emit('initParams', {
              preSelectedIds: selectedAttendeeIds,
              currentUserId: currentUserId
            });
            console.log('成功打开联系人选择器并传递参数');
          },
          fail: (err) => {
            console.error('打开联系人选择器失败:', err);
            uni.showToast({
              title: '打开联系人选择器失败',
              icon: 'none'
            });
          }
        });
      } catch (error) {
        console.error('打开联系人选择器出错:', error);
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    },
    // 处理选中的联系人
    handleSelectedAttendees(selectedData) {
      try {
        console.log('收到选中的联系人数据:', selectedData);
        
        // 检查数据格式
        if (!selectedData) {
          console.warn('没有收到联系人数据');
          return;
        }
        
        let newAttendees = [];
        
        // 处理新的数据格式 (通过事件通道)
        if (selectedData.selectedContacts && Array.isArray(selectedData.selectedContacts)) {
          console.log('使用通道传递的完整联系人数据');
          newAttendees = selectedData.selectedContacts.map(contact => ({
            id: parseInt(contact.id),
            name: contact.name || '',
            avatar: contact.avatar || '/static/default-avatar.png'
          }));
        } 
        // 处理旧的数据格式 (通过全局事件)
        else if (Array.isArray(selectedData)) {
          console.log('使用全局事件传递的联系人数据');
          newAttendees = selectedData.map(contact => ({
            id: parseInt(contact.id),
            name: contact.name || '',
            avatar: contact.avatar || '/static/default-avatar.png'
          }));
        }
        // 如果只有 ID 列表
        else if (selectedData.selectedIds && Array.isArray(selectedData.selectedIds)) {
          console.log('只收到联系人ID列表，需要查找对应联系人信息');
          // 这种情况需要根据ID查找对应的联系人信息
          // 通常在实际应用中应该有一个方法来通过ID获取联系人详情
          // 这里暂时只保存ID
          newAttendees = selectedData.selectedIds.map(id => ({
            id: parseInt(id),
            name: '用户' + id,  // 临时名称，实际应用中应该查询真实名称
            avatar: '/static/default-avatar.png'
          }));
        }
        
        if (newAttendees.length === 0) {
          console.warn('未能解析有效的联系人数据');
          return;
        }
        
        console.log('解析后的新联系人列表:', newAttendees);
        
        // 获取当前用户ID
        const currentUserId = this.getCurrentUserId();
        console.log('当前用户ID:', currentUserId);
        
        // 设置到表单中
        if (this.form.attendees && Array.isArray(this.form.attendees)) {
          // 合并新的与原有的联系人，避免覆盖
          // 构建ID映射以便快速查找
          const existingMap = new Map();
          this.form.attendees.forEach(attendee => {
            existingMap.set(parseInt(attendee.id), attendee);
          });
          
          // 合并新的联系人，避免重复
          newAttendees.forEach(attendee => {
            existingMap.set(parseInt(attendee.id), attendee);
          });
          
          // 转换回数组
          this.form.attendees = Array.from(existingMap.values());
          
          console.log('更新后的联系人列表:', this.form.attendees);
        } else {
          // 如果之前没有联系人，直接设置
          this.form.attendees = newAttendees;
          console.log('设置新的联系人列表:', this.form.attendees);
        }
        
        // 确保当前用户在列表中
        if (currentUserId) {
          const hasCurrentUser = this.form.attendees.some(
            attendee => parseInt(attendee.id) === parseInt(currentUserId)
          );
          
          if (!hasCurrentUser) {
            console.log('当前用户不在联系人列表中，尝试添加');
            
            // 尝试从全局状态获取用户信息
            const userInfo = this.getUserInfo();
            if (userInfo && userInfo.id) {
              this.form.attendees.push({
                id: parseInt(userInfo.id),
                name: userInfo.name || userInfo.username || '当前用户',
                avatar: userInfo.avatar || userInfo.avatarUrl || '/static/default-avatar.png'
              });
              console.log('已添加当前用户到联系人列表');
            } else {
              console.warn('无法获取当前用户信息，无法添加到联系人列表');
            }
          }
        }
      } catch (error) {
        console.error('处理选中联系人时出错:', error);
        uni.showToast({
          title: '处理联系人数据失败',
          icon: 'none'
        });
      }
    },
    // 移除参会人员
    removeAttendee(index) {
      try {
        // 防止移除当前用户
        const userInfo = uni.getStorageSync('userInfo');
        const currentUserId = userInfo && userInfo.id ? parseInt(userInfo.id) : 0;
        
        if (currentUserId > 0) {
          // 获取要移除的参会人ID
          const attendeeToRemove = this.form.attendees[index];
          const attendeeId = typeof attendeeToRemove === 'object' 
            ? parseInt(attendeeToRemove.id) 
            : parseInt(attendeeToRemove);
          
          // 确保是整数ID并进行比较
          if (!isNaN(attendeeId) && attendeeId === currentUserId) {
            uni.showToast({
              title: '无法移除自己',
              icon: 'none'
            });
            return;
          }
        }
        
        // 移除其他参会人员
        this.form.attendees.splice(index, 1);
      } catch (error) {
        console.error('移除参会人员时出错:', error);
        // 出错时也尝试移除
        if (index >= 0 && index < this.form.attendees.length) {
          this.form.attendees.splice(index, 1);
        }
      }
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
      if (!this.form.title || this.form.title.trim() === '') {
        uni.showToast({
          title: '请输入会议主题',
          icon: 'none'
        });
        return false;
      }
      
      // 验证会议标题长度 - 后端限制为5个字符
      if (this.form.title.length > 5) {
        uni.showToast({
          title: '会议主题不能超过5个字符',
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
      console.log('提交表单');
      
      // 表单验证
      if (!this.form.title) {
        uni.showToast({
          title: '请输入会议名称',
          icon: 'none'
        });
        return;
      }
      
      if (!this.form.date) {
        uni.showToast({
          title: '请选择会议日期',
          icon: 'none'
        });
        return;
      }
      
      if (!this.form.startTime) {
        uni.showToast({
          title: '请选择开始时间',
          icon: 'none'
        });
        return;
      }
      
      if (!this.form.endTime) {
        uni.showToast({
          title: '请选择结束时间',
          icon: 'none'
        });
        return;
      }
      
      if (!this.form.roomId) {
        uni.showToast({
          title: '请选择会议室',
          icon: 'none'
        });
        return;
      }
      
      // 显示加载
      uni.showLoading({
        title: '创建中...',
        mask: true
      });
      
      // 构建会议数据
      const meetingData = {
        title: this.form.title,
        room: this.form.roomId,
        description: this.form.description,
        date: this.form.date,
        startTime: this.form.startTime,
        endTime: this.form.endTime
      };
      
      if (this.form.attendees && this.form.attendees.length > 0) {
        meetingData.participants = this.form.attendees.map(p => p.id);
      }
      
      console.log('提交会议数据:', meetingData);
      
      try {
      // 调用创建会议API
        api.bookReservation(meetingData)
          .then(async (res) => {
          if (res.code === 200) {
              console.log('会议创建成功:', res);
              const reservationId = res.data;
              
              // 处理议程和文件上传
              await this.processAgendaItems(reservationId);
              
              uni.hideLoading();
            uni.showToast({
                title: '会议创建成功',
                icon: 'success',
                duration: 2000
            });
            
              // 延迟导航到会议详情页
            setTimeout(() => {
                uni.redirectTo({
                  url: `/pages/user/meeting/detail?id=${reservationId}&from=create`
                });
              }, 2000);
          } else {
              console.error('会议创建失败:', res);
              uni.hideLoading();
            uni.showToast({
                title: res.msg || '会议创建失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
            console.error('会议创建请求失败:', err);
            uni.hideLoading();
          uni.showToast({
              title: '创建请求失败',
            icon: 'none'
          });
          });
      } catch (error) {
        console.error('会议创建异常:', error);
          uni.hideLoading();
        uni.showToast({
          title: '创建发生异常',
          icon: 'none'
        });
      }
    },
    // 添加处理议程项目和文件上传的方法
    async processAgendaItems(reservationId) {
      // 如果没有议程项，直接返回
      if (!this.form.agenda || this.form.agenda.length === 0) {
        return;
      }
      
      // 处理所有议程项
      const subtopicPromises = [];
      
      for (const agendaItem of this.form.agenda) {
        // 跳过空的议程项
        if (!agendaItem.content || !agendaItem.content.trim()) {
          continue;
        }
        
        // 构建议程数据
        const subtopicData = {
          reservationId: reservationId,
          subtopics: agendaItem.content,
          description: agendaItem.time ? `时间: ${agendaItem.time}` : ''
        };
        
        if (agendaItem.speaker) {
          subtopicData.description += subtopicData.description ? 
            `, 负责人: ${agendaItem.speaker}` : 
            `负责人: ${agendaItem.speaker}`;
        }
        
        // 创建议程项
        const subtopicPromise = api.createSubtopic(subtopicData)
          .then(async (response) => {
            if (response.code === 200) {
              console.log('议程创建成功:', response);
              
              // 获取子议题ID
              const subtopicId = response.data;
              
              // 如果有文件，上传文件
              if (agendaItem.files && agendaItem.files.length > 0) {
                // 上传议程文件
                await this.uploadAgendaFiles(subtopicId, agendaItem.files);
              }
              
              return response;
            } else {
              console.error('议程创建失败:', response);
              throw new Error(response.msg || '议程创建失败');
            }
          });
        
        subtopicPromises.push(subtopicPromise);
      }
      
      // 等待所有议程创建和文件上传完成
      return Promise.all(subtopicPromises).catch(error => {
        console.error('处理议程时出错:', error);
        // 继续处理，不中断流程
      });
    },
    // 添加处理议程文件上传的方法
    async uploadAgendaFiles(subtopicId, files) {
      if (!files || files.length === 0) return;
      
      const fileUploadPromises = [];
      
      for (const file of files) {
        console.log('准备上传文件:', file);
        
        // 上传文件
        const uploadPromise = new Promise((resolve, reject) => {
          
          // 通用上传文件函数
          const uploadFileToServer = (tempFilePath, fileName) => {
            // 使用uni.uploadFile上传到服务器
            uni.uploadFile({
              url: '/file/upload', // 根据实际接口调整
              filePath: tempFilePath,
              name: 'file',
              formData: {
                'fileName': fileName
              },
              success: (uploadRes) => {
                try {
                  // 解析响应数据
                  const data = typeof uploadRes.data === 'string' ? JSON.parse(uploadRes.data) : uploadRes.data;
                  
                  if (data.code === 200 && data.data) {
                    const fileUrl = data.data;
                    
                    // 然后将文件关联到议题
                    api.uploadSubtopicFile(subtopicId, fileName, fileUrl)
                      .then(linkRes => {
                        console.log('议题文件关联成功:', linkRes);
                        resolve(linkRes);
                      })
                      .catch(err => {
                        console.error('议题文件关联失败:', err);
                        reject(err);
                      });
                  } else {
                    console.error('文件上传失败:', data);
                    reject(new Error(data.msg || '文件上传失败'));
                  }
                } catch (e) {
                  console.error('解析上传响应失败:', e, uploadRes);
                  reject(e);
                }
              },
              fail: (err) => {
                console.error('上传文件请求失败:', err);
                reject(err);
              }
            });
            return;
          }
          
          // H5环境或其他情况，使用API上传
          if (file.path) {
            // 移动端或小程序环境，使用uni.uploadFile上传
            uploadFileToServer(file.path, file.name);
          } else if (file.file) {
            // H5环境, 使用FormData上传
            const formData = new FormData();
            formData.append('file', file.file);
            formData.append('fileName', file.name);
            
            // 使用Axios或Fetch API上传
            uni.request({
              url: '/file/upload',
              method: 'POST',
              data: formData,
        success: (res) => {
                if (res.statusCode === 200 && res.data) {
                  const data = res.data;
                  if (data.code === 200 && data.data) {
                    const fileUrl = data.data;
                    
                    // 然后将文件关联到议题
                    api.uploadSubtopicFile(subtopicId, file.name, fileUrl)
                      .then(linkRes => {
                        console.log('议题文件关联成功:', linkRes);
                        resolve(linkRes);
                      })
                      .catch(err => {
                        console.error('议题文件关联失败:', err);
                        reject(err);
                      });
                  } else {
                    console.error('文件上传失败:', data);
                    reject(new Error(data.msg || '文件上传失败'));
                  }
                } else {
                  reject(new Error('上传失败: ' + res.statusCode));
                }
              },
              fail: (err) => {
                console.error('请求失败:', err);
                reject(err);
              }
            });
          } else {
            // 没有有效的文件
            console.warn('没有有效的文件:', file);
            resolve({
              code: 200,
              msg: '无文件内容',
              data: null
            });
          }
        });
        
        fileUploadPromises.push(uploadPromise);
      }
      
      // 等待所有文件上传完成
      return Promise.all(fileUploadPromises).catch(error => {
        console.error('上传议程文件时出错:', error);
        uni.showToast({
          title: '部分文件上传失败',
          icon: 'none'
        });
        // 继续处理，不中断流程
      });
    },
    // 添加议程项
    addAgendaItem() {
      this.form.agenda.push({
        time: '',
        content: '',
        speaker: '',
        files: []
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
    // 处理优先级变更
    handlePriorityChange(e) {
      this.priorityIndex = e.detail.value;
      this.form.priority = this.priorityOptions[this.priorityIndex];
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
    // 添加缺失的checkTimeConflicts方法
    checkTimeConflicts() {
      // 由于api.meeting.checkTimeConflict不存在，我们改为本地简单检查
      if (!this.form.date || !this.form.startTime || !this.form.endTime) {
        return;
      }
      
      // 由于无法远程检查冲突，这里实现一个简单的本地逻辑
      // 如果没有可用会议室，可能意味着时间冲突
      if (this.availableRooms && this.availableRooms.length === 0) {
        uni.showModal({
          title: '提示',
          content: '当前时间段可能已被预订，建议选择其他时间',
          showCancel: false
        });
      }
    },
    // 获取当前用户ID
    getCurrentUserId() {
      try {
        // 尝试从全局状态获取
        const app = getApp();
        if (app && app.globalData && app.globalData.userInfo) {
          const id = parseInt(app.globalData.userInfo.id);
          if (id > 0) return id;
        }
        
        // 尝试从存储获取
        const userInfo = uni.getStorageSync('userInfo');
        if (userInfo && userInfo.id) {
          const id = parseInt(userInfo.id);
          if (id > 0) return id;
        }
        
        // 从页面数据获取
        if (this.currentUser && this.currentUser.id) {
          const id = parseInt(this.currentUser.id);
          if (id > 0) return id;
        }
        
        console.warn('无法找到有效的当前用户ID');
        return 0;
      } catch (error) {
        console.error('获取当前用户ID出错:', error);
        return 0;
      }
    },
    // 获取用户信息
    getUserInfo() {
      try {
        // 尝试从全局状态获取
        const app = getApp();
        if (app && app.globalData && app.globalData.userInfo) {
          return app.globalData.userInfo;
        }
        
        // 尝试从存储获取
        const userInfo = uni.getStorageSync('userInfo');
        if (userInfo) {
          return userInfo;
        }
        
        // 从页面数据获取
        if (this.currentUser) {
          return this.currentUser;
        }
        
        console.warn('无法找到有效的用户信息');
        return null;
      } catch (error) {
        console.error('获取用户信息出错:', error);
        return null;
      }
    },
    // 添加新的方法: 选择议程文件
    selectAgendaFile(agendaIndex) {
      // #ifdef H5
      const inputEl = document.createElement('input');
      inputEl.type = 'file';
      inputEl.accept = '.pdf'; // 仅允许PDF文件
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
        
        // 检查文件类型
        if (!file.type.includes('pdf')) {
          uni.showToast({
            title: '只支持PDF文件',
            icon: 'none'
          });
          return;
        }
        
        // 添加到议程项的文件列表
        if (!this.form.agenda[agendaIndex].files) {
          this.form.agenda[agendaIndex].files = [];
        }
        
        this.form.agenda[agendaIndex].files.push({
          name: file.name,
          size: this.formatFileSize(file.size),
          type: 'pdf',
          file: file // 保存文件对象
        });
      };
      
      document.body.appendChild(inputEl);
      inputEl.click();
      document.body.removeChild(inputEl);
      // #endif
      
      // #ifdef APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
      // 使用plus.io.convertLocalFileSystemURL选择PDF文件
      // #ifdef APP-PLUS
      // 使用系统文件选择器，显示操作表
      plus.nativeUI.actionSheet({
        title: '选择PDF文件',
        cancel: '取消',
        buttons: [
          { title: '文件管理器' }
        ]
      }, (e) => {
        if (e.index === 1) { // 文件管理器
          // 调用系统文件选择器
          plus.io.pickDocument({
            success: (uri) => {
              console.log('文件选择成功:', uri);
              // 获取本地文件系统路径
              plus.io.resolveLocalFileSystemURL(uri, (entry) => {
                entry.file((file) => {
                  // 检查文件类型
                  let fileName = entry.name || '';
                  if (!fileName.toLowerCase().endsWith('.pdf')) {
                    uni.showToast({
                      title: '只支持PDF文件',
                      icon: 'none'
                    });
                    return;
                  }
                  
                  // 检查文件大小
                  if (file.size > 10 * 1024 * 1024) {
                    uni.showToast({
                      title: '文件大小不能超过10MB',
                      icon: 'none'
                    });
                    return;
                  }
                  
                  // 添加到议程项的文件列表
                  if (!this.form.agenda[agendaIndex].files) {
                    this.form.agenda[agendaIndex].files = [];
                  }
                  
                  // 构建文件对象
                  this.form.agenda[agendaIndex].files.push({
                    name: fileName,
                    size: this.formatFileSize(file.size || 0),
                    type: 'pdf',
                    file: file,
                    path: uri
                  });
                  
                  uni.showToast({
                    title: '文件已添加',
                    icon: 'success'
                  });
                }, (error) => {
                  console.error('获取文件对象失败:', error);
                  uni.showToast({
                    title: '获取文件信息失败',
                    icon: 'none'
                  });
                });
              }, (error) => {
                console.error('解析文件URL失败:', error);
                uni.showToast({
                  title: '选择文件失败',
                  icon: 'none'
                });
              });
            },
            error: (error) => {
              console.error('选择文件失败:', error);
              uni.showToast({
                title: '选择文件失败',
                icon: 'none'
              });
            }
          });
        }
      });
      // #endif
      
      // 在微信小程序中可以使用文档选择器（如果有）
      // #ifdef MP-WEIXIN
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['pdf'],
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
          
          // 添加到议程项的文件列表
          if (!this.form.agenda[agendaIndex].files) {
            this.form.agenda[agendaIndex].files = [];
          }
          
          // 检查文件名是否以.pdf结尾
          if (!file.name.toLowerCase().endsWith('.pdf')) {
            uni.showToast({
              title: '只支持PDF文件',
              icon: 'none'
            });
            return;
          }
          
          this.form.agenda[agendaIndex].files.push({
            name: file.name,
            size: this.formatFileSize(file.size || 0),
            type: 'pdf',
            path: file.path
          });
          
          uni.showToast({
            title: '文件已添加',
            icon: 'success'
          });
        }
      });
      // #endif
      
      // 其他小程序环境，暂时只能上传图片，然后在后端转PDF
      // #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
      uni.showModal({
        title: '提示',
        content: '当前环境暂不支持PDF文件上传，请使用H5或APP进行操作',
        showCancel: false
      });
      // #endif
      // #endif
    },
    // 添加新的方法: 移除议程文件
    removeAgendaFile(agendaIndex, fileIndex) {
      this.form.agenda[agendaIndex].files.splice(fileIndex, 1);
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
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.breadcrumb-item:active {
  background-color: #f0f0f0;
}

.breadcrumb-item:last-child {
  color: #333;
  font-weight: 500;
  cursor: default;
}

.breadcrumb-item:last-child:active {
  background-color: transparent;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #ccc;
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

/* 议程文件相关样式 */
.agenda-files {
  margin-top: 10px;
  padding: 5px 0;
}

.files-list {
  margin-bottom: 10px;
}

.file-item {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 8px;
  position: relative;
}

.file-name {
  flex: 1;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
}

.file-size {
  font-size: 12px;
  color: #999;
  margin-right: 15px;
}

.file-item .delete-btn {
  font-size: 16px;
  color: #ff4d4f;
  padding: 0 8px;
}

.add-file-btn {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f0f8ff;
  border-radius: 4px;
  cursor: pointer;
}

.add-file-btn:active {
  background-color: #e6f2ff;
}

.add-file-btn .add-icon {
  margin-right: 5px;
  font-size: 16px;
  color: #1890ff;
}

.add-file-btn text {
  font-size: 14px;
  color: #1890ff;
}
</style> 