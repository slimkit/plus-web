<template>
  <div class="c-side-widget">
    <h3 v-if="title" class="title">{{ title }}</h3>
    <div class="panel">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideWidget',
  props: {
    title: { type: String, required: true },
  },
}
</script>

<style lang="less" scoped>
.c-side-widget {
  background-color: #fff;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    .border(bottom);
  }

  .panel {
    padding: 12px;
    background-color: #fff;
  }
}
</style>
