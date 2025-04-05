<template>
  <view class="user-avatar" :class="[`size-${size}`, { clickable }]" @click="onClick">
    <template v-if="user.avatar">
      <image class="user-avatar__image" :src="user.avatar" mode="aspectFill"></image>
    </template>
    <template v-else>
      <view class="user-avatar__text" :style="{ backgroundColor: avatarColor }">
        {{ avatarText }}
      </view>
    </template>
    <view class="user-avatar__badge" v-if="badge">
      <view class="badge" :class="`badge-${badgeType}`">{{ badge }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UserAvatar',
  props: {
    user: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    badge: {
      type: [String, Number],
      default: ''
    },
    badgeType: {
      type: String,
      default: 'primary' // primary, success, warning, danger
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    avatarText() {
      if (!this.user.name) return '';
      return this.user.name.charAt(0);
    },
    avatarColor() {
      // 根据用户名生成固定颜色
      const colors = [
        '#3498db', // 蓝色
        '#2ecc71', // 绿色
        '#e74c3c', // 红色
        '#f39c12', // 橙色
        '#9b59b6', // 紫色
        '#1abc9c', // 青色
        '#34495e'  // 深灰色
      ];
      
      if (!this.user.name) return colors[0];
      
      // 使用名字的ASCII码总和作为索引
      const sum = this.user.name.split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      return colors[sum % colors.length];
    }
  },
  methods: {
    onClick() {
      if (this.clickable) {
        this.$emit('click', this.user);
      }
    }
  }
}
</script>

<style lang="scss">
.user-avatar {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  
  &.size-small {
    width: 30px;
    height: 30px;
    font-size: $font-size-mini;
  }
  
  &.size-medium {
    width: 40px;
    height: 40px;
    font-size: $font-size-small;
  }
  
  &.size-large {
    width: 60px;
    height: 60px;
    font-size: $font-size-large;
  }
  
  &.clickable {
    cursor: pointer;
  }
  
  &__image {
    width: 100%;
    height: 100%;
  }
  
  &__text {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
  }
  
  &__badge {
    position: absolute;
    bottom: 0;
    right: 0;
    
    .badge {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: $border-radius-circle;
      font-size: 10px;
      color: #fff;
      transform: translate(30%, 30%);
      
      &.badge-primary {
        background-color: $primary-color;
      }
      
      &.badge-success {
        background-color: $success-color;
      }
      
      &.badge-warning {
        background-color: $warning-color;
      }
      
      &.badge-danger {
        background-color: $danger-color;
      }
    }
  }
}
</style> 