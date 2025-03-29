<template>
  <view class="user-edit-container">
    <view class="edit-card">
      <view class="card-header">
        <text class="header-title">{{isEdit ? '编辑用户' : '添加用户'}}</text>
      </view>
      <view class="card-body">
        <view class="form-group">
          <text class="form-label">姓名</text>
          <input class="form-input" type="text" v-model="userForm.name" placeholder="请输入姓名" />
        </view>
        
        <view class="form-group">
          <text class="form-label">用户名</text>
          <input class="form-input" type="text" v-model="userForm.username" placeholder="请输入用户名" :disabled="isEdit" />
          <text class="form-tips" v-if="isEdit">用户名不可修改</text>
        </view>
        
        <view class="form-group" v-if="!isEdit">
          <text class="form-label">密码</text>
          <input class="form-input" type="password" v-model="userForm.password" placeholder="请输入密码" password />
        </view>
        
        <view class="form-group" v-if="!isEdit">
          <text class="form-label">确认密码</text>
          <input class="form-input" type="password" v-model="userForm.confirmPassword" placeholder="请再次输入密码" password />
        </view>
        
        <view class="form-group">
          <text class="form-label">手机号码</text>
          <input class="form-input" type="number" v-model="userForm.phone" placeholder="请输入手机号码" maxlength="11" />
        </view>
        
        <view class="form-group">
          <text class="form-label">邮箱</text>
          <input class="form-input" type="text" v-model="userForm.email" placeholder="请输入邮箱地址" />
        </view>
        
        <view class="form-group">
          <text class="form-label">部门</text>
          <picker @change="departmentChange" :value="departmentIndex" :range="departmentOptions" range-key="label" class="form-picker">
            <view class="picker-value">
              {{departmentOptions[departmentIndex].label}}
            </view>
          </picker>
        </view>
        
        <view class="form-group">
          <text class="form-label">角色</text>
          <picker @change="roleChange" :value="roleIndex" :range="roleOptions" range-key="label" class="form-picker">
            <view class="picker-value">
              {{roleOptions[roleIndex].label}}
            </view>
          </picker>
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
          <text class="form-label">备注</text>
          <textarea class="form-textarea" v-model="userForm.remark" placeholder="请输入备注信息"></textarea>
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
      userId: null,
      userForm: {
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        email: '',
        department: 'dev',
        role: 'user',
        status: 'active',
        remark: ''
      },
      departmentOptions: [
        { label: '研发部', value: 'dev' },
        { label: '产品部', value: 'product' },
        { label: '设计部', value: 'design' },
        { label: '测试部', value: 'qa' },
        { label: '市场部', value: 'market' },
        { label: '人事部', value: 'hr' }
      ],
      roleOptions: [
        { label: '普通用户', value: 'user' },
        { label: '部门管理员', value: 'dept_admin' },
        { label: '系统管理员', value: 'sys_admin' }
      ],
      statusOptions: [
        { label: '正常', value: 'active' },
        { label: '禁用', value: 'disabled' }
      ]
    }
  },
  computed: {
    departmentIndex() {
      return this.departmentOptions.findIndex(item => item.value === this.userForm.department);
    },
    roleIndex() {
      return this.roleOptions.findIndex(item => item.value === this.userForm.role);
    },
    statusIndex() {
      return this.statusOptions.findIndex(item => item.value === this.userForm.status);
    }
  },
  onLoad(options) {
    if (options.id) {
      this.isEdit = true;
      this.userId = options.id;
      this.fetchUserDetail();
    }
  },
  methods: {
    fetchUserDetail() {
      // 这里应该从API获取用户详情
      uni.showLoading({
        title: '加载中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 模拟获取数据
        // 实际项目中应该调用API获取数据
        const userMap = {
          '1': {
            name: '张三',
            username: 'zhangsan',
            phone: '13800138001',
            email: 'zhangsan@example.com',
            department: 'dev',
            role: 'dept_admin',
            status: 'active',
            remark: '研发部门管理员'
          },
          '2': {
            name: '李四',
            username: 'lisi',
            phone: '13800138002',
            email: 'lisi@example.com',
            department: 'dev',
            role: 'user',
            status: 'active',
            remark: '前端开发工程师'
          },
          '3': {
            name: '王五',
            username: 'wangwu',
            phone: '13800138003',
            email: 'wangwu@example.com',
            department: 'product',
            role: 'dept_admin',
            status: 'active',
            remark: '产品部门管理员'
          },
          '4': {
            name: '赵六',
            username: 'zhaoliu',
            phone: '13800138004',
            email: 'zhaoliu@example.com',
            department: 'design',
            role: 'dept_admin',
            status: 'active',
            remark: '设计部门管理员'
          },
          '5': {
            name: '钱七',
            username: 'qianqi',
            phone: '13800138005',
            email: 'qianqi@example.com',
            department: 'qa',
            role: 'user',
            status: 'disabled',
            remark: '测试工程师'
          }
        };
        
        if (userMap[this.userId]) {
          this.userForm = { ...userMap[this.userId] };
        } else {
          uni.showToast({
            title: '用户不存在',
            icon: 'none'
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      }, 500);
    },
    departmentChange(e) {
      const index = e.detail.value;
      this.userForm.department = this.departmentOptions[index].value;
    },
    roleChange(e) {
      const index = e.detail.value;
      this.userForm.role = this.roleOptions[index].value;
    },
    statusChange(e) {
      const index = e.detail.value;
      this.userForm.status = this.statusOptions[index].value;
    },
    validateForm() {
      if (!this.userForm.name) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.userForm.username) {
        uni.showToast({
          title: '请输入用户名',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.isEdit) {
        if (!this.userForm.password) {
          uni.showToast({
            title: '请输入密码',
            icon: 'none'
          });
          return false;
        }
        
        if (this.userForm.password !== this.userForm.confirmPassword) {
          uni.showToast({
            title: '两次密码输入不一致',
            icon: 'none'
          });
          return false;
        }
      }
      
      if (this.userForm.phone && !/^1\d{10}$/.test(this.userForm.phone)) {
        uni.showToast({
          title: '手机号码格式不正确',
          icon: 'none'
        });
        return false;
      }
      
      if (this.userForm.email && !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(this.userForm.email)) {
        uni.showToast({
          title: '邮箱格式不正确',
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
      
      // 保存用户信息
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
.user-edit-container {
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

.form-input:disabled {
  background-color: #f0f0f0;
  color: #999;
}

.form-tips {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
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