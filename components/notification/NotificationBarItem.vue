<template>
  <li class="c-notification-bar-item">
    <div class="logo-wrap">
      <slot />
    </div>
    <i v-if="badge" class="badge">{{ badge | max(99) }}</i>
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
  .badge {
    position: absolute;
    right: 4px;
    top: 4px;
  }
}
</style>
