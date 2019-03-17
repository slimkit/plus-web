<template>
  <li class="c-notification-bar-item">
    <div class="logo-wrap">
      <slot />
    </div>
    <i v-if="badge">{{ badge | max(99) }}</i>
  </li>
</template>

<script>
export default {
  name: 'NotificationBarItem',
  filters: {
    max (val, limit = 99) {
      return val < limit ? val : limit
    },
  },
  props: {
    badge: { type: Number, default: 0 },
  },
}
</script>

<style lang="less" scoped>
.c-notification-bar-item {
  position: relative;

  .logo-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    font-size: 120%;
  }

  > i {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 4px;
    top: 4px;
    width: 16px;
    height: 16px;
    border-radius: 10px;
    border: 1px solid #fff;
    background-color: @error-color;
    color: #fff;
    font-size: @font-size-small * .8;
  }
}
</style>
