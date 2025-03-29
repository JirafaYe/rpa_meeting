<template>
  <view class="rpa-container">
    <view class="status-card">
      <view class="status-header">
        <text class="status-title">RPA 服务状态</text>
        <view class="status-indicator" :class="rpaStatus === 'running' ? 'status-running' : 'status-stopped'">
          <text>{{rpaStatus === 'running' ? '运行中' : '已停止'}}</text>
        </view>
      </view>
      <view class="status-actions">
        <button class="btn-action start" v-if="rpaStatus !== 'running'" @click="handleStartRpa">启动服务</button>
        <button class="btn-action stop" v-else @click="handleStopRpa">停止服务</button>
        <button class="btn-action restart" @click="handleRestartRpa">重启服务</button>
      </view>
      <view class="status-info">
        <view class="info-item">
          <text class="info-label">上次启动时间:</text>
          <text class="info-value">{{rpaInfo.lastStartTime}}</text>
        </view>
        <view class="info-item">
          <text class="info-label">运行时长:</text>
          <text class="info-value">{{rpaInfo.runningTime}}</text>
        </view>
        <view class="info-item">
          <text class="info-label">处理任务数:</text>
          <text class="info-value">{{rpaInfo.processedTasks}}</text>
        </view>
        <view class="info-item">
          <text class="info-label">RPA版本:</text>
          <text class="info-value">{{rpaInfo.version}}</text>
        </view>
      </view>
    </view>

    <!-- 任务配置卡片 -->
    <view class="config-card">
      <view class="card-header">
        <text class="card-title">任务配置</text>
      </view>
      <view class="card-body">
        <view class="form-group">
          <text class="form-label">执行间隔 (分钟)</text>
          <view class="input-row">
            <slider :value="config.interval" :min="1" :max="60" :step="1" show-value @change="intervalChange" />
            <input type="number" class="form-input narrow" v-model="config.interval" />
          </view>
        </view>

        <view class="form-group">
          <text class="form-label">每日执行时间范围</text>
          <view class="time-range">
            <view class="time-picker">
              <picker mode="time" :value="config.startTime" @change="startTimeChange" class="form-picker">
                <view class="picker-value">{{config.startTime}}</view>
              </picker>
            </view>
            <text class="time-separator">至</text>
            <view class="time-picker">
              <picker mode="time" :value="config.endTime" @change="endTimeChange" class="form-picker">
                <view class="picker-value">{{config.endTime}}</view>
              </picker>
            </view>
          </view>
        </view>

        <view class="form-group">
          <text class="form-label">最大重试次数</text>
          <input type="number" class="form-input" v-model="config.maxRetries" />
        </view>

        <view class="form-group">
          <text class="form-label">超时时间 (秒)</text>
          <input type="number" class="form-input" v-model="config.timeout" />
        </view>

        <view class="form-group">
          <text class="form-label">要执行的任务</text>
          <view class="checkbox-group">
            <view class="checkbox-item" v-for="(task, index) in tasks" :key="index">
              <checkbox :checked="task.enabled" @click="toggleTask(index)" />
              <text class="checkbox-label">{{task.name}}</text>
            </view>
          </view>
        </view>

        <view class="form-group">
          <text class="form-label">邮件通知</text>
          <switch :checked="config.emailNotification" @change="toggleEmailNotification" />
        </view>

        <view class="form-group" v-if="config.emailNotification">
          <text class="form-label">通知邮箱</text>
          <input type="text" class="form-input" v-model="config.notificationEmail" placeholder="输入接收通知的邮箱" />
        </view>

        <view class="form-actions">
          <button class="btn-save" @click="saveConfig">保存配置</button>
          <button class="btn-reset" @click="resetConfig">重置</button>
        </view>
      </view>
    </view>

    <!-- 任务记录 -->
    <view class="log-card">
      <view class="card-header">
        <text class="card-title">任务记录</text>
        <view class="header-actions">
          <button class="btn-small" @click="refreshLogs">刷新</button>
          <button class="btn-small" @click="clearLogs">清空</button>
        </view>
      </view>
      <view class="card-body">
        <view class="logs-list" v-if="logs.length > 0">
          <view class="log-item" v-for="(log, index) in logs" :key="index">
            <view class="log-header">
              <text class="log-time">{{log.time}}</text>
              <text class="log-status" :class="getStatusClass(log.status)">{{log.statusText}}</text>
            </view>
            <view class="log-content">
              <text class="log-title">{{log.title}}</text>
              <text class="log-message">{{log.message}}</text>
            </view>
          </view>
        </view>
        <view class="no-logs" v-else>
          <text>暂无任务记录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      rpaStatus: 'stopped', // 'running' 或 'stopped'
      rpaInfo: {
        lastStartTime: '2023-07-20 09:00:00',
        runningTime: '0小时',
        processedTasks: 0,
        version: '1.0.0'
      },
      config: {
        interval: 15,
        startTime: '08:00',
        endTime: '18:00',
        maxRetries: 3,
        timeout: 30,
        emailNotification: false,
        notificationEmail: ''
      },
      tasks: [
        { id: 1, name: '会议室自动预订', enabled: true },
        { id: 2, name: '会议提醒', enabled: true },
        { id: 3, name: '会议结束提醒', enabled: true },
        { id: 4, name: '会议记录整理', enabled: false },
        { id: 5, name: '会议室使用数据收集', enabled: true }
      ],
      logs: [
        {
          time: '2023-07-20 09:15:00',
          status: 'success',
          statusText: '成功',
          title: '会议室自动预订',
          message: '已成功为产品部预订明天10:00的会议室B'
        },
        {
          time: '2023-07-20 09:45:00',
          status: 'warning',
          statusText: '警告',
          title: '会议室自动预订',
          message: '预订会议室失败：所选时间段会议室已被占用'
        },
        {
          time: '2023-07-20 10:00:00',
          status: 'error',
          statusText: '错误',
          title: '会议提醒',
          message: '发送会议提醒失败：无法连接到邮件服务器'
        }
      ]
    }
  },
  onLoad() {
    this.checkRpaStatus();
    this.loadConfig();
  },
  methods: {
    checkRpaStatus() {
      // 模拟获取RPA状态
      uni.showLoading({
        title: '获取状态中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 实际项目中应该调用API获取RPA状态
        this.rpaStatus = 'stopped';
        
        if (this.rpaStatus === 'running') {
          // 更新运行时长
          this.startRpaTimer();
        }
      }, 500);
    },
    loadConfig() {
      // 模拟获取配置
      uni.showLoading({
        title: '加载配置中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 实际项目中应该调用API获取配置
        // 这里使用默认配置
      }, 500);
    },
    handleStartRpa() {
      uni.showModal({
        title: '确认启动',
        content: '确定要启动RPA服务吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '启动中...'
            });
            
            // 模拟启动RPA服务
            setTimeout(() => {
              uni.hideLoading();
              
              this.rpaStatus = 'running';
              this.rpaInfo.lastStartTime = new Date().toLocaleString('zh-CN', { hour12: false });
              this.rpaInfo.runningTime = '0小时';
              this.rpaInfo.processedTasks = 0;
              
              // 开始计时
              this.startRpaTimer();
              
              uni.showToast({
                title: 'RPA服务已启动',
                icon: 'success'
              });
              
              // 添加日志
              this.logs.unshift({
                time: new Date().toLocaleString('zh-CN', { hour12: false }),
                status: 'success',
                statusText: '成功',
                title: 'RPA服务',
                message: 'RPA服务已成功启动'
              });
            }, 1500);
          }
        }
      });
    },
    handleStopRpa() {
      uni.showModal({
        title: '确认停止',
        content: '确定要停止RPA服务吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '停止中...'
            });
            
            // 模拟停止RPA服务
            setTimeout(() => {
              uni.hideLoading();
              
              this.rpaStatus = 'stopped';
              
              // 停止计时
              if (this.rpaTimer) {
                clearInterval(this.rpaTimer);
                this.rpaTimer = null;
              }
              
              uni.showToast({
                title: 'RPA服务已停止',
                icon: 'success'
              });
              
              // 添加日志
              this.logs.unshift({
                time: new Date().toLocaleString('zh-CN', { hour12: false }),
                status: 'warning',
                statusText: '警告',
                title: 'RPA服务',
                message: 'RPA服务已停止'
              });
            }, 1500);
          }
        }
      });
    },
    handleRestartRpa() {
      uni.showModal({
        title: '确认重启',
        content: '确定要重启RPA服务吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '重启中...'
            });
            
            // 模拟重启RPA服务
            setTimeout(() => {
              // 先停止
              this.rpaStatus = 'stopped';
              
              // 停止计时
              if (this.rpaTimer) {
                clearInterval(this.rpaTimer);
                this.rpaTimer = null;
              }
              
              // 再启动
              setTimeout(() => {
                uni.hideLoading();
                
                this.rpaStatus = 'running';
                this.rpaInfo.lastStartTime = new Date().toLocaleString('zh-CN', { hour12: false });
                this.rpaInfo.runningTime = '0小时';
                
                // 开始计时
                this.startRpaTimer();
                
                uni.showToast({
                  title: 'RPA服务已重启',
                  icon: 'success'
                });
                
                // 添加日志
                this.logs.unshift({
                  time: new Date().toLocaleString('zh-CN', { hour12: false }),
                  status: 'success',
                  statusText: '成功',
                  title: 'RPA服务',
                  message: 'RPA服务已成功重启'
                });
              }, 1000);
            }, 1500);
          }
        }
      });
    },
    startRpaTimer() {
      // 简单模拟运行时长计算
      this.rpaStartTime = new Date();
      this.rpaTimer = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - this.rpaStartTime) / (1000 * 60 * 60));
        this.rpaInfo.runningTime = `${diff}小时`;
        
        // 模拟随机任务处理
        if (Math.random() > 0.7) {
          this.rpaInfo.processedTasks += 1;
          
          // 随机添加一条日志
          const tasks = ['会议室自动预订', '会议提醒', '会议结束提醒', '会议记录整理'];
          const taskIndex = Math.floor(Math.random() * tasks.length);
          const statusTypes = ['success', 'warning', 'error'];
          const statusTexts = ['成功', '警告', '错误'];
          const statusIndex = Math.floor(Math.random() * statusTypes.length);
          
          let message = '';
          if (statusTypes[statusIndex] === 'success') {
            message = `成功执行${tasks[taskIndex]}任务`;
          } else if (statusTypes[statusIndex] === 'warning') {
            message = `${tasks[taskIndex]}任务执行有警告`;
          } else {
            message = `${tasks[taskIndex]}任务执行失败`;
          }
          
          this.logs.unshift({
            time: new Date().toLocaleString('zh-CN', { hour12: false }),
            status: statusTypes[statusIndex],
            statusText: statusTexts[statusIndex],
            title: tasks[taskIndex],
            message: message
          });
        }
      }, 60000); // 每分钟更新一次
    },
    intervalChange(e) {
      this.config.interval = e.detail.value;
    },
    startTimeChange(e) {
      this.config.startTime = e.detail.value;
    },
    endTimeChange(e) {
      this.config.endTime = e.detail.value;
    },
    toggleTask(index) {
      this.tasks[index].enabled = !this.tasks[index].enabled;
    },
    toggleEmailNotification(e) {
      this.config.emailNotification = e.detail.value;
    },
    saveConfig() {
      uni.showLoading({
        title: '保存中...'
      });
      
      // 模拟保存配置
      setTimeout(() => {
        uni.hideLoading();
        
        // 实际项目中应该调用API保存配置
        uni.showToast({
          title: '配置已保存',
          icon: 'success'
        });
        
        // 添加日志
        this.logs.unshift({
          time: new Date().toLocaleString('zh-CN', { hour12: false }),
          status: 'success',
          statusText: '成功',
          title: 'RPA配置',
          message: 'RPA配置已成功更新'
        });
      }, 800);
    },
    resetConfig() {
      uni.showModal({
        title: '确认重置',
        content: '确定要重置所有配置为默认值吗？',
        success: (res) => {
          if (res.confirm) {
            // 重置为默认配置
            this.config = {
              interval: 15,
              startTime: '08:00',
              endTime: '18:00',
              maxRetries: 3,
              timeout: 30,
              emailNotification: false,
              notificationEmail: ''
            };
            
            // 重置任务状态
            this.tasks.forEach(task => {
              task.enabled = true;
            });
            
            uni.showToast({
              title: '配置已重置',
              icon: 'success'
            });
          }
        }
      });
    },
    refreshLogs() {
      uni.showLoading({
        title: '刷新中...'
      });
      
      // 模拟刷新日志
      setTimeout(() => {
        uni.hideLoading();
        
        // 实际项目中应该调用API获取最新日志
        uni.showToast({
          title: '日志已刷新',
          icon: 'success'
        });
      }, 500);
    },
    clearLogs() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空所有日志记录吗？',
        success: (res) => {
          if (res.confirm) {
            this.logs = [];
            
            uni.showToast({
              title: '日志已清空',
              icon: 'success'
            });
          }
        }
      });
    },
    getStatusClass(status) {
      const statusMap = {
        'success': 'status-success',
        'warning': 'status-warning',
        'error': 'status-error'
      };
      return statusMap[status] || '';
    }
  },
  onUnload() {
    // 停止计时器
    if (this.rpaTimer) {
      clearInterval(this.rpaTimer);
      this.rpaTimer = null;
    }
  }
}
</script>

<style>
.rpa-container {
  padding: 15px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 状态卡片样式 */
.status-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  padding: 15px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.status-indicator {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  color: #fff;
}

.status-running {
  background-color: #2ecc71;
}

.status-stopped {
  background-color: #e74c3c;
}

.status-actions {
  display: flex;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-action {
  flex: 1;
  min-width: 80px;
  height: 40px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
}

.start {
  background-color: #2ecc71;
}

.stop {
  background-color: #e74c3c;
}

.restart {
  background-color: #3498db;
}

.status-info {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 10px;
}

.info-item {
  display: flex;
  margin-bottom: 5px;
}

.info-label {
  width: 120px;
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

/* 配置卡片样式 */
.config-card, .log-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.card-header {
  background-color: #f8f9fa;
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn-small {
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 4px;
  background-color: #3498db;
  color: #fff;
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
  font-size: 14px;
  color: #333;
}

.form-input {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 14px;
  background-color: #f9f9f9;
}

.form-input.narrow {
  width: 60px;
  text-align: center;
  margin-left: 10px;
}

.input-row {
  display: flex;
  align-items: center;
  width: 100%;
}

.time-range {
  display: flex;
  align-items: center;
}

.time-picker {
  flex: 1;
  max-width: 45%;
}

.time-separator {
  margin: 0 10px;
  color: #333;
}

.form-picker {
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
  padding: 0 15px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-right: 15px;
  margin-bottom: 10px;
  width: 45%;
}

.checkbox-label {
  margin-left: 5px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
}

.btn-save, .btn-reset {
  padding: 0 20px;
  height: 40px;
  border-radius: 4px;
  color: #fff;
}

.btn-save {
  background-color: #3498db;
}

.btn-reset {
  background-color: #95a5a6;
}

/* 日志样式 */
.logs-list {
  max-height: 400px;
  overflow-y: auto;
}

.log-item {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.log-item:last-child {
  border-bottom: none;
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.log-time {
  font-size: 12px;
  color: #777;
}

.log-status {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
  color: #fff;
}

.status-success {
  background-color: #2ecc71;
}

.status-warning {
  background-color: #f39c12;
}

.status-error {
  background-color: #e74c3c;
}

.log-content {
  padding-left: 5px;
}

.log-title {
  font-weight: bold;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.log-message {
  font-size: 13px;
  color: #666;
}

.no-logs {
  text-align: center;
  padding: 30px 0;
  color: #999;
  font-style: italic;
}

@media (max-width: 768px) {
  .checkbox-item {
    width: 100%;
  }
  
  .status-actions {
    flex-direction: column;
  }
  
  .btn-action {
    flex: none;
    width: 100%;
  }
  
  .time-range {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .time-picker {
    max-width: 100%;
    width: 100%;
    margin-bottom: 10px;
  }
  
  .time-separator {
    display: none;
  }
}
</style> 