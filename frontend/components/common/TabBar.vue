<template>
  <view class="tab-bar">
    <view 
      class="tab-bar__item" 
      v-for="(item, index) in tabs" 
      :key="index"
      :class="{ active: currentTab === item.value }"
      @click="onTabClick(item.value)"
    >
      <text class="tab-bar__icon iconfont" :class="item.icon"></text>
      <text class="tab-bar__text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TabBar',
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentTab: this.value
    };
  },
  watch: {
    value(newVal) {
      this.currentTab = newVal;
    }
  },
  methods: {
    onTabClick(value) {
      if (this.currentTab !== value) {
        this.currentTab = value;
        this.$emit('input', value);
        this.$emit('change', value);
      }
    }
  }
}
</script>

<style lang="scss">
.tab-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $bg-color-white;
  border-top: 1px solid $border-color;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 99;
  
  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-small 0;
    
    &.active {
      color: $primary-color;
    }
  }
  
  &__icon {
    font-size: 20px;
    margin-bottom: 2px;
  }
  
  &__text {
    font-size: $font-size-mini;
  }
}
</style>