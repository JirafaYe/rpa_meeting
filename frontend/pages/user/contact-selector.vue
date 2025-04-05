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
      <checkbox-group @change="handleGroupChange">
        <view 
          class="contact-item" 
          v-for="contact in filteredContacts" 
          :key="contact.id"
        >
          <view class="contact-info">
            <view class="contact-avatar">
              <image :src="contact.avatar || '/static/default-avatar.png'" mode="aspectFill" />
            </view>
            <view class="contact-details">
              <view class="contact-name">{{ contact.name }}</view>
            </view>
          </view>
          <checkbox :value="contact.id" :checked="isSelected(contact.id)" />
        </view>
      </checkbox-group>
      
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
import api from '@/api/index'

export default {
  data() {
    return {
      searchText: '',
      contacts: [],
      selectedContacts: [],
      filteredContacts: [],
      isLoading: false,
      preSelectedIds: [],
      currentUserId: null
    };
  },
  onLoad(options) {
    try {
      console.log('联系人选择器页面加载');
      
      // 使用事件通道获取参数
      const eventChannel = this.getOpenerEventChannel();
      if (eventChannel) {
        eventChannel.on('initParams', (data) => {
          console.log('通过事件通道收到参数:', data);
          
          if (data) {
            // 处理预选的联系人 ID
            if (data.preSelectedIds && Array.isArray(data.preSelectedIds)) {
              this.preSelectedIds = data.preSelectedIds.map(id => parseInt(id));
              console.log('通过事件通道设置预选联系人:', this.preSelectedIds);
            }
            
            // 处理当前用户 ID
            if (data.currentUserId) {
              this.currentUserId = parseInt(data.currentUserId);
              console.log('通过事件通道设置当前用户:', this.currentUserId);
            }
          }
          
          // 参数处理完成后加载联系人数据
          this.loadContacts();
        });
        
        console.log('已注册事件监听器');
      } else {
        console.warn('无法获取事件通道，尝试从URL参数获取');
        this.processUrlParams(options);
      }
      
      // 如果没有通过事件通道收到参数，则直接加载联系人
      setTimeout(() => {
        if (!this.processedParams) {
          console.log('未通过事件通道收到参数，从URL或当前状态加载');
          this.processUrlParams(options);
          this.loadContacts();
        }
      }, 500); // 给事件通道一点时间
    } catch (error) {
      console.error('联系人选择器初始化失败:', error);
      // 出错时仍然尝试加载联系人
      this.loadContacts();
    }
  },
  methods: {
    // 加载联系人数据
    loadContacts() {
      this.isLoading = true;
      uni.showLoading({ title: '加载联系人...' });

      // 先清空联系人和选中状态
      this.contacts = [];
      this.selectedContacts = [];
      this.filteredContacts = [];

      // 获取用户列表
      api.user.getUserList({
        pageNo: 1,
        pageSize: 100,  // 获取较大的数量以确保获取所有用户
        isAsc: true,
        sortBy: 'id'
      })
        .then(res => {
          if (res.code === 200 && res.data && res.data.list) {
            // 转换用户数据为联系人格式
            this.contacts = res.data.list.map(user => ({
              id: parseInt(user.id),
              name: user.name || user.username,
              avatar: user.avatar || user.avatarUrl || '/static/default-avatar.png'
            }));

            console.log('获取到的所有联系人:', this.contacts.length);
            
            // 过滤联系人
            this.filterContacts();
            
            // 处理预选联系人逻辑
            this.initPreSelectedContacts();
          } else {
            uni.showToast({
              title: res.message || '获取联系人失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取联系人失败:', err);
          uni.showToast({
            title: '获取联系人失败',
            icon: 'none'
          });
        })
        .finally(() => {
          uni.hideLoading();
          this.isLoading = false;
        });
    },
    
    // 初始化预选联系人
    initPreSelectedContacts() {
      console.log('初始化预选联系人...');
      console.log('预选ID列表:', this.preSelectedIds);
      console.log('当前用户ID:', this.currentUserId);
      
      if (this.contacts.length === 0) {
        console.warn('联系人列表为空，无法初始化预选联系人');
        return;
      }
      
      // 初始化选中的联系人数组
      this.selectedContacts = [];
      
      // 确保当前用户始终被选中
      if (this.currentUserId) {
        const currentUser = this.contacts.find(contact => 
          parseInt(contact.id) === parseInt(this.currentUserId)
        );
        
        if (currentUser) {
          this.selectedContacts.push(currentUser);
          console.log('已添加当前用户到选中列表:', currentUser);
        } else {
          console.warn('在联系人列表中未找到当前用户:', this.currentUserId);
        }
      }
      
      // 添加预选联系人
      if (this.preSelectedIds && this.preSelectedIds.length > 0) {
        // 过滤出预选联系人，但排除已经添加的当前用户
        const preselected = this.contacts.filter(contact => {
          const contactId = parseInt(contact.id);
          const isPreselected = this.preSelectedIds.includes(contactId);
          const isCurrentUser = this.currentUserId && contactId === parseInt(this.currentUserId);
          
          // 只添加预选且不是当前用户的联系人(避免重复)
          return isPreselected && !isCurrentUser;
        });
        
        if (preselected.length > 0) {
          // 添加预选联系人，但避免重复
          preselected.forEach(contact => {
            if (!this.isSelected(contact.id)) {
              this.selectedContacts.push(contact);
            }
          });
          
          console.log('预选联系人完成, 总选中数量:', this.selectedContacts.length);
        }
      }
      
      this.filterContacts(); // 刷新过滤后的联系人列表
    },
    
    // 过滤联系人
    filterContacts() {
      if (!this.searchText) {
        this.filteredContacts = [...this.contacts];
        return;
      }
      
      const searchText = this.searchText.toLowerCase();
      this.filteredContacts = this.contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchText)
      );
    },
    
    // 处理搜索
    handleSearch() {
      this.filterContacts();
    },
    
    // 处理选择变更
    handleGroupChange(e) {
      const selectedIds = e.detail.value.map(id => parseInt(id));
      
      // 查找被选中的联系人
      this.contacts.forEach(contact => {
        const contactId = parseInt(contact.id);
        const isInSelection = selectedIds.includes(contactId);
        const isAlreadySelected = this.isSelected(contactId);
        
        if (isInSelection && !isAlreadySelected) {
          // 新选择的联系人
          this.selectedContacts.push(contact);
        } else if (!isInSelection && isAlreadySelected) {
          // 取消选择的联系人，但不能取消选择当前用户
          if (contactId !== this.currentUserId) {
            this.removeContact(contactId);
          } else {
            // 反选回来 - 这需要通过其他方式处理，因为checkboxGroup已经更新了
            console.log('尝试取消选择当前用户，将阻止此操作');
            // 由于无法直接修改checkboxGroup的选中状态，在下次渲染时它会自动反映正确的状态
          }
        }
      });
    },
    
    // 检查联系人是否已经被选择
    isSelected(contactId) {
      return this.selectedContacts.some(contact => contact.id === contactId);
    },
    
    // 移除联系人
    removeContact(contactId) {
      // 检查是否是当前用户
      if (parseInt(contactId) === this.currentUserId) {
        uni.showToast({
          title: '无法取消选择自己',
          icon: 'none'
        });
        return;
      }
      
      // 移除其他联系人
      const index = this.selectedContacts.findIndex(contact => contact.id === contactId);
      if (index !== -1) {
        this.selectedContacts.splice(index, 1);
      }
    },
    
    // 处理取消按钮
    handleCancel() {
      uni.navigateBack();
    },
    
    // 处理确认按钮
    handleConfirm() {
      console.log('确认选择，当前选中联系人数:', this.selectedContacts.length);
      
      // 准备要返回的联系人ID列表
      const selectedContactIds = this.selectedContacts.map(contact => parseInt(contact.id));
      console.log('返回的选中联系人ID列表:', selectedContactIds);
      
      // 确保当前用户ID在内
      if (this.currentUserId && !selectedContactIds.includes(parseInt(this.currentUserId))) {
        console.warn('当前用户未在选择列表中，尝试添加');
        
        const currentUser = this.contacts.find(contact => 
          parseInt(contact.id) === parseInt(this.currentUserId)
        );
        
        if (currentUser) {
          this.selectedContacts.push(currentUser);
          selectedContactIds.push(parseInt(this.currentUserId));
          console.log('已确保当前用户在返回列表中:', this.currentUserId);
        }
      }
      
      try {
        // 返回上一页并传递选中的联系人
        uni.navigateBack({
          delta: 1,
          success: () => {
            // 向前一页发送事件，传递选中的联系人
            const eventChannel = this.getOpenerEventChannel();
            if (eventChannel) {
              console.log('传递选中联系人到前一页:', this.selectedContacts);
              
              // 传递两种数据格式保证兼容性
              eventChannel.emit('updateSelectedAttendees', {
                selectedIds: selectedContactIds,
                selectedContacts: this.selectedContacts
              });
            } else {
              console.error('无法获取事件通道');
            }
          },
          fail: (err) => {
            console.error('返回上一页失败:', err);
            uni.showToast({
              title: '返回失败',
              icon: 'none'
            });
          }
        });
      } catch (error) {
        console.error('确认选择时出错:', error);
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    },
    // 处理URL参数
    processUrlParams(options) {
      console.log('处理URL参数:', options);
      this.processedParams = true;
      
      try {
        // 处理 URL 中的预选联系人参数
        if (options.selected) {
          try {
            const selected = JSON.parse(decodeURIComponent(options.selected));
            if (Array.isArray(selected)) {
              this.preSelectedIds = selected.map(id => parseInt(id));
              console.log('从URL参数设置预选联系人:', this.preSelectedIds);
            }
          } catch (e) {
            console.error('解析预选联系人参数失败:', e);
          }
        }
        
        // 处理当前用户ID参数
        if (options.currentUserId) {
          this.currentUserId = parseInt(options.currentUserId);
          console.log('从URL参数设置当前用户ID:', this.currentUserId);
        }
        
        // 如果都没有设置，尝试从存储获取当前用户ID
        if (!this.currentUserId) {
          const userInfo = uni.getStorageSync('userInfo');
          if (userInfo && userInfo.id) {
            this.currentUserId = parseInt(userInfo.id);
            console.log('从存储设置当前用户ID:', this.currentUserId);
          }
        }
      } catch (error) {
        console.error('处理URL参数失败:', error);
      }
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