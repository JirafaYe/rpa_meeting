<template>
  <view class="room-card">
    <view class="room-card__image">
      <text class="iconfont icon-meeting-room"></text>
    </view>
    <view class="room-card__details">
      <view class="room-card__name">{{ room.name }}</view>
      <view class="room-card__capacity">
        <text class="iconfont icon-user"></text>
        <text>{{ room.capacity }}人</text>
      </view>
      <view class="room-card__equipment" v-if="room.equipment && room.equipment.length">
        <text class="iconfont icon-equipment"></text>
        <text>{{ equipmentText }}</text>
      </view>
      <view class="room-card__status">
        <view class="badge" :class="`badge-${room.status}`">{{ statusText }}</view>
      </view>
      <view class="room-card__actions" v-if="showActions">
        <button class="btn btn-primary" size="mini" @click="onBook">预约</button>
        <button class="btn btn-info" size="mini" @click="onDetail">详情</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'RoomCard',
  props: {
    room: {
      type: Object,
      required: true
    },
    showActions: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    statusText() {
      const statusMap = {
        'available': '可用',
        'maintenance': '维护中',
        'occupied': '使用中',
        'unavailable': '不可用'
      };
      return statusMap[this.room.status] || '未知';
    },
    equipmentText() {
      if (!this.room.equipment || !this.room.equipment.length) {
        return '无';
      }
      return this.room.equipment.join(', ');
    }
  },
  methods: {
    onBook() {
      this.$emit('book', this.room);
    },
    onDetail() {
      this.$emit('detail', this.room);
    }
  }
}
</script>

<style lang="scss">
.room-card {
  display: flex;
  background-color: $bg-color-white;
  border-radius: $border-radius-base;
  margin-bottom: $spacing-base;
  box-shadow: $box-shadow;
  overflow: hidden;
  
  &__image {
    width: 120px;
    height: 120px;
    background-color: $bg-color-grey;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .iconfont {
      font-size: 40px;
      color: #aaa;
    }
  }
  
  &__details {
    flex: 1;
    padding: $spacing-base;
    position: relative;
  }
  
  &__name {
    font-size: $font-size-medium;
    font-weight: bold;
    margin-bottom: $spacing-mini;
    color: $text-color;
  }
  
  &__capacity {
    display: flex;
    align-items: center;
    font-size: $font-size-small;
    color: $text-color-secondary;
    margin-bottom: $spacing-mini;
    
    .iconfont {
      margin-right: 5px;
    }
  }
  
  &__equipment {
    display: flex;
    align-items: center;
    font-size: $font-size-small;
    color: $text-color-secondary;
    margin-bottom: $spacing-mini;
    
    .iconfont {
      margin-right: 5px;
    }
  }
  
  &__status {
    .badge {
      display: inline-block;
      font-size: $font-size-mini;
      padding: 2px 6px;
      border-radius: $border-radius-small;
      
      &.badge-available {
        background-color: $success-color;
        color: #fff;
      }
      
      &.badge-maintenance {
        background-color: $warning-color;
        color: #fff;
      }
      
      &.badge-occupied {
        background-color: $primary-color;
        color: #fff;
      }
      
      &.badge-unavailable {
        background-color: $danger-color;
        color: #fff;
      }
    }
  }
  
  &__actions {
    display: flex;
    gap: $spacing-small;
    margin-top: $spacing-small;
  }
}
</style> 