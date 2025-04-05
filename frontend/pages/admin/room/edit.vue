<template>
  <admin-layout 
    :title="isEdit ? '编辑会议室' : '添加会议室'" 
    active-path="/pages/admin/room/list"
    parent-path="/pages/admin/room/list"
    parent-title="会议室管理">
    <view class="room-edit-container">
      <view class="edit-card">
        <view class="card-header">
          <text class="header-title">{{isEdit ? '编辑会议室' : '添加会议室'}}</text>
        </view>
        <view class="card-body">
          <view class="form-group">
            <text class="form-label">会议室名称</text>
            <input class="form-input" type="text" v-model="roomForm.name" placeholder="请输入会议室名称" />
          </view>
          
          <view class="form-group">
            <text class="form-label">容量（人数）</text>
            <input class="form-input" type="number" v-model="roomForm.capacity" placeholder="请输入会议室容量" />
          </view>
          
          <view class="form-group">
            <text class="form-label">位置</text>
            <input class="form-input" type="text" v-model="roomForm.location" placeholder="请输入会议室位置" />
          </view>
          
          <view class="form-group">
            <text class="form-label">设备</text>
            <view class="checkbox-group">
              <view class="checkbox-item" v-for="(item, index) in equipmentOptions" :key="index">
                <checkbox :checked="roomForm.equipment.includes(item.value)" @click="toggleEquipment(item.value)" />
                <text class="checkbox-label">{{item.label}}</text>
              </view>
            </view>
          </view>
          
          <view class="form-group">
            <text class="form-label">状态</text>
            <picker @change="statusChange" :value="statusIndex" :range="statusOptions" range-key="label" class="form-picker">
              <view class="picker-value">
                {{statusOptions[statusIndex].label}}
              </view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">描述</text>
            <textarea class="form-textarea" v-model="roomForm.description" placeholder="请输入会议室描述信息"></textarea>
          </view>
          
          <view class="form-actions">
            <button class="btn-save" @click="handleSave">保存</button>
            <button class="btn-cancel" @click="handleCancel">取消</button>
          </view>
        </view>
      </view>
    </view>
  </admin-layout>
</template>

<script>
import AdminLayout from '../../../components/admin/AdminLayout.vue'
import api from '../../../api/index.js'

export default {
  components: {
    'admin-layout': AdminLayout
  },
  data() {
    return {
      isEdit: false,
      roomId: null,
      roomForm: {
        name: '',
        capacity: '',
        location: '',
        equipment: [],
        status: 'available',
        description: ''
      },
      equipmentOptions: [
        { label: '投影仪', value: 'projector' },
        { label: '白板', value: 'whiteboard' },
        { label: '视频会议系统', value: 'video' },
        { label: '电子白板', value: 'eboard' },
        { label: 'HDMI接口', value: 'hdmi' }
      ],
      statusOptions: [
        { label: '可用', value: 'available' },
        { label: '维护中', value: 'maintenance' },
        { label: '不可用', value: 'unavailable' }
      ]
    }
  },
  computed: {
    statusIndex() {
      return this.statusOptions.findIndex(item => item.value === this.roomForm.status);
    }
  },
  onLoad(options) {
    if (options.id) {
      this.isEdit = true;
      this.roomId = options.id;
      this.fetchRoomDetail();
    }
  },
  methods: {
    fetchRoomDetail() {
      // 从API获取会议室详情
      uni.showLoading({
        title: '加载中...'
      });
      
      // 调用API获取会议室详情
      api.room.getRoomDetail(this.roomId)
        .then(res => {
          if (res && res.code === 200 && res.data) {
            // 格式化数据
            const room = res.data;
            this.roomForm = {
              name: room.name || '',
              capacity: room.capacity ? room.capacity.toString() : '',
              location: room.location || '',
              equipment: this.parseEquipment(room.equipment || ''),
              status: room.status || 'available',
              description: room.description || ''
            };
            console.log('获取到的会议室详情:', this.roomForm);
          } else {
            uni.showToast({
              title: res?.message || '获取会议室信息失败',
              icon: 'none'
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        })
        .catch(err => {
          console.error('获取会议室详情失败:', err);
          uni.showToast({
            title: '获取会议室信息失败',
            icon: 'none'
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    
    // 解析设备字符串为数组
    parseEquipment(equipmentStr) {
      if (!equipmentStr) return [];
      
      // 如果已经是数组，直接返回
      if (Array.isArray(equipmentStr)) return equipmentStr;
      
      // 字符串格式，按逗号分隔
      return equipmentStr.split(',').map(item => item.trim()).filter(Boolean);
    },
    
    // 将设备数组格式化为字符串
    formatEquipment() {
      return this.roomForm.equipment.join(', ');
    },
    toggleEquipment(value) {
      const index = this.roomForm.equipment.indexOf(value);
      if (index === -1) {
        this.roomForm.equipment.push(value);
      } else {
        this.roomForm.equipment.splice(index, 1);
      }
    },
    statusChange(e) {
      const index = e.detail.value;
      this.roomForm.status = this.statusOptions[index].value;
    },
    validateForm() {
      if (!this.roomForm.name) {
        uni.showToast({
          title: '请输入会议室名称',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.roomForm.capacity) {
        uni.showToast({
          title: '请输入会议室容量',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.roomForm.location) {
        uni.showToast({
          title: '请输入会议室位置',
          icon: 'none'
        });
        return false;
      }
      
      return true;
    },
    handleSave() {
      if (!this.validateForm()) {
        return;
      }
      
      // 准备提交的数据
      const roomData = {
        name: this.roomForm.name,
        capacity: parseInt(this.roomForm.capacity),
        location: this.roomForm.location,
        equipment: this.formatEquipment(),
        status: this.roomForm.status,
        description: this.roomForm.description
      };
      
      // 如果是编辑模式，添加ID
      if (this.isEdit) {
        roomData.id = this.roomId;
      }
      
      // 保存会议室信息
      uni.showLoading({
        title: '保存中...'
      });
      
      // 根据是新增还是编辑，调用不同的API
      const apiCall = this.isEdit 
        ? api.room.updateRoom(roomData) 
        : api.room.createRoom(roomData);
        
      apiCall
        .then(res => {
          if (res && res.code === 200) {
            uni.showToast({
              title: this.isEdit ? '编辑成功' : '添加成功',
              icon: 'success',
              success: () => {
                setTimeout(() => {
                  uni.navigateBack();
                }, 1500);
              }
            });
          } else {
            uni.showToast({
              title: res?.message || '保存失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('保存会议室失败:', err);
          uni.showToast({
            title: '保存失败，请稍后重试',
            icon: 'none'
          });
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    handleCancel() {
      uni.navigateBack();
    }
  }
}
</script>

<style>
.room-edit-container {
  padding: 15px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.edit-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #3498db;
  padding: 15px;
}

.header-title {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.card-body {
  padding: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
  color: #333;
  font-weight: bold;
}

.form-input, .form-picker {
  width: 100%;
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 15px;
  background-color: #f9f9f9;
}

.form-textarea {
  width: 100%;
  height: 100px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 15px;
  background-color: #f9f9f9;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-right: 15px;
  margin-bottom: 10px;
}

.checkbox-label {
  margin-left: 5px;
  font-size: 15px;
}

.picker-value {
  height: 44px;
  display: flex;
  align-items: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-save, .btn-cancel {
  padding: 0 20px;
  height: 44px;
  border-radius: 4px;
  margin-left: 10px;
  color: #fff;
}

.btn-save {
  background-color: #3498db;
}

.btn-cancel {
  background-color: #95a5a6;
}
</style> 