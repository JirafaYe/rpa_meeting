<template>
  <view class="meeting-card" :class="[`status-${meeting.status}`, { 'border-left': borderLeft }]">
    <view class="meeting-card__body">
      <view class="meeting-card__header">
        <text class="meeting-card__title">{{ meeting.title }}</text>
        <view class="meeting-card__badge" :class="`badge-${meeting.status}`">
          {{ statusText }}
        </view>
      </view>
      
      <view class="meeting-card__info">
        <view class="meeting-card__info-item">
          <text class="iconfont icon-calendar"></text>
          <text class="meeting-card__info-text">{{ meeting.date }}</text>
        </view>
        <view class="meeting-card__info-item">
          <text class="iconfont icon-clock"></text>
          <text class="meeting-card__info-text">{{ meeting.startTime }} - {{ meeting.endTime }}</text>
        </view>
        <view class="meeting-card__info-item">
          <text class="iconfont icon-location"></text>
          <text class="meeting-card__info-text">{{ meeting.room }}</text>
        </view>
        <view class="meeting-card__info-item" v-if="meeting.organizer">
          <text class="iconfont icon-user"></text>
          <text class="meeting-card__info-text">{{ meeting.organizer }} {{ meeting.attendees ? `及其他${meeting.attendees}人` : '' }}</text>
        </view>
      </view>
      
      <view class="meeting-card__actions" v-if="showActions">
        <button class="btn btn-primary" size="mini" @click="onDetail">查看详情</button>
        <button class="btn btn-danger" size="mini" @click="onCancel">取消会议</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MeetingCard',
  props: {
    meeting: {
      type: Object,
      required: true
    },
    borderLeft: {
      type: Boolean,
      default: true
    },
    showActions: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    statusText() {
      const statusMap = {
        'pending': '待审批',
        'approved': '已通过',
        'rejected': '已拒绝',
        'confirmed': '已确认',
        'waiting': '待确认',
        'canceled': '已取消'
      };
      return statusMap[this.meeting.status] || '未知';
    }
  },
  methods: {
    onDetail() {
      this.$emit('detail', this.meeting);
    },
    onCancel() {
      this.$emit('cancel', this.meeting);
    }
  }
}
</script>

<style lang="scss">
.meeting-card {
  background-color: $bg-color-white;
  border-radius: $border-radius-base;
  margin-bottom: $spacing-base;
  box-shadow: $box-shadow;
  overflow: hidden;
  
  &.border-left {
    &.status-pending, &.status-waiting {
      border-left: $meeting-warning-border;
    }
    &.status-approved, &.status-confirmed {
      border-left: $meeting-success-border;
    }
    &.status-rejected, &.status-canceled {
      border-left: $meeting-primary-border;
    }
  }
  
  &__body {
    padding: $spacing-base;
  }
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-small;
  }
  
  &__title {
    font-size: $font-size-medium;
    font-weight: bold;
    color: $text-color;
  }
  
  &__badge {
    font-size: $font-size-mini;
    padding: 2px 6px;
    border-radius: $border-radius-small;
    
    &.badge-pending, &.badge-waiting {
      background-color: $warning-color;
      color: #fff;
    }
    
    &.badge-approved, &.badge-confirmed {
      background-color: $success-color;
      color: #fff;
    }
    
    &.badge-rejected, &.badge-canceled {
      background-color: $danger-color;
      color: #fff;
    }
  }
  
  &__info {
    margin-bottom: $spacing-small;
  }
  
  &__info-item {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-mini;
    font-size: $font-size-small;
    color: $text-color-secondary;
    
    .iconfont {
      margin-right: 5px;
      width: 16px;
      text-align: center;
    }
  }
  
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-small;
  }
}
</style> 