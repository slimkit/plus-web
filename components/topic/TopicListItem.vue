<template>
  <li class="c-topic-list-item">
    {{ topic.name }}
  </li>
</template>

<script>
export default {
  name: 'TopicListItem',
  props: {
    topic: { type: Object, required: true },
  },
}
</script>

<style lang="less" scoped>
.c-topic-list-item {

}
</style>
