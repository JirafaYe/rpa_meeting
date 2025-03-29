<template>
  <view class="contact-selector-container">
    <view class="search-bar">
      <input 
        class="search-input" 
        type="text" 
        v-model="searchText" 
        placeholder="搜索联系人..." 
        @input="handleSearch" 
      />
      <view class="search-icon">
        <text class="iconfont icon-search"></text>
      </view>
    </view>
    
    <view class="contact-list">
      <view class="contact-group" v-for="(group, index) in filteredContacts" :key="index">
        <view class="group-title">{{ group.title }}</view>
        <checkbox-group @change="handleGroupChange">
          <view 
            class="contact-item" 
            v-for="contact in group.items" 
            :key="contact.id"
          >
            <view class="contact-info">
              <view class="contact-avatar">
                <image :src="contact.avatar || '/static/default-avatar.png'" mode="aspectFill" />
              </view>
              <view class="contact-details">
                <view class="contact-name">{{ contact.name }}</view>
                <view class="contact-meta">{{ contact.department }}</view>
              </view>
            </view>
            <checkbox :value="contact.id" :checked="isSelected(contact.id)" />
          </view>
        </checkbox-group>
      </view>
      
      <view class="empty-notice" v-if="filteredContacts.length === 0">
        <text>没有找到匹配的联系人</text>
      </view>
    </view>
    
    <view class="selected-bar" v-if="selectedContacts.length > 0">
      <view class="selected-count">已选择 {{ selectedContacts.length }} 人</view>
      <view class="selected-contacts-scroll">
        <scroll-view scroll-x>
          <view class="selected-contacts">
            <view 
              class="selected-contact" 
              v-for="contact in selectedContacts" 
              :key="contact.id"
            >
              <image :src="contact.avatar || '/static/default-avatar.png'" mode="aspectFill" />
              <view class="contact-name">{{ contact.name }}</view>
              <view class="remove-btn" @click="removeContact(contact.id)">×</view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    
    <view class="action-bar">
      <button class="cancel-btn" @click="handleCancel">取消</button>
      <button class="confirm-btn" @click="handleConfirm">确定</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      contacts: [],
      selectedContacts: [],
      filteredContacts: []
    };
  },
  onLoad(options) {
    // 初始化数据
    this.initContacts();
    this.filterContacts();
    
    // 获取页面通信通道
    const eventChannel = this.getOpenerEventChannel();
    
    // 如果有回调事件，保存到this中
    if (eventChannel) {
      this.eventChannel = eventChannel;
      
      // 预先选择的联系人
      eventChannel.on('selectedContacts', (data) => {
        if (Array.isArray(data)) {
          this.selectedContacts = [...data];
        }
      });
    }
  },
  methods: {
    // 初始化联系人数据
    initContacts() {
      // 模拟联系人数据
      const departments = [
        { id: '1', name: '技术部' },
        { id: '2', name: '产品部' },
        { id: '3', name: '市场部' },
        { id: '4', name: '运营部' },
        { id: '5', name: '人事部' }
      ];
      
      const contactsData = [
        { id: '1001', name: '张三', department: '技术部', avatar: '/static/avatar1.png' },
        { id: '1002', name: '李四', department: '技术部', avatar: '/static/avatar2.png' },
        { id: '1003', name: '王五', department: '技术部', avatar: '/static/avatar3.png' },
        { id: '1004', name: '赵六', department: '产品部', avatar: '/static/avatar4.png' },
        { id: '1005', name: '钱七', department: '产品部', avatar: '/static/avatar5.png' },
        { id: '1006', name: '孙八', department: '市场部', avatar: '/static/avatar6.png' },
        { id: '1007', name: '周九', department: '市场部', avatar: '/static/avatar7.png' },
        { id: '1008', name: '吴十', department: '运营部', avatar: '/static/avatar8.png' },
        { id: '1009', name: '郑十一', department: '运营部', avatar: '/static/avatar9.png' },
        { id: '1010', name: '王十二', department: '人事部', avatar: '/static/avatar10.png' }
      ];
      
      // 分组联系人
      this.contacts = departments.map(dept => {
        return {
          title: dept.name,
          items: contactsData.filter(contact => contact.department === dept.name)
        };
      });
    },
    
    // 过滤联系人
    filterContacts() {
      if (!this.searchText) {
        this.filteredContacts = [...this.contacts];
        return;
      }
      
      const searchText = this.searchText.toLowerCase();
      this.filteredContacts = this.contacts.map(group => {
        const items = group.items.filter(contact => {
          return contact.name.toLowerCase().includes(searchText) || 
                 contact.department.toLowerCase().includes(searchText);
        });
        
        return {
          title: group.title,
          items
        };
      }).filter(group => group.items.length > 0);
    },
    
    // 处理搜索
    handleSearch() {
      this.filterContacts();
    },
    
    // 处理选择变更
    handleGroupChange(e) {
      const selectedIds = e.detail.value;
      
      // 查找被选中的联系人
      this.contacts.forEach(group => {
        group.items.forEach(contact => {
          const isInSelection = selectedIds.includes(contact.id);
          const isAlreadySelected = this.isSelected(contact.id);
          
          if (isInSelection && !isAlreadySelected) {
            // 新选择的联系人
            this.selectedContacts.push(contact);
          } else if (!isInSelection && isAlreadySelected) {
            // 取消选择的联系人
            this.removeContact(contact.id);
          }
        });
      });
    },
    
    // 检查联系人是否已经被选择
    isSelected(contactId) {
      return this.selectedContacts.some(contact => contact.id === contactId);
    },
    
    // 移除联系人
    removeContact(contactId) {
      const index = this.selectedContacts.findIndex(contact => contact.id === contactId);
      if (index !== -1) {
        this.selectedContacts.splice(index, 1);
      }
    },
    
    // 处理取消按钮
    handleCancel() {
      uni.navigateBack();
    },
    
    // 处理确定按钮
    handleConfirm() {
      // 如果有事件通道，发送选中的联系人
      if (this.eventChannel) {
        this.eventChannel.emit('selectedContacts', this.selectedContacts);
      }
      
      uni.navigateBack();
    }
  }
};
</script>

<style>
.contact-selector-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.search-bar {
  padding: 10px 15px;
  background-color: #ffffff;
  position: relative;
  border-bottom: 1px solid #eee;
}

.search-input {
  height: 40px;
  border-radius: 20px;
  background-color: #f0f0f0;
  padding: 0 40px 0 15px;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  right: 25px;
  top: 20px;
  color: #999;
}

.contact-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 120px;
}

.contact-group {
  margin-bottom: 10px;
}

.group-title {
  padding: 10px 15px;
  background-color: #f5f7fa;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
}

.contact-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.contact-avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.contact-avatar image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.contact-details {
  flex: 1;
}

.contact-name {
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
}

.contact-meta {
  font-size: 12px;
  color: #999;
}

.selected-bar {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 10px 15px;
  border-top: 1px solid #eee;
  z-index: 10;
}

.selected-count {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.selected-contacts-scroll {
  height: 60px;
}

.selected-contacts {
  display: flex;
  padding: 5px 0;
}

.selected-contact {
  position: relative;
  width: 50px;
  margin-right: 10px;
  text-align: center;
}

.selected-contact image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 4px;
}

.selected-contact .contact-name {
  font-size: 10px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50px;
}

.remove-btn {
  position: absolute;
  top: -5px;
  right: 5px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  background-color: #ff4d4f;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 50px;
  background-color: #ffffff;
  border-top: 1px solid #eee;
  z-index: 11;
}

.action-bar button {
  flex: 1;
  height: 100%;
  border-radius: 0;
  margin: 0;
  border: none;
  font-size: 16px;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.confirm-btn {
  background-color: #2979ff;
  color: #ffffff;
}

.empty-notice {
  text-align: center;
  padding: 30px 0;
  color: #999;
}
</style> 