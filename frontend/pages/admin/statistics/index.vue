<template>
  <admin-layout title="统计分析" active-path="/pages/admin/statistics/index">
    <view class="statistics-container">
      <view class="filter-bar">
        <view class="filter-item">
          <text class="filter-label">时间范围</text>
          <picker :value="timeRangeIndex" :range="timeRangeOptions" range-key="label" @change="timeRangeChange" class="filter-picker">
            <view class="picker-value">
              {{timeRangeOptions[timeRangeIndex].label}}
            </view>
          </picker>
        </view>
        
        <view class="filter-item date-range" v-if="timeRangeOptions[timeRangeIndex].value === 'custom'">
          <view class="date-picker">
            <text class="date-label">开始日期</text>
            <picker mode="date" :value="startDate" @change="startDateChange" class="filter-picker">
              <view class="picker-value">{{startDate || '请选择'}}</view>
            </picker>
          </view>
          <view class="date-picker">
            <text class="date-label">结束日期</text>
            <picker mode="date" :value="endDate" @change="endDateChange" class="filter-picker">
              <view class="picker-value">{{endDate || '请选择'}}</view>
            </picker>
          </view>
        </view>
      </view>
      
      <!-- 总体统计卡片 -->
      <view class="statistics-cards">
        <view class="stat-card">
          <text class="stat-value">{{statistics.totalMeetings}}</text>
          <text class="stat-label">会议总数</text>
        </view>
        
        <view class="stat-card">
          <text class="stat-value">{{statistics.approvalRate}}%</text>
          <text class="stat-label">审批通过率</text>
        </view>
        
        <view class="stat-card">
          <text class="stat-value">{{statistics.avgMeetingLength}}</text>
          <text class="stat-label">平均时长(小时)</text>
        </view>
        
        <view class="stat-card">
          <text class="stat-value">{{statistics.totalRooms}}</text>
          <text class="stat-label">会议室数量</text>
        </view>
      </view>
      
      <!-- 会议状态分布 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">会议状态分布</text>
        </view>
        <view class="chart-content">
          <view class="pie-chart">
            <view class="pie-legend">
              <view class="legend-item" v-for="(item, index) in statusData" :key="index">
                <view class="legend-color" :style="{backgroundColor: item.color}"></view>
                <text class="legend-text">{{item.name}}: {{item.value}}次 ({{item.percentage}}%)</text>
              </view>
            </view>
            <view class="pie-chart-container">
              <view class="pie-slice" v-for="(item, index) in statusData" :key="index" 
                :style="{
                  backgroundColor: item.color,
                  transform: `rotate(${getRotation(index)}deg)`,
                  transformOrigin: '50% 50%',
                  clipPath: `polygon(50% 50%, 50% 0%, ${getEndPoint(index)} 0%, ${getEndPoint(index)} 50%)`,
                  zIndex: statusData.length - index
                }">
                <view class="pie-label" :style="{
                  transform: `rotate(${getLabelRotation(index)}deg)`,
                  transformOrigin: '50% 50%',
                  left: getLabelPosition(index)
                }">
                  <text class="label-text" :style="{ color: getLabelColor(item.color) }">{{item.percentage}}%</text>
                </view>
              </view>
              <view class="pie-center">
                <text class="pie-center-text">{{statistics.totalMeetings}}</text>
                <text class="pie-center-label">总会议数</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 每日会议数量趋势 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">每日会议数量趋势</text>
        </view>
        <view class="chart-content">
          <view class="bar-chart">
            <view class="bar-chart-container">
              <view class="bar-chart-y-axis">
                <text class="y-axis-label" v-for="(value, index) in dailyYAxisValues" :key="index">{{value}}</text>
              </view>
              <view class="bar-chart-main">
                <view class="bar-chart-grid">
                  <view class="grid-line" v-for="(_, index) in dailyYAxisValues.length" :key="index"></view>
                </view>
                <view class="bar-chart-data">
                  <view class="bar" v-for="(item, index) in dailyMeetings" :key="index"
                    :style="{
                      height: `${(item.count / maxDailyCount) * 100}%`,
                      backgroundColor: getBarColor(index)
                    }">
                    <view class="bar-tooltip">{{item.date}}: {{item.count}}次</view>
                  </view>
                </view>
                <view class="bar-chart-x-axis">
                  <text class="x-axis-label" v-for="(item, index) in dailyMeetings" :key="index">{{item.date}}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 会议室使用次数 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">会议室使用次数</text>
        </view>
        <view class="chart-content">
          <view class="bar-chart">
            <view class="bar-chart-container">
              <view class="bar-chart-y-axis">
                <text class="y-axis-label" v-for="(value, index) in roomYAxisValues" :key="index">{{value}}</text>
              </view>
              <view class="bar-chart-main">
                <view class="bar-chart-grid">
                  <view class="grid-line" v-for="(_, index) in roomYAxisValues.length" :key="index"></view>
                </view>
                <view class="bar-chart-data">
                  <view class="bar" v-for="(item, index) in topRooms" :key="index"
                    :style="{
                      height: `${(item.meetings / maxRoomMeetings) * 100}%`,
                      backgroundColor: getBarColor(index)
                    }">
                    <view class="bar-tooltip">{{item.name}}: {{item.meetings}}次</view>
                  </view>
                </view>
                <view class="bar-chart-x-axis">
                  <text class="x-axis-label" v-for="(item, index) in topRooms" :key="index">{{item.name}}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 高频会议室TOP5 -->
      <view class="data-card">
        <view class="data-header">
          <text class="data-title">高频使用会议室TOP5</text>
        </view>
        <view class="data-content">
          <view class="data-table">
            <view class="data-table-header">
              <text class="data-th">排名</text>
              <text class="data-th">会议室</text>
              <text class="data-th">使用次数</text>
            </view>
            <view class="data-table-body">
              <view class="data-table-row" v-for="(item, index) in topRooms" :key="index">
                <text class="data-td">{{index + 1}}</text>
                <text class="data-td">{{item.name}}</text>
                <text class="data-td">{{item.meetings}}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      
      <!-- 预约频率最高的用户TOP5 表格 -->
      <view class="data-card">
        <view class="data-header">
          <text class="data-title">预约频率最高的用户TOP5</text>
        </view>
        <view class="data-content">
          <view class="data-table">
            <view class="data-table-header">
              <text class="data-th">排名</text>
              <text class="data-th">用户</text>
              <text class="data-th">预约次数</text>
            </view>
            <view class="data-table-body">
              <view class="data-table-row" v-for="(item, index) in topUsers" :key="index">
                <text class="data-td">{{index + 1}}</text>
                <text class="data-td">{{item.name}}</text>
                <text class="data-td">{{item.meetings}}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </admin-layout>
</template>

<script>
import AdminLayout from '../../../components/admin/AdminLayout.vue'
import * as api from '../../../api/api.js'

export default {
  components: {
    AdminLayout
  },
  data() {
    return {
      timeRangeIndex: 0,
      timeRangeOptions: [
        { label: '本周', value: 'week' },
        { label: '本月', value: 'month' },
        { label: '上月', value: 'last_month' },
        { label: '本季度', value: 'quarter' },
        { label: '本年', value: 'year' },
        { label: '自定义', value: 'custom' }
      ],
      startDate: '',
      endDate: '',
      statistics: {
        totalMeetings: 0,
        approvalRate: 0,
        avgMeetingLength: 0,
        totalRooms: 0
      },
      statusData: [
        { name: '已通过', value: 0, percentage: 0, color: '#2ecc71' },
        { name: '已拒绝', value: 0, percentage: 0, color: '#e74c3c' },
        { name: '待审批', value: 0, percentage: 0, color: '#f39c12' }
      ],
      topRooms: [],
      topUsers: [],
      dailyMeetings: [],
      dailyYAxisValues: [0, 1, 2, 3, 4],
      roomYAxisValues: [0, 1, 2, 3, 4],
      maxDailyCount: 0,
      maxRoomMeetings: 0,
      userYAxisValues: [0, 1, 2, 3, 4],
      maxUserMeetings: 0
    }
  },
  onLoad() {
    this.fetchStatisticsData();
  },
  methods: {
    fetchStatisticsData() {
      // 获取统计数据
      uni.showLoading({
        title: '加载中...'
      });
      
      // 获取当前日期
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
        
      // 根据时间范围获取数据
        const timeRange = this.timeRangeOptions[this.timeRangeIndex].value;
      let startDate = todayStr;
      let endDate = todayStr;
        
      // 计算时间范围
        if (timeRange === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        startDate = weekStart.toISOString().split('T')[0];
        } else if (timeRange === 'month') {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate = monthStart.toISOString().split('T')[0];
        } else if (timeRange === 'last_month') {
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        startDate = lastMonthStart.toISOString().split('T')[0];
        endDate = lastMonthEnd.toISOString().split('T')[0];
        } else if (timeRange === 'quarter') {
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        startDate = quarterStart.toISOString().split('T')[0];
        } else if (timeRange === 'year') {
        const yearStart = new Date(today.getFullYear(), 0, 1);
        startDate = yearStart.toISOString().split('T')[0];
      } else if (timeRange === 'custom' && this.startDate && this.endDate) {
        startDate = this.startDate;
        endDate = this.endDate;
      }
      
      // 获取所有预约数据
      api.getReservations({
        pageSize: 1000, // 获取足够多的数据
        pageNo: 1
      }).then(res => {
        if (res && res.code === 200 && res.data) {
          // 获取预约列表
          const meetings = Array.isArray(res.data) ? res.data : (res.data.list || []);
          
          // 根据时间范围筛选数据
          const filteredMeetings = meetings.filter(meeting => {
            const meetingDate = meeting.reserveDate;
            return meetingDate >= startDate && meetingDate <= endDate;
          });
          
          // 计算基础统计数据
          const totalMeetings = filteredMeetings.length;
          const approvedMeetings = filteredMeetings.filter(m => m.status === '已通过' || m.status === 'approved').length;
          const rejectedMeetings = filteredMeetings.filter(m => m.status === '已拒绝' || m.status === 'rejected').length;
          const pendingMeetings = filteredMeetings.filter(m => m.status === '待审核' || m.status === 'pending').length;
          
          console.log('会议状态统计:', {
            total: totalMeetings,
            approved: approvedMeetings,
            rejected: rejectedMeetings,
            pending: pendingMeetings
          });
          
          // 计算平均会议时长
          let totalDuration = 0;
          let meetingsWithDuration = 0;
          
          filteredMeetings.forEach(meeting => {
            if (meeting.startTime && meeting.endTime) {
              const start = new Date(`${meeting.reserveDate} ${meeting.startTime}`);
              const end = new Date(`${meeting.reserveDate} ${meeting.endTime}`);
              const duration = (end - start) / (1000 * 60 * 60); // 转换为小时
              if (!isNaN(duration) && duration > 0) {
                totalDuration += duration;
                meetingsWithDuration++;
              }
            }
          });
          
          const avgMeetingLength = meetingsWithDuration > 0 ? (totalDuration / meetingsWithDuration).toFixed(1) : 0;
          
          // 更新基础统计数据
          this.statistics = {
            totalMeetings: totalMeetings,
            approvalRate: totalMeetings > 0 ? Math.round((approvedMeetings / totalMeetings) * 100) : 0,
            avgMeetingLength: avgMeetingLength,
            totalRooms: 0 // 需要单独获取会议室数量
          };
        
        // 更新状态分布数据
          this.statusData = [
            { 
              name: '已通过', 
              value: approvedMeetings,
              percentage: totalMeetings > 0 ? Math.round((approvedMeetings / totalMeetings) * 100) : 0,
              color: '#2ecc71'
            },
            { 
              name: '已拒绝', 
              value: rejectedMeetings,
              percentage: totalMeetings > 0 ? Math.round((rejectedMeetings / totalMeetings) * 100) : 0,
              color: '#e74c3c'
            },
            { 
              name: '待审批', 
              value: pendingMeetings,
              percentage: totalMeetings > 0 ? Math.round((pendingMeetings / totalMeetings) * 100) : 0,
              color: '#f39c12'
            }
          ];
          
          // 计算每日会议数量
          this.calculateDailyMeetings(filteredMeetings);
          
          // 获取会议室使用统计
          this.fetchRoomUsageStats(filteredMeetings);
          
          // 获取用户预约统计
          this.fetchUserStats(filteredMeetings);
          
          // 获取会议室总数
          this.fetchTotalRooms();
        } else {
          uni.showToast({
            title: res?.message || '获取预约数据失败',
            icon: 'none'
          });
        }
      }).catch(err => {
        console.error('获取预约数据失败:', err);
        uni.showToast({
          title: '获取预约数据失败，请稍后重试',
          icon: 'none'
        });
      }).finally(() => {
        uni.hideLoading();
      });
    },
    
    // 获取会议室使用统计
    fetchRoomUsageStats(meetings) {
      // 统计每个会议室的使用情况
      const roomUsageMap = {};
      
      // 统计每个会议室的使用次数
      meetings.forEach(meeting => {
        if (meeting.room) {
          if (!roomUsageMap[meeting.room]) {
            roomUsageMap[meeting.room] = {
              name: meeting.room || '未知会议室',
              meetings: 0
            };
          }
          roomUsageMap[meeting.room].meetings++;
        }
      });
      
      // 转换为数组并排序
      this.topRooms = Object.values(roomUsageMap)
        .sort((a, b) => b.meetings - a.meetings)
        .slice(0, 5);
      
      // 计算最大使用次数，用于Y轴刻度
      this.maxRoomMeetings = Math.max(...this.topRooms.map(room => room.meetings), 1);
      
      // 调整Y轴刻度 - 更精确的刻度生成
      this.roomYAxisValues = this.generateYAxisValues(this.maxRoomMeetings);
      
      // 更新会议室总数
      this.statistics.totalRooms = Object.keys(roomUsageMap).length;
    },
    
    // 获取用户预约统计
    fetchUserStats(meetings) {
      // 统计每个用户的预约次数
      const userStatsMap = {};
      
      meetings.forEach(meeting => {
        if (meeting.booker) {
          if (!userStatsMap[meeting.booker]) {
            userStatsMap[meeting.booker] = {
              id: meeting.booker,
              name: meeting.booker || '未知用户',
              department: meeting.bookerDepartment || '未知部门',
              meetings: 0
            };
          }
          userStatsMap[meeting.booker].meetings++;
        }
      });
      
      // 转换为数组并排序
      this.topUsers = Object.values(userStatsMap)
        .sort((a, b) => b.meetings - a.meetings)
        .slice(0, 5);
        
      // 计算最大预约次数，用于Y轴刻度
      this.maxUserMeetings = Math.max(...this.topUsers.map(user => user.meetings), 1);
      
      // 调整Y轴刻度
      this.userYAxisValues = this.generateYAxisValues(this.maxUserMeetings);
    },
    
    // 获取会议室总数
    fetchTotalRooms() {
      api.getRooms().then(res => {
        if (res && res.code === 200 && res.data) {
          const rooms = Array.isArray(res.data) ? res.data : (res.data.list || []);
          this.statistics.totalRooms = rooms.length;
        }
      }).catch(err => {
        console.error('获取会议室总数失败:', err);
      });
    },
    
    // 计算两个日期之间的天数
    calculateDaysBetweenDates(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // 加1是因为包含起始日期
    },
    
    // 获取当前选择的时间范围的开始日期
    getStartDate() {
      const today = new Date();
      const timeRange = this.timeRangeOptions[this.timeRangeIndex].value;
      
      if (timeRange === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return weekStart.toISOString().split('T')[0];
      } else if (timeRange === 'month') {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return monthStart.toISOString().split('T')[0];
      } else if (timeRange === 'last_month') {
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return lastMonthStart.toISOString().split('T')[0];
      } else if (timeRange === 'quarter') {
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        return quarterStart.toISOString().split('T')[0];
      } else if (timeRange === 'year') {
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return yearStart.toISOString().split('T')[0];
      } else {
        return today.toISOString().split('T')[0];
      }
    },
    
    // 获取当前选择的时间范围的结束日期
    getEndDate() {
      const today = new Date();
      const timeRange = this.timeRangeOptions[this.timeRangeIndex].value;
      
      if (timeRange === 'last_month') {
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return lastMonthEnd.toISOString().split('T')[0];
      } else {
        return today.toISOString().split('T')[0];
      }
    },
    
    timeRangeChange(e) {
      this.timeRangeIndex = e.detail.value;
      this.fetchStatisticsData();
    },
    startDateChange(e) {
      this.startDate = e.detail.value;
      if (this.endDate) {
        this.fetchStatisticsData();
      }
    },
    endDateChange(e) {
      this.endDate = e.detail.value;
      if (this.startDate) {
        this.fetchStatisticsData();
      }
    },
    
    // 获取饼图旋转角度
    getRotation(index) {
      let rotation = 0;
      for (let i = 0; i < index; i++) {
        rotation += (this.statusData[i].percentage / 100) * 360;
      }
      return rotation;
    },
    
    // 获取饼图文字旋转角度
    getLabelRotation(index) {
      let totalPercentage = 0;
      for (let i = 0; i < index; i++) {
        totalPercentage += this.statusData[i].percentage;
      }
      // 计算当前扇形的中心角度
      const centerAngle = totalPercentage + (this.statusData[index].percentage / 2);
      // 添加180度来翻转文字
      return (-(centerAngle / 100) * 360) + 180;
    },
    
    // 获取饼图文字位置
    getLabelPosition(index) {
      let totalPercentage = 0;
      for (let i = 0; i < index; i++) {
        totalPercentage += this.statusData[i].percentage;
      }
      // 计算当前扇形的中心角度
      const centerAngle = totalPercentage + (this.statusData[index].percentage / 2);
      const radian = (centerAngle * Math.PI) / 180;
      // 调整文字位置，使其在扇形中间
      const x = 50 + 35 * Math.cos(radian);
      const y = 50 + 35 * Math.sin(radian);
      return `${x}% ${y}%`;
    },
    
    // 获取饼图结束点
    getEndPoint(index) {
      let totalPercentage = 0;
      for (let i = 0; i <= index; i++) {
        totalPercentage += this.statusData[i].percentage;
      }
      const angle = (totalPercentage / 100) * 360;
      const radian = (angle * Math.PI) / 180;
      const x = 50 + 50 * Math.cos(radian);
      const y = 50 + 50 * Math.sin(radian);
      return `${x}% ${y}%`;
    },
    
    // 获取饼图文字颜色
    getLabelColor(backgroundColor) {
      // 将十六进制颜色转换为RGB
      const hex = backgroundColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      // 计算亮度
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      // 根据亮度返回黑色或白色
      return brightness > 128 ? '#000000' : '#ffffff';
    },
    
    // 获取柱状图颜色
    getBarColor(index) {
      const colors = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6'];
      return colors[index % colors.length];
    },
    
    // 计算每日会议数量
    calculateDailyMeetings(meetings) {
      // 按日期分组
      const meetingsByDate = {};
      
      meetings.forEach(meeting => {
        const date = meeting.reserveDate;
        if (!meetingsByDate[date]) {
          meetingsByDate[date] = 0;
        }
        meetingsByDate[date]++;
      });
      
      // 转换为数组并排序
      this.dailyMeetings = Object.keys(meetingsByDate)
        .map(date => ({
          date: date.split('-').slice(1).join('/'), // 只显示月/日
          count: meetingsByDate[date]
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
      
      // 计算最大值，用于Y轴刻度
      this.maxDailyCount = Math.max(...this.dailyMeetings.map(item => item.count), 1);
      
      // 调整Y轴刻度 - 更精确的刻度生成
      this.dailyYAxisValues = this.generateYAxisValues(this.maxDailyCount);
    },
    
    // 生成更合适的Y轴刻度值
    generateYAxisValues(maxValue) {
      // 如果最大值很小，就直接使用固定间隔
      if (maxValue <= 5) {
        // 对于小值，直接生成0到最大值的整数刻度
        const values = [];
        for (let i = maxValue; i >= 0; i--) {
          values.push(i);
        }
        return values;
      }
      
      // 对于较大的值，使用更灵活的算法
      // 找出一个合适的步长
      const idealNumberOfSteps = 5;
      let step = Math.ceil(maxValue / (idealNumberOfSteps - 1));
      
      // 使步长为5的倍数或者2的倍数
      if (step > 10) {
        step = Math.ceil(step / 5) * 5;
      } else if (step > 2) {
        step = Math.ceil(step / 2) * 2;
      }
      
      // 生成刻度值
      const values = [];
      const maxStepValue = Math.ceil(maxValue / step) * step;
      for (let i = maxStepValue; i >= 0; i -= step) {
        values.push(i);
      }
      
      return values;
    }
  }
}
</script>

<style scoped>
.statistics-container {
  padding: 20px 0;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.filter-item {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  flex: 1;
}

.filter-label, .date-label {
  font-size: 14px;
  color: #595959;
  margin-bottom: 8px;
}

.filter-picker {
  height: 40px;
  background-color: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  transition: all 0.3s;
}

.filter-picker:hover {
  border-color: #40a9ff;
}

.picker-value {
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  font-size: 14px;
  color: #262626;
}

.date-range {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.date-picker {
  flex: 1;
  min-width: 200px;
}

.statistics-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 220px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.stat-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #1890ff, #096dd9);
}

.stat-card:nth-child(2)::after {
  background: linear-gradient(90deg, #52c41a, #389e0d);
}

.stat-card:nth-child(3)::after {
  background: linear-gradient(90deg, #fa8c16, #d46b08);
}

.stat-card:nth-child(4)::after {
  background: linear-gradient(90deg, #722ed1, #531dab);
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 8px;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
}

.chart-card, .data-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  overflow: hidden;
}

.chart-header, .data-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.chart-title, .data-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.chart-content, .data-content {
  padding: 20px;
}

/* 饼图样式 */
.pie-chart {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.pie-legend {
  flex: 1;
  min-width: 240px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 8px;
}

.legend-text {
  font-size: 14px;
  color: #595959;
}

.pie-chart-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.pie-slice {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: all 0.3s;
  transform-origin: 50% 50%;
  border-radius: 50%;
  z-index: 1;
}

.pie-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 50% 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -20px;
  margin-left: -20px;
}

.label-text {
  position: absolute;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  transform: translate(-50%, -50%);
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.pie-center-text {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  line-height: 1;
}

.pie-center-label {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

/* 柱状图样式 */
.bar-chart {
  height: 300px;
}

.bar-chart-container {
  display: flex;
  height: 100%;
}

.bar-chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 12px;
  width: 40px;
}

.y-axis-label {
  font-size: 12px;
  color: #8c8c8c;
  text-align: right;
}

.bar-chart-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.bar-chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-line {
  height: 1px;
  background-color: #f0f0f0;
  width: 100%;
}

.bar-chart-data {
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding-bottom: 30px;
  position: relative;
  z-index: 1;
}

.bar {
  flex: 1;
  margin: 0 10px;
  background-color: #1890ff;
  min-height: 4px;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: all 0.3s;
}

.bar:hover {
  background-color: #40a9ff;
}

.bar-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.3s;
  pointer-events: none;
}

.bar:hover .bar-tooltip {
  opacity: 1;
  bottom: calc(100% + 5px);
}

.bar-chart-x-axis {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  display: flex;
}

.x-axis-label {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #8c8c8c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
}

/* 数据表格样式 */
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table-header {
  display: flex;
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 4px 4px 0 0;
}

.data-th {
  flex: 1;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #595959;
  text-align: left;
}

.data-th:first-child {
  flex: 0 0 80px;
}

.data-table-body {
  background-color: #fff;
}

.data-table-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.data-table-row:hover {
  background-color: #f5f7fa;
}

.data-table-row:last-child {
  border-bottom: none;
}

.data-td {
  flex: 1;
  padding: 12px 16px;
  font-size: 14px;
  color: #262626;
  text-align: left;
}

.data-td:first-child {
  flex: 0 0 80px;
  font-weight: 600;
}

@media (max-width: 992px) {
  .stat-card {
    min-width: calc(50% - 16px);
  }
  
  .pie-chart {
    flex-direction: column;
    align-items: center;
  }
  
  .pie-legend {
    width: 100%;
    order: 2;
  }
  
  .pie-chart-container {
    order: 1;
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
  }
  
  .filter-item {
    width: 100%;
  }
  
  .date-range {
    flex-direction: column;
    gap: 12px;
  }
  
  .date-picker {
    width: 100%;
  }
  
  .statistics-cards {
    flex-wrap: wrap;
  }
  
  .stat-card {
    min-width: 100%;
    margin-bottom: 16px;
  }
  
  .bar-chart {
    height: 240px;
  }
}

@media (max-width: 576px) {
  .bar-chart-y-axis {
    width: 30px;
  }
  
  .bar {
    margin: 0 4px;
  }
  
  .data-th, .data-td {
    padding: 12px 8px;
    font-size: 13px;
  }
  
  .data-th:first-child, .data-td:first-child {
    flex: 0 0 60px;
  }
}
</style> 