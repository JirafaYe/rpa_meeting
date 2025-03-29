<template>
  <view class="schedule-container">
    <!-- 日历组件 -->
    <view class="calendar-wrapper">
    <view class="calendar-header">
        <view class="month-selector">
          <text class="month-arrow" @click="changeMonth(-1)">◀</text>
          <text class="current-month">{{ currentYear }}年{{ currentMonth }}月</text>
          <text class="month-arrow" @click="changeMonth(1)">▶</text>
        </view>
      </view>
      
      <!-- 星期头部 -->
      <view class="weekdays">
        <text class="weekday" v-for="(day, index) in weekdays" :key="index">{{ day }}</text>
    </view>
    
      <!-- 日期网格 -->
      <view class="days-grid">
      <view 
          class="day-cell" 
          v-for="(day, index) in calendarDays" 
        :key="index" 
        :class="{ 
            'other-month': !day.isCurrentMonth,
          'today': day.isToday,
            'has-event': day.hasEvent,
            'selected': day.date === selectedDate
          }"
          @click="selectDate(day.date)"
      >
        <text class="day-number">{{ day.day }}</text>
          <view class="event-indicator" v-if="day.hasEvent"></view>
        </view>
      </view>
    </view>
    
    <!-- 当日日程列表 -->
    <view class="events-container">
      <view class="events-header">
        <text class="events-title">{{ formatSelectedDate }} 日程</text>
        <button class="add-event-btn" @click="navigateToCreateMeeting">添加会议</button>
      </view>
      
      <view class="events-list" v-if="eventsOnSelectedDate.length > 0">
        <view 
          class="event-card" 
          v-for="(event, index) in eventsOnSelectedDate" 
          :key="index"
          :class="getStatusClass(event.status)"
          @click="navigateToMeetingDetail(event.id)"
        >
          <view class="event-time">{{ event.startTime }} - {{ event.endTime }}</view>
          <view class="event-title">{{ event.title }}</view>
          <view class="event-location">{{ event.location }}</view>
          <view class="event-status">{{ event.statusText }}</view>
        </view>
      </view>
      
      <view class="empty-state" v-else>
        <image class="empty-icon" src="/static/icons/calendar-empty.png" mode="aspectFit"></image>
        <text class="empty-text">当天暂无日程安排</text>
        <text class="empty-hint">点击"添加会议"按钮预约会议</text>
      </view>
    </view>
  </view>
  
  <!-- 添加自定义底部导航 -->
  <custom-tab-bar></custom-tab-bar>
</template>

<script>
import api from '../../utils/api.js'
import CustomTabBar from '../../components/common/CustomTabBar.vue'

export default {
  components: {
    CustomTabBar
  },
  data() {
    return {
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      currentDate: new Date(),
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      selectedDate: '',
      events: [],
      loading: false
    };
  },
  created() {
    // 初始化选中日期为今天
    this.selectedDate = this.formatDateString(new Date());
  },
  computed: {
    // 计算日历网格中的所有日期
    calendarDays() {
      const year = this.currentYear;
      const month = this.currentMonth - 1; // JavaScript中月份从0开始
      
      // 当月第一天
      const firstDay = new Date(year, month, 1);
      // 当月最后一天
      const lastDay = new Date(year, month + 1, 0);
      
      // 当月第一天是星期几
      const firstDayOfWeek = firstDay.getDay();
      // 当月总天数
      const daysInMonth = lastDay.getDate();
      
      // 上个月最后几天
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      
      const days = [];
      
      // 添加上个月的日期
      for (let i = 0; i < firstDayOfWeek; i++) {
        const day = prevMonthLastDay - firstDayOfWeek + i + 1;
        const date = `${year}-${this.padZero(month)}-${this.padZero(day)}`;
        days.push({
          day,
          date,
          isCurrentMonth: false,
          isToday: false,
          hasEvent: this.checkHasEvent(date)
        });
      }
      
      // 添加当月的日期
      const today = new Date();
      const isCurrentYearMonth = today.getFullYear() === year && today.getMonth() === month;
      
      for (let i = 1; i <= daysInMonth; i++) {
        const date = `${year}-${this.padZero(month + 1)}-${this.padZero(i)}`;
        days.push({
          day: i,
          date,
          isCurrentMonth: true,
          isToday: isCurrentYearMonth && today.getDate() === i,
          hasEvent: this.checkHasEvent(date)
        });
      }
      
      // 计算还需要添加的下个月日期数量
      const nextMonthDays = 42 - days.length; // 6行7列总共42个格子
      
      // 添加下个月的日期
      for (let i = 1; i <= nextMonthDays; i++) {
        const date = `${year}-${this.padZero(month + 2 > 12 ? 1 : month + 2)}-${this.padZero(i)}`;
        days.push({
          day: i,
          date,
          isCurrentMonth: false,
          isToday: false,
          hasEvent: this.checkHasEvent(date)
        });
      }
      
      return days;
    },
    // 格式化显示选中的日期
    formatSelectedDate() {
      if (!this.selectedDate) return '';
      
      const dateParts = this.selectedDate.split('-');
      return `${dateParts[0]}年${dateParts[1]}月${dateParts[2]}日`;
    },
    // 获取选中日期的所有事件
    eventsOnSelectedDate() {
      console.log('当前选中日期:', this.selectedDate);
      console.log('所有事件:', JSON.stringify(this.events));
      
      // 过滤出选中日期的事件
      const filteredEvents = this.events.filter(event => {
        const match = event.date === this.selectedDate;
        console.log(`事件 ${event.id} 日期 ${event.date} 匹配结果: ${match}`);
        return match;
      });
      
      console.log('过滤后的事件数量:', filteredEvents.length);
      return filteredEvents;
    }
  },
  onLoad() {
    // 获取日程数据
    this.fetchSchedules();
  },
  onPullDownRefresh() {
    // 下拉刷新
    this.fetchSchedules();
  },
  methods: {
    // 获取日程数据
    fetchSchedules() {
      this.loading = true;
      
      api.meeting.getSchedule({
        startDate: this.getMonthStartDate(),
        endDate: this.getMonthEndDate()
      })
        .then(res => {
          if (res.code === 200 && res.data) {
            // 将API返回的日程数据转换为日历需要的格式
            console.log('API返回的日程数据:', JSON.stringify(res.data));
            this.events = res.data.map(item => {
              try {
                // 处理不同的日期时间格式
                let startDate, endDate;
                
                // 确保start和end属性存在且不为undefined
                const startStr = item.start || '';
                const endStr = item.end || '';
                
                console.log(`处理会议 ${item.id}, 开始时间: ${startStr}, 结束时间: ${endStr}`);
                
                try {
                  // 提取日期部分和时间部分
                  if (startStr.includes('T')) {
                    // ISO格式 2023-05-20T10:00:00.000Z
                    startDate = new Date(startStr);
                    endDate = new Date(endStr);
                  } else if (startStr.includes(' ') && startStr.includes('-') && startStr.includes(':')) {
                    // 字符串格式 2023-05-20 10:00
                    const [startDatePart, startTimePart] = startStr.split(' ');
                    const [endDatePart, endTimePart] = endStr.split(' ');
                    
                    // 使用更可靠的格式来创建日期
                    const [startYear, startMonth, startDay] = startDatePart.split('-').map(Number);
                    const [startHour, startMinute] = (startTimePart || '00:00').split(':').map(Number);
                    
                    // 注意月份是从0开始的
                    startDate = new Date(startYear, startMonth - 1, startDay, startHour, startMinute);
                    
                    // 处理结束日期和时间
                    if (endDatePart && endTimePart) {
                      const [endYear, endMonth, endDay] = endDatePart.split('-').map(Number);
                      const [endHour, endMinute] = endTimePart.split(':').map(Number);
                      endDate = new Date(endYear, endMonth - 1, endDay, endHour, endMinute);
                    } else {
                      // 如果结束时间不完整，设置为开始时间后一小时
                      endDate = new Date(startDate.getTime() + 60*60*1000);
                    }
                  } else if (startStr.includes(':') && !startStr.includes('-')) {
                    // 只有时间没有日期 (例如 24:00)
                    const today = new Date();
                    const [startHour, startMinute] = startStr.split(':').map(Number);
                    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);
                    
                    if (endStr && endStr.includes(':')) {
                      const [endHour, endMinute] = endStr.split(':').map(Number);
                      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
                    } else {
                      endDate = new Date(startDate.getTime() + 60*60*1000);
                    }
                  } else {
                    // 其他格式或无法识别的格式
                    console.error(`无法识别的日期格式: ${startStr}`);
                    throw new Error('无法识别的日期格式');
                  }
                } catch (err) {
                  console.error(`解析日期出错: ${err.message}`);
                  // 使用默认值
                  const now = new Date();
                  startDate = now;
                  endDate = new Date(now.getTime() + 60*60*1000);
                }
                
                if (isNaN(startDate.getTime())) {
                  console.error(`无效的开始日期: ${startStr}`);
                  startDate = new Date(); // 使用当前日期作为后备
                }
                
                if (isNaN(endDate.getTime())) {
                  console.error(`无效的结束日期: ${endStr}`);
                  endDate = new Date(startDate.getTime() + 60*60*1000); // 使用开始时间后一小时作为后备
                }
                
                const event = {
                  id: item.id || '',
                  title: item.title || '',
                  date: this.formatDateString(startDate),
                  startTime: this.formatTimeString(startDate),
                  endTime: this.formatTimeString(endDate),
                  location: item.location || '会议室',
                  status: item.status || 'approved',
                  statusText: this.getStatusText(item.status),
                  description: item.description || '',
                  allDay: false
                };
                
                console.log(`生成的日程项:`, event);
                return event;
              } catch (err) {
                console.error(`处理日程数据出错:`, err, item);
                // 返回一个默认事件对象，避免整个映射失败
                return {
                  id: item.id || '',
                  title: item.title || '未知会议',
                  date: this.formatDateString(new Date()),
                  startTime: '00:00',
                  endTime: '01:00',
                  location: '未知',
                  status: 'approved',
                  statusText: '已通过',
                  description: '',
                  allDay: false
                };
              }
            });
            
            console.log('处理后的events数据:', JSON.stringify(this.events));
            console.log('当前选中日期:', this.selectedDate);
            
            // 日历组件依赖events数据，所以需要强制更新
            this.$forceUpdate();
          } else {
            uni.showToast({
              title: res.message || '获取日程失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取日程失败:', err);
          uni.showToast({
            title: '获取日程失败',
            icon: 'none'
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    // 获取当月开始日期
    getMonthStartDate() {
      const year = this.currentYear;
      const month = this.padZero(this.currentMonth);
      const dateStr = `${year}-${month}-01`;
      console.log('计算的月份开始日期:', dateStr);
      return dateStr;
    },
    
    // 获取当月结束日期
    getMonthEndDate() {
      const year = this.currentYear;
      const month = this.currentMonth;
      // JavaScript月份从0开始，所以获取下个月的第0天就是当前月的最后一天
      const lastDay = new Date(year, month, 0).getDate();
      const dateStr = `${year}-${this.padZero(month)}-${this.padZero(lastDay)}`;
      console.log('计算的月份结束日期:', dateStr);
      return dateStr;
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'pending': '待审批',
        'approved': '已通过',
        'in-progress': '进行中',
        'completed': '已完成',
        'rejected': '已拒绝',
        'canceled': '已取消'
      };
      return statusMap[status] || '已通过';
    },
    
    // 格式化日期为YYYY-MM-DD字符串
    formatDateString(date) {
      // 确保date是有效的Date对象
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error('无效的日期对象:', date);
        const today = new Date();
        return `${today.getFullYear()}-${this.padZero(today.getMonth() + 1)}-${this.padZero(today.getDate())}`;
      }
      
      const year = date.getFullYear();
      const month = this.padZero(date.getMonth() + 1);
      const day = this.padZero(date.getDate());
      return `${year}-${month}-${day}`;
    },
    
    // 格式化时间为HH:MM字符串
    formatTimeString(date) {
      // 确保date是有效的Date对象
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error('格式化时间错误: 无效的日期对象', date);
        return '00:00';
      }
      
      const hours = this.padZero(date.getHours());
      const minutes = this.padZero(date.getMinutes());
      return `${hours}:${minutes}`;
    },
    // 数字补零
    padZero(num) {
      return num < 10 ? '0' + num : num;
    },
    // 切换月份
    changeMonth(delta) {
      let newMonth = this.currentMonth + delta;
      let newYear = this.currentYear;
      
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
      
      this.currentMonth = newMonth;
      this.currentYear = newYear;
    },
    // 选择日期
    selectDate(date) {
      this.selectedDate = date;
    },
    // 检查日期是否有事件
    checkHasEvent(date) {
      if (!this.events || !this.events.length) return false;
      return this.events.some(event => event.date === date);
    },
    // 获取事件状态样式类
    getStatusClass(status) {
      return {
        'status-approved': status === 'approved',
        'status-pending': status === 'pending',
        'status-in-progress': status === 'in-progress',
        'status-completed': status === 'completed',
        'status-rejected': status === 'rejected',
        'status-canceled': status === 'canceled'
      };
    },
    // 跳转到创建会议页面
    navigateToCreateMeeting() {
      uni.navigateTo({
        url: '/pages/user/meeting/create'
      });
    },
    // 跳转到会议详情页面
    navigateToMeetingDetail(eventId) {
      uni.navigateTo({
        url: `/pages/user/meeting/detail?id=${eventId}`
      });
    }
  }
};
</script>

<style>
.schedule-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 50px; /* 修改为适应底部导航 */
}

.calendar-wrapper {
  background-color: #fff;
  border-radius: 10px;
  margin: 15px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  margin-bottom: 15px;
}

.month-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.month-arrow {
  font-size: 20px;
  color: #3498db;
  padding: 5px 15px;
}

.current-month {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.weekdays {
  display: flex;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
  
  .weekday {
    flex: 1;
    text-align: center;
  color: #666;
  font-size: 14px;
}

.days-grid {
  display: flex;
  flex-wrap: wrap;
}

.day-cell {
  width: 14.28%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.day-number {
  font-size: 16px;
  margin-bottom: 5px;
}

.other-month .day-number {
  color: #ccc;
}

.today {
  background-color: rgba(52, 152, 219, 0.1);
  border-radius: 50%;
}

.today .day-number {
  color: #3498db;
  font-weight: bold;
}

.selected {
  background-color: #3498db;
  border-radius: 50%;
}

.selected .day-number {
  color: #fff;
  font-weight: bold;
}

.event-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
  background-color: #e74c3c;
  position: absolute;
  bottom: 8px;
}

.events-container {
  flex: 1;
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  padding: 15px;
  margin: 0 15px 15px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.events-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.add-event-btn {
  background-color: #3498db;
  color: white;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  padding: 0 15px;
  border-radius: 18px;
}

.events-list {
  padding-bottom: 30px;
}

.event-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid #3498db;
}

.event-time {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.event-title {
  font-size: 16px;
    font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.event-location {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.event-status {
  font-size: 12px;
  color: #3498db;
  align-self: flex-end;
}

.status-approved {
  border-left-color: #2ecc71;
}

.status-pending {
  border-left-color: #f39c12;
}

.status-in-progress {
  border-left-color: #3498db;
}

.status-completed {
  border-left-color: #27ae60;
}

.status-rejected {
  border-left-color: #e74c3c;
}

.status-canceled {
  border-left-color: #95a5a6;
}

.status-approved .event-status {
  color: #2ecc71;
}

.status-pending .event-status {
  color: #f39c12;
}

.status-in-progress .event-status {
  color: #3498db;
}

.status-completed .event-status {
  color: #27ae60;
}

.status-rejected .event-status {
  color: #e74c3c;
}

.status-canceled .event-status {
  color: #95a5a6;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
  }
  
  .empty-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
  }

.empty-hint {
  font-size: 14px;
  color: #999;
}
</style> 