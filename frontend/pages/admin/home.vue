<template>
  <view class="admin-home-container">
    <!-- 顶部统计卡片 -->
    <view class="statistics-cards">
      <view class="stat-card" @click="navigateTo('/pages/admin/meeting/list')">
        <view class="stat-value">{{statistics.meetings}}</view>
        <view class="stat-label">今日会议</view>
      </view>
      
      <view class="stat-card" @click="navigateTo('/pages/admin/meeting/list?status=approved')">
        <view class="stat-value approved">{{statistics.approved}}</view>
        <view class="stat-label">已审批</view>
      </view>
      
      <view class="stat-card" @click="navigateTo('/pages/admin/meeting/list?status=pending')">
        <view class="stat-value pending">{{statistics.pending}}</view>
        <view class="stat-label">待审批</view>
      </view>
    </view>
    
    <!-- 菜单导航 -->
    <view class="menu-section">
      <view class="section-title">功能菜单</view>
      
      <view class="menu-grid">
        <view class="menu-item" @click="navigateTo('/pages/admin/room/list')">
          <view class="menu-icon room-icon">
            <text class="iconfont icon-room"></text>
          </view>
          <text class="menu-label">会议室管理</text>
        </view>
        
        <view class="menu-item" @click="navigateTo('/pages/admin/meeting/list')">
          <view class="menu-icon meeting-icon">
            <text class="iconfont icon-meeting"></text>
          </view>
          <text class="menu-label">会议管理</text>
        </view>
        
        <view class="menu-item" @click="navigateTo('/pages/admin/user/list')">
          <view class="menu-icon user-icon">
            <text class="iconfont icon-user"></text>
          </view>
          <text class="menu-label">用户管理</text>
        </view>
        
        <view class="menu-item" @click="navigateTo('/pages/admin/statistics/index')">
          <view class="menu-icon statistics-icon">
            <text class="iconfont icon-chart"></text>
          </view>
          <text class="menu-label">数据报表</text>
        </view>
        
        <view class="menu-item" @click="navigateTo('/pages/admin/rpa/index')">
          <view class="menu-icon rpa-icon">
            <text class="iconfont icon-rpa"></text>
          </view>
          <text class="menu-label">RPA管理</text>
        </view>
        
        <view class="menu-item" @click="handleLogout">
          <view class="menu-icon logout-icon">
            <text class="iconfont icon-logout"></text>
          </view>
          <text class="menu-label">退出登录</text>
        </view>
      </view>
    </view>
    
    <!-- 即将开始的会议 -->
    <view class="upcoming-meetings">
      <view class="section-title">即将开始的会议</view>
      
      <view class="meeting-list">
        <view class="meeting-item" v-for="(item, index) in upcomingMeetings" :key="index" @click="navigateToMeetingDetail(item.id)">
          <view class="meeting-content">
            <view class="meeting-title">{{item.title}}</view>
            <view class="meeting-info">{{item.time}} | {{item.room}}</view>
          </view>
          <view class="meeting-status">
            <text class="badge" :class="getStatusClass(item.status)">{{item.statusText}}</text>
          </view>
        </view>
        
        <view class="no-meetings" v-if="upcomingMeetings.length === 0">
          <text>暂无即将开始的会议</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statistics: {
        meetings: 12,
        approved: 8,
        pending: 4
      },
      upcomingMeetings: [
        {
          id: 1,
          title: '项目启动会议',
          time: '09:30 - 11:00',
          room: '会议室A',
          status: 'approved',
          statusText: '已审批'
        },
        {
          id: 2,
          title: '产品讨论会',
          time: '13:30 - 15:00',
          room: '会议室B',
          status: 'pending',
          statusText: '待审批'
        }
      ]
    }
  },
  onLoad() {
    this.checkAdminLogin();
    this.fetchDashboardData();
  },
  methods: {
    checkAdminLogin() {
      const adminToken = uni.getStorageSync('adminToken');
      if (!adminToken) {
        uni.redirectTo({
          url: '/pages/admin/login'
        });
      }
    },
    fetchDashboardData() {
      // 这里应该从API获取首页数据
      uni.showLoading({
        title: '加载中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        // 实际项目中应该使用接口返回的数据更新页面
      }, 500);
    },
    navigateTo(url) {
      uni.navigateTo({
        url
      });
    },
    navigateToMeetingDetail(id) {
      uni.navigateTo({
        url: `/pages/admin/meeting/detail?id=${id}`
      });
    },
    getStatusClass(status) {
      const statusMap = {
        'approved': 'badge-success',
        'pending': 'badge-warning',
        'rejected': 'badge-danger'
      };
      return statusMap[status] || 'badge-secondary';
    },
    handleLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除登录信息
            uni.removeStorageSync('adminToken');
            uni.removeStorageSync('adminInfo');
            
            // 跳转到登录页
            uni.redirectTo({
              url: '/pages/admin/login'
            });
          }
        }
      });
    }
  }
}
</script>

<style>
.admin-home-container {
  padding: 15px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 统计卡片样式 */
.statistics-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  margin: 0 5px;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.stat-card:first-child {
  margin-left: 0;
}

.stat-card:last-child {
  margin-right: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 5px;
}

.stat-value.approved {
  color: #2ecc71;
}

.stat-value.pending {
  color: #f39c12;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 功能菜单样式 */
.menu-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.menu-grid {
  display: flex;
  flex-wrap: wrap;
}

.menu-item {
  width: 33.33%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.menu-icon {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.menu-icon .iconfont {
  font-size: 24px;
  color: #fff;
}

.room-icon {
  background-color: #3498db;
}

.meeting-icon {
  background-color: #9b59b6;
}

.user-icon {
  background-color: #2ecc71;
}

.statistics-icon {
  background-color: #f39c12;
}

.rpa-icon {
  background-color: #1abc9c;
}

.logout-icon {
  background-color: #e74c3c;
}

.menu-label {
  font-size: 14px;
  color: #333;
}

/* 即将开始的会议样式 */
.upcoming-meetings {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.meeting-list {
  margin-top: 10px;
}

.meeting-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.meeting-item:last-child {
  border-bottom: none;
}

.meeting-title {
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 5px;
}

.meeting-info {
  font-size: 13px;
  color: #666;
}

.badge {
  display: inline-block;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
}

.badge-success {
  background-color: #2ecc71;
}

.badge-warning {
  background-color: #f39c12;
}

.badge-danger {
  background-color: #e74c3c;
}

.badge-secondary {
  background-color: #95a5a6;
}

.no-meetings {
  text-align: center;
  padding: 20px 0;
  color: #999;
}

.iconfont {
  font-family: 'iconfont';
  /* 如果您使用了其他图标库，请相应调整 */
}
</style> 