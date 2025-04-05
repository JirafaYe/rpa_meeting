<template>
  <view class="uni-load-more">
    <view v-if="status === 'loading'" class="uni-load-more__img">
      <view class="uni-load-more__dot"></view>
      <view class="uni-load-more__dot"></view>
      <view class="uni-load-more__dot"></view>
    </view>
    <text class="uni-load-more__text">{{ text }}</text>
  </view>
</template>

<script>
export default {
  name: 'UniLoadMore',
  props: {
    status: {
      // 上拉加载的状态：more-加载前；loading-加载中；noMore-没有更多数据
      type: String,
      default: 'more'
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    contentText: {
      type: Object,
      default () {
        return {
          contentdown: '上拉显示更多',
          contentrefresh: '正在加载...',
          contentnomore: '没有更多数据了'
        }
      }
    }
  },
  computed: {
    text () {
      if (this.status === 'more') {
        return this.contentText.contentdown
      } else if (this.status === 'loading') {
        return this.contentText.contentrefresh
      } else {
        return this.contentText.contentnomore
      }
    }
  }
}
</script>

<style>
.uni-load-more {
  display: flex;
  flex-direction: row;
  height: 40px;
  align-items: center;
  justify-content: center;
}

.uni-load-more__text {
  font-size: 15px;
  color: #999;
}

.uni-load-more__img {
  margin-right: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.uni-load-more__dot {
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background-color: #999;
  animation: load 1s ease infinite;
}

.uni-load-more__dot:nth-child(2) {
  animation-delay: 0.2s;
}

.uni-load-more__dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes load {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style> 