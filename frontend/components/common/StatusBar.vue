<template>
  <view class="status-bar">
    <view class="status-bar__time">{{ currentTime }}</view>
    <view class="status-bar__icons">
      <text class="iconfont icon-signal"></text>
      <text class="iconfont icon-wifi"></text>
      <text class="iconfont icon-battery"></text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'StatusBar',
  data() {
    return {
      currentTime: '00:00'
    };
  },
  mounted() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 60000); // 每分钟更新一次
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    updateTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      this.currentTime = `${hours}:${minutes}`;
    }
  }
}
</script>

<style lang="scss">
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: #222;
  color: white;
  font-size: $font-size-mini;
  
  &__time {
    font-weight: bold;
  }
  
  &__icons {
    display: flex;
    align-items: center;
    
    .iconfont {
      margin-left: 5px;
    }
  }
}
</style> 