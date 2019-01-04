<template>
  <div class="c-progress" :class="wrapClass" />
</template>

<script>
export default {
  name: 'Progress',
  data () {
    return {
      show: false,
      success: false,
      failed: false,
      timeout: 10000, // 10s
      duration: 500,
    }
  },
  computed: {
    wrapClass () {
      return {
        show: this.show,
        progress: !this.failed && !this.success,
        failed: this.failed,
      }
    },
  },
  methods: {
    start () {
      this.show = true
    },
    finish () {
      this.fadeout()
    },
    fail () {
      this.failed = true
      this.fadeout()
    },
    fadeout () {
      setTimeout(() => {
        this.show = false
        setTimeout(() => {
          this.reset()
        }, 400)
      }, this.duration)
    },
    reset () {
      this.failed = false
    },
  },
}
</script>

<style lang="less" scoped>
.c-progress {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  height: 2px;
  width: 100%;
  opacity: 0;
  transition: background-color 0.1s, opacity 0.4s;
  z-index: @zindex-loading-bar;

  &.show {
    opacity: 1;
  }

  &.progress {
    animation: progressFlash 1s infinite;
  }

  &.failed {
    background-color: @error-color;
    box-shadow: 0 1px 1px tint(@error-color, 90%);
  }
}
</style>

<style lang="less">
@keyframes progressFlash {
  0%, 100% {
    background-color: tint(@primary-color, 80%);
  }
  50% {
    background-color: @primary-color;
  }
}
</style>
