<template>
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
          <view class="chart-placeholder">
            <text class="placeholder-text">饼图数据可视化</text>
            <text class="placeholder-desc">实际项目中应使用图表组件</text>
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
        <view class="line-chart">
          <view class="chart-placeholder">
            <text class="placeholder-text">折线图数据可视化</text>
            <text class="placeholder-desc">实际项目中应使用图表组件</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 会议室使用率 -->
    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">会议室使用率</text>
      </view>
      <view class="chart-content">
        <view class="bar-chart">
          <view class="chart-placeholder">
            <text class="placeholder-text">柱状图数据可视化</text>
            <text class="placeholder-desc">实际项目中应使用图表组件</text>
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
            <text class="data-th">使用率</text>
          </view>
          <view class="data-table-body">
            <view class="data-table-row" v-for="(item, index) in topRooms" :key="index">
              <text class="data-td">{{index + 1}}</text>
              <text class="data-td">{{item.name}}</text>
              <text class="data-td">{{item.count}}</text>
              <text class="data-td">{{item.usage}}%</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 预约频率最高的用户TOP5 -->
    <view class="data-card">
      <view class="data-header">
        <text class="data-title">预约频率最高的用户TOP5</text>
      </view>
      <view class="data-content">
        <view class="data-table">
          <view class="data-table-header">
            <text class="data-th">排名</text>
            <text class="data-th">用户</text>
            <text class="data-th">部门</text>
            <text class="data-th">预约次数</text>
          </view>
          <view class="data-table-body">
            <view class="data-table-row" v-for="(item, index) in topUsers" :key="index">
              <text class="data-td">{{index + 1}}</text>
              <text class="data-td">{{item.name}}</text>
              <text class="data-td">{{item.department}}</text>
              <text class="data-td">{{item.count}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
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
        totalMeetings: 245,
        approvalRate: 92,
        avgMeetingLength: 1.8,
        totalRooms: 12
      },
      statusData: [
        { name: '已通过', value: 225, percentage: 92, color: '#2ecc71' },
        { name: '已拒绝', value: 15, percentage: 6, color: '#e74c3c' },
        { name: '待审批', value: 5, percentage: 2, color: '#f39c12' }
      ],
      topRooms: [
        { name: '会议室A', count: 45, usage: 87 },
        { name: '会议室B', count: 40, usage: 82 },
        { name: '会议室C', count: 32, usage: 68 },
        { name: '会议室D', count: 25, usage: 55 },
        { name: '会议室E', count: 20, usage: 42 }
      ],
      topUsers: [
        { name: '张三', department: '研发部', count: 23 },
        { name: '李四', department: '研发部', count: 18 },
        { name: '王五', department: '产品部', count: 15 },
        { name: '赵六', department: '市场部', count: 12 },
        { name: '钱七', department: '设计部', count: 10 }
      ]
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
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 实际项目中应该调用API获取统计数据
        // 根据时间范围参数获取不同的统计结果
        const timeRange = this.timeRangeOptions[this.timeRangeIndex].value;
        
        // 模拟不同时间范围的数据
        if (timeRange === 'week') {
          this.statistics = {
            totalMeetings: 56,
            approvalRate: 94,
            avgMeetingLength: 1.6,
            totalRooms: 12
          };
        } else if (timeRange === 'month') {
          this.statistics = {
            totalMeetings: 245,
            approvalRate: 92,
            avgMeetingLength: 1.8,
            totalRooms: 12
          };
        } else if (timeRange === 'last_month') {
          this.statistics = {
            totalMeetings: 230,
            approvalRate: 90,
            avgMeetingLength: 1.9,
            totalRooms: 12
          };
        } else if (timeRange === 'quarter') {
          this.statistics = {
            totalMeetings: 720,
            approvalRate: 91,
            avgMeetingLength: 1.7,
            totalRooms: 12
          };
        } else if (timeRange === 'year') {
          this.statistics = {
            totalMeetings: 2870,
            approvalRate: 93,
            avgMeetingLength: 1.8,
            totalRooms: 12
          };
        }
        
        // 更新状态分布数据
        if (timeRange === 'week') {
          this.statusData = [
            { name: '已通过', value: 52, percentage: 94, color: '#2ecc71' },
            { name: '已拒绝', value: 3, percentage: 5, color: '#e74c3c' },
            { name: '待审批', value: 1, percentage: 1, color: '#f39c12' }
          ];
        } else if (timeRange === 'month') {
          this.statusData = [
            { name: '已通过', value: 225, percentage: 92, color: '#2ecc71' },
            { name: '已拒绝', value: 15, percentage: 6, color: '#e74c3c' },
            { name: '待审批', value: 5, percentage: 2, color: '#f39c12' }
          ];
        }
        
        // 更新高频会议室数据
        if (timeRange === 'week') {
          this.topRooms = [
            { name: '会议室A', count: 12, usage: 80 },
            { name: '会议室B', count: 10, usage: 75 },
            { name: '会议室C', count: 8, usage: 70 },
            { name: '会议室D', count: 6, usage: 60 },
            { name: '会议室E', count: 5, usage: 50 }
          ];
        }
        
        // 更新高频用户数据
        if (timeRange === 'week') {
          this.topUsers = [
            { name: '张三', department: '研发部', count: 5 },
            { name: '李四', department: '研发部', count: 4 },
            { name: '王五', department: '产品部', count: 3 },
            { name: '赵六', department: '市场部', count: 3 },
            { name: '钱七', department: '设计部', count: 2 }
          ];
        }
      }, 500);
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
    }
  }
}
</script>

<style>
.statistics-container {
  padding: 15px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 过滤条件样式 */
.filter-bar {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.filter-item {
  margin-bottom: 10px;
}

.filter-label, .date-label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
  color: #555;
}

.filter-picker {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 40px;
  width: 100%;
}

.picker-value {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 14px;
}

.date-range {
  display: flex;
  justify-content: space-between;
}

.date-picker {
  width: 48%;
}

/* 统计卡片样式 */
.statistics-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.stat-card {
  flex: 1;
  min-width: 110px;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 图表卡片样式 */
.chart-card, .data-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.chart-header, .data-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.chart-title, .data-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.chart-content, .data-content {
  padding: 15px;
}

/* 图表占位符样式 */
.chart-placeholder {
  height: 200px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-size: 16px;
  color: #999;
  margin-bottom: 5px;
}

.placeholder-desc {
  font-size: 12px;
  color: #bbb;
}

/* 饼图图例样式 */
.pie-chart {
  display: flex;
  flex-direction: column;
}

.pie-legend {
  margin-bottom: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 8px;
}

.legend-text {
  font-size: 14px;
  color: #333;
}

/* 表格样式 */
.data-table {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}

.data-table-header {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.data-th {
  flex: 1;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: #555;
}

.data-table-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.data-table-row:last-child {
  border-bottom: none;
}

.data-td {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #333;
}

@media (max-width: 768px) {
  .statistics-cards {
    flex-wrap: wrap;
  }
  
  .stat-card {
    flex: 0 0 calc(50% - 10px);
    margin-bottom: 10px;
  }
  
  .date-range {
    flex-direction: column;
  }
  
  .date-picker {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style> 