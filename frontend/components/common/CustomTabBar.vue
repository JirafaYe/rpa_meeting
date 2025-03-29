<template>
  <view class="custom-tab-bar">
    <view 
      class="tab-item" 
      :class="{ active: currentTab === 'schedule' }"
      @click="switchTab('schedule')"
    >
      <text class="emoji-icon">📅</text>
      <text class="tab-text">日程</text>
    </view>
    <view 
      class="tab-item" 
      :class="{ active: currentTab === 'meeting' }"
      @click="switchTab('meeting')"
    >
      <text class="emoji-icon">🏢</text>
      <text class="tab-text">会议</text>
    </view>
    <view 
      class="tab-item" 
      :class="{ active: currentTab === 'notification' }"
      @click="switchTab('notification')"
    >
      <text class="emoji-icon">🔔</text>
      <text class="tab-text">通知</text>
    </view>
    <view 
      class="tab-item" 
      :class="{ active: currentTab === 'profile' }"
      @click="switchTab('profile')"
    >
      <text class="emoji-icon">👤</text>
      <text class="tab-text">我的</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomTabBar',
  data() {
    return {
      currentTab: 'schedule'
    }
  },
  created() {
    // 根据当前页面路径设置当前标签
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const route = currentPage.route || currentPage.$page.route;
    
    if (route.includes('/user/schedule')) {
      this.currentTab = 'schedule';
    } else if (route.includes('/user/meeting/list')) {
      this.currentTab = 'meeting';
    } else if (route.includes('/user/notification')) {
      this.currentTab = 'notification';
    } else if (route.includes('/user/profile')) {
      this.currentTab = 'profile';
    }
  },
  methods: {
    switchTab(tab) {
      if (this.currentTab === tab) return;
      
      this.currentTab = tab;
      
      let url = '';
      switch (tab) {
        case 'schedule':
          url = '/pages/user/schedule';
          break;
        case 'meeting':
          url = '/pages/user/meeting/list';
          break;
        case 'notification':
          url = '/pages/user/notification';
          break;
        case 'profile':
          url = '/pages/user/profile';
          break;
      }
      
      uni.reLaunch({
        url: url
      });
    }
  }
}
</script>

<style>
.custom-tab-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7A7E83;
  padding-top: 5px;
}

.tab-item.active {
  color: #3498db;
}

.emoji-icon {
  font-size: 24px;
  line-height: 1;
  margin-bottom: 3px;
}

.tab-text {
  font-size: 12px;
  margin-top: 2px;
}
</style> 