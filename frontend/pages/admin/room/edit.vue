<template>
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
</template>

<script>
export default {
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
      // 这里应该从API获取会议室详情
      uni.showLoading({
        title: '加载中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 模拟获取数据
        // 实际项目中应该调用API获取数据
        if (this.roomId === '1') {
          this.roomForm = {
            name: '会议室A',
            capacity: '20',
            location: '3楼东侧',
            equipment: ['projector', 'whiteboard'],
            status: 'available',
            description: '大型会议室，适合项目启动、培训等活动'
          };
        } else if (this.roomId === '2') {
          this.roomForm = {
            name: '会议室B',
            capacity: '12',
            location: '3楼西侧',
            equipment: ['projector', 'video'],
            status: 'available',
            description: '中型会议室，设有视频会议系统'
          };
        } else if (this.roomId === '3') {
          this.roomForm = {
            name: '会议室C',
            capacity: '8',
            location: '4楼北侧',
            equipment: ['eboard'],
            status: 'maintenance',
            description: '小型会议室，适合小组讨论'
          };
        }
      }, 500);
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
      
      // 保存会议室信息
      uni.showLoading({
        title: '保存中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 实际项目中应该调用API保存数据
        uni.showToast({
          title: this.isEdit ? '编辑成功' : '添加成功',
          icon: 'success',
          success: () => {
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        });
      }, 800);
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