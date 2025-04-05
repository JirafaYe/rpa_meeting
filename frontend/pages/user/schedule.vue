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
          @click="viewEvent(event)"
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
import api from '/api/index'
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
      currentEvents: [],
      loading: false,
      allEvents: [],
      userId: null, // 当前用户ID
      todayEvents: []
    };
  },
  created() {
    // 初始化选中日期为今天
    this.selectedDate = this.formatDateString(new Date());
    
    // 获取用户ID
    try {
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo && userInfo.id) {
        this.userId = userInfo.id.toString();
        console.log('日程页面获取到用户ID:', this.userId);
      } else {
        console.warn('未能从存储获取用户信息');
      }
    } catch (e) {
      console.error('获取用户信息失败:', e);
    }
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
      const prevMonth = month === 0 ? 12 : month;
      const prevYear = month === 0 ? year - 1 : year;
      
      for (let i = 0; i < firstDayOfWeek; i++) {
        const day = prevMonthLastDay - firstDayOfWeek + i + 1;
        const date = `${prevYear}-${this.padZero(prevMonth)}-${this.padZero(day)}`;
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
      const nextMonth = month === 11 ? 1 : month + 2;
      const nextYear = month === 11 ? year + 1 : year;
      
      for (let i = 1; i <= nextMonthDays; i++) {
        const date = `${nextYear}-${this.padZero(nextMonth)}-${this.padZero(i)}`;
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
      // 过滤出选中日期的事件
      const filteredEvents = this.events.filter(event => {
        const match = event.reserveDate === this.selectedDate;
        return match;
      });
      
      return filteredEvents;
    }
  },
  onLoad() {
    // 获取当前日期
    const today = new Date();
    const todayStr = today.getFullYear() + '-' + 
                   this.padZero(today.getMonth() + 1) + '-' + 
                   this.padZero(today.getDate());
    
    // 设置选中日期为今天
    this.selectedDate = todayStr;
    
    // 只获取所有日程数据，不发送重复请求
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
        reserveDate: null, // 不限制日期，获取所有数据
        startTime: null,
        endTime: null,
        pageSize: 100,
        pageNo: 1
      })
        .then(res => {
          if (res.code === 200) {
            console.log('原始返回数据:', res.data);
            
            // 检查返回的数据结构，确定正确的数据源
            let rawData = [];
              if (res.data && Array.isArray(res.data)) {
              rawData = res.data;
              } else if (res.data && res.data.list && Array.isArray(res.data.list)) {
              rawData = res.data.list;
            }
            
            // 显示原始数据中的每个会议
            if (rawData.length > 0) {
              rawData.forEach((meeting, index) => {
                console.log(`会议${index+1}:`, meeting);
              });
            }
            
            let scheduleItems = [];
            
            try {
              // 格式化每个会议数据
              scheduleItems = rawData.map(item => this.formatScheduleItem(item));
              
              // 记录格式化后的结果
              if (scheduleItems.length > 0) {
                console.log('格式化后的事件数组:', scheduleItems);
              }
              
            } catch (err) {
              console.error('格式化日程数据出错:', err);
              scheduleItems = [];
            }
            
            this.events = scheduleItems;
            this.allEvents = scheduleItems;
            
            // 根据选中日期过滤事件
            this.filterEventsByDate(this.selectedDate);
          } else {
            uni.showToast({
              title: res.message || '获取日程失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          uni.showToast({
            title: '获取日程失败',
            icon: 'none'
          });
        })
        .finally(() => {
          this.loading = false;
          uni.stopPullDownRefresh();
        });
    },
    
    // 获取当前月的开始日期（格式：YYYY-MM-DD）
    getMonthStartDate() {
      const date = new Date(this.currentYear, this.currentMonth - 1, 1);
      return this.formatDateString(date);
    },
    
    // 获取当前月的结束日期（格式：YYYY-MM-DD）
    getMonthEndDate() {
      const date = new Date(this.currentYear, this.currentMonth, 0);
      return this.formatDateString(date);
    },
    
    // 获取状态文本
    getStatusText(status) {
      if (!status) return '未知';
      
      // 如果已经是中文状态，直接返回
      if (typeof status === 'string') {
        if (['待审核', '已通过', '进行中', '已完成', '已拒绝', '已取消'].includes(status)) {
          return status;
        }
        
        // 转换常见英文状态为中文
        const statusMap = {
          'pending': '待审核',
          'approved': '已通过',
          'in-progress': '进行中',
          'completed': '已完成',
          'rejected': '已拒绝',
          'cancelled': '已取消',
          'canceled': '已取消'
        };
        
        // 尝试直接映射
        status = status.toLowerCase();
        if (statusMap[status]) {
          return statusMap[status];
        }
        
        // 处理包含特定字符串的状态
        if (status.includes('pend') || status.includes('wait') || status.includes('审核')) {
          return '待审核';
        } else if (status.includes('approv') || status.includes('通过')) {
          return '已通过';
        } else if (status.includes('progress') || status.includes('进行')) {
          return '进行中';
        } else if (status.includes('complet') || status.includes('finish') || status.includes('完成')) {
          return '已完成';
        } else if (status.includes('cancel') || status.includes('取消')) {
          return '已取消';
        } else if (status.includes('reject') || status.includes('拒绝')) {
          return '已拒绝';
        }
      }
      
      // 处理数字状态
      if (typeof status === 'number' || /^\d+$/.test(status)) {
        const numStatus = parseInt(status);
        switch(numStatus) {
          case 0: return '待审核';
          case 1: return '已通过';
          case 2: return '进行中';
          case 3: return '已完成';
          case 4: return '已取消';
          case 5: return '已拒绝';
          default: return '未知';
        }
      }
      
      return '未知';
    },
    
    // 格式化日期为YYYY-MM-DD字符串
    formatDateString(date) {
      // 如果传入的是字符串日期，直接返回
      if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }
      
      // 确保date是有效的Date对象
      if (!(date instanceof Date) || isNaN(date.getTime())) {
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
      
      if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      } else if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      }
      
      this.currentMonth = newMonth;
      this.currentYear = newYear;
      
      // 月份改变后重新加载数据
      this.initScheduleData();
      
      // 清空选中的日期
      this.selectedDate = '';
      this.currentEvents = [];
    },
    // 检查日期是否有事件
    checkHasEvent(date) {
      if (!this.events || !this.events.length) return false;
      
      const dateStr = this.formatDateString(date);
      const hasEvent = this.events.some(event => {
        // 比较日期与reserveDate而不是date字段
        const match = event.reserveDate === dateStr;
        return match;
      });
      
      return hasEvent;
    },
    // 根据日期筛选事件
    filterEventsByDate(date) {
      if (!date) {
        // 如果未提供日期，返回所有事件
        return this.allEvents;
      }
      
      // 格式化选中日期
      const dateStr = this.formatDateString(date);
      
      // 筛选出选中日期的事件 - 使用reserveDate字段进行比较
      const filtered = this.allEvents.filter(event => event.reserveDate === dateStr);
      console.log(`筛选日期 ${dateStr} 的事件:`, filtered);
      
      return filtered;
    },
    // 选择日期
    selectDate(date) {
      console.log('选择日期:', date);
      
      // 先置空，强制UI刷新
      this.selectedDate = '';
      
      // 使用nextTick确保DOM更新后再设置新值
      this.$nextTick(() => {
        const dateStr = this.formatDateString(date);
        this.selectedDate = dateStr;
        
        // 筛选该日期的事件
        this.currentEvents = this.filterEventsByDate(dateStr);
        
        console.log(`日期 ${dateStr} 的事件数量:`, this.currentEvents.length);
      });
    },
    // 获取事件状态样式类
    getStatusClass(status) {
      return {
        'status-approved': status === 'approved',
        'status-pending': status === 'pending',
        'status-in-progress': status === 'in-progress',
        'status-completed': status === 'completed',
        'status-rejected': status === 'rejected',
        'status-canceled': status === 'cancelled' || status === 'canceled'
      };
    },
    // 跳转到创建会议页面
    navigateToCreateMeeting() {
      uni.navigateTo({
        url: '/pages/user/meeting/create'
      });
    },
    // 查看日程项详情
    viewEvent(event) {
      console.log('查看日程项:', JSON.stringify(event));
      
      if (!event || !event.id) {
        uni.showToast({
          title: '无效的日程项',
          icon: 'none'
        });
        return;
      }
      
      // 查找原始会议数据
      const originalEvent = this.allEvents.find(item => 
        item.id && item.id.toString() === event.id.toString()
      );
      
      console.log('找到的原始会议数据:', originalEvent);
      
      if (originalEvent) {
        // 使用当前数据构建完整会议信息
        const meetingData = {
          id: event.id,
          topic: event.title || '未命名会议',
          description: event.description || '',
          booker: event.booker || '',
          room: event.location || '',
          startTime: event.startTime || '',
          endTime: event.endTime || '',
          status: event.status || 'pending',
          reserveDate: event.reserveDate || event.date || '',
          
          // 额外提供字段用于前端组件使用
          roomName: typeof event.room === 'object' ? event.room.name : event.roomName || event.room || event.location || '',
          roomId: event.roomId || (typeof event.room === 'object' ? event.room.id : null) || 0,
          participants: event.participants || [],
          title: event.title || '未命名会议',
          date: event.reserveDate || event.date || '',
        };
        
        // 将会议信息转换为JSON字符串并编码
        const meetingInfo = encodeURIComponent(JSON.stringify(meetingData));
        
        const url = `/pages/user/meeting/detail?id=${event.id}&from=schedule&meetingInfo=${meetingInfo}`;
        
        console.log('导航到会议详情页:', url);
        
        uni.navigateTo({
          url: url,
          fail: (err) => {
            console.error('导航到会议详情页失败:', err);
            uni.showToast({
              title: '打开详情失败',
              icon: 'none'
            });
          }
        });
      } else {
        // 如果未找到原始会议数据，给出提示
        uni.showToast({
          title: '未找到会议详情',
          icon: 'none'
        });
      }
    },
    // 格式化日程项
    formatScheduleItem(item) {
      // 确保有值
      if (!item) return null;
      
      console.log('格式化会议项，原始数据:', JSON.stringify(item));
      
      // 直接返回原始数据，不进行格式化
      return {
        id: item.id || '',
        topic: item.title || item.topic || '',
        startTime: item.start || item.startTime || '',
        endTime: item.end || item.endTime || '',
        status: item.status || '',
        statusText: item.status || '',
        reserveDate: item.date || item.reserveDate || '',
        title: item.title || item.topic || '',
        location: item.room || '',
        date: item.date || item.reserveDate || ''
      };
    },
    
    // 根据状态获取颜色
    getStatusColor(status) {
      if (!status) return '#1890ff';
      
      status = String(status).toLowerCase();
      
      switch(status) {
        case 'approved': 
        case '1': return '#52c41a'; // 绿色
        
        case 'pending': 
        case '0': return '#faad14';  // 黄色
        
        case 'rejected': 
        case '5': return '#f5222d'; // 红色
        
        case 'canceled': 
        case 'cancelled':
        case '4': return '#d9d9d9'; // 灰色
        
        case 'in-progress':
        case '2': return '#1890ff'; // 蓝色
        
        case 'completed':
        case '3': return '#722ed1'; // 紫色
        
        default: return '#1890ff'; // 蓝色
      }
    },
    // 初始化日程数据
    initScheduleData() {
      // 获取当前用户的所有日程
      api.meeting.getSchedule({
        pageNo: 1,
        pageSize: 50,
        startTime: this.getMonthStartDate(),
        endTime: this.getMonthEndDate()
      }).then(res => {
        if (res.code === 200 && res.data && res.data.list) {
          // 获取当前用户名
          const userInfo = uni.getStorageSync('userInfo');
          const currentUsername = userInfo?.username || '';
          console.log('当前用户名:', currentUsername);
          
          // 将每个会议转换为日程项
          const scheduleItems = res.data.list.map(this.formatScheduleItem);
          
          // 筛选出与当前用户相关的会议
          const userMeetings = scheduleItems.filter(item => {
            return item.booker === currentUsername || 
                  (item.participants && item.participants.some(p => p.username === currentUsername));
          });
          
          console.log('筛选后的用户会议:', userMeetings);
          
          // 设置日程数据
          this.events = userMeetings;
          this.allEvents = userMeetings;
          this.currentEvents = this.filterEventsByDate(this.selectedDate);
        }
      }).catch(err => {
        uni.showToast({
          title: '获取日程失败',
          icon: 'none'
        });
      });
    },
    // 获取今天的会议日程
    fetchTodaySchedules() {
      this.loading = true;
      
      // 获取今天的日期
      const today = new Date();
      const todayStr = today.getFullYear() + '-' + 
                     this.padZero(today.getMonth() + 1) + '-' + 
                     this.padZero(today.getDate());
      
      // 设置选中日期为今天
      this.selectedDate = todayStr;
      
      api.meeting.getSchedule({
        reserveDate: todayStr,
        startTime: '00:00:00',  // 这是查询参数，不是会议时间
        endTime: '23:59:59',    // 这是查询参数，不是会议时间
        pageSize: 100,
        pageNo: 1
      })
        .then(res => {
          if (res.code === 200) {
            let scheduleItems = [];
            
            try {
              if (res.data && Array.isArray(res.data)) {
                scheduleItems = res.data.map(item => this.formatScheduleItem(item));
              } else if (res.data && res.data.list && Array.isArray(res.data.list)) {
                scheduleItems = res.data.list.map(item => this.formatScheduleItem(item));
              } else {
                scheduleItems = [];
              }
            } catch (err) {
              scheduleItems = [];
            }
            
            // 只更新今天的事件
            this.todayEvents = scheduleItems;
            
            // 如果选中的是今天，更新事件列表
            if (this.selectedDate === todayStr) {
              this.filterEventsByDate(todayStr);
            }
          } else {
            uni.showToast({
              title: res.message || '获取今日日程失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          uni.showToast({
            title: '获取今日日程失败',
            icon: 'none'
          });
        })
        .finally(() => {
          this.loading = false;
      });
    },
  }
};
</script>

<style>
.schedule-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 100px; /* 增加底部间距，确保内容不会被底部导航遮挡 */
  box-sizing: border-box; /* 确保padding包含在宽高计算中 */
}

.calendar-wrapper {
  background-color: #fff;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box; /* 确保padding包含在宽高计算中 */
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
  height: 0;
  padding-bottom: 14.28%; /* 使用padding-bottom而不是aspect-ratio确保兼容性 */
  position: relative;
  box-sizing: border-box; /* 确保padding包含在宽高计算中 */
}

.day-number {
  font-size: 14px; /* 减小字体大小 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  margin: 0 10px 10px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box; /* 确保padding包含在宽高计算中 */
  overflow-y: auto; /* 添加滚动条确保内容过多时可以滚动 */
  max-height: 60vh; /* 限制最大高度 */
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
  padding: 12px;
  margin-bottom: 10px;
  border-left: 4px solid #3498db;
  box-sizing: border-box; /* 确保padding包含在宽高计算中 */
  word-break: break-all; /* 确保长文本会换行 */
  overflow: hidden; /* 防止内容溢出 */
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
  white-space: nowrap; /* 防止标题换行 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 显示省略号 */
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
  padding: 30px 0; /* 减少padding */
  box-sizing: border-box; /* 确保padding包含在宽高计算中 */
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