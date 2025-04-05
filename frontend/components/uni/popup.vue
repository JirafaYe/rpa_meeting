<template>
  <div class="uni-popup" v-if="showPopup">
    <div class="uni-popup-mask" @click="handleMaskClick"></div>
    <div class="uni-popup-content" :class="positionClass">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UniPopup',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'center' // center, top, bottom, left, right
    },
    maskClick: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showPopup: false
    }
  },
  computed: {
    positionClass() {
      return `uni-popup-${this.position}`
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.open()
      } else {
        this.close()
      }
    }
  },
  methods: {
    open() {
      this.showPopup = true
      this.$emit('open')
    },
    close() {
      this.showPopup = false
      this.$emit('close')
    },
    handleMaskClick() {
      if (this.maskClick) {
        this.close()
      }
    }
  }
}
</script>

<style>
.uni-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.uni-popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

.uni-popup-content {
  position: absolute;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.uni-popup-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 80%;
  max-height: 80%;
}

.uni-popup-top {
  top: 0;
  left: 0;
  right: 0;
  transform: translateY(0);
}

.uni-popup-bottom {
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(0);
}

.uni-popup-left {
  left: 0;
  top: 0;
  bottom: 0;
  max-width: 80%;
}

.uni-popup-right {
  right: 0;
  top: 0;
  bottom: 0;
  max-width: 80%;
}
</style> 