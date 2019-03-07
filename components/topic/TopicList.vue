<template>
  <ul class="c-topic-list">
    <TopicListItem
      v-for="topic in topics"
      :key="topic.id"
      :topic="topic"
      :height="180"
    />
  </ul>
</template>

<script>
import TopicListItem from './TopicListItem.vue'

export default {
  name: 'TopicList',
  components: {
    TopicListItem,
  },
  props: {
    topics: { type: Array, default: () => [] },
  },
}
</script>

<style lang="less" scoped>
.c-topic-list{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;

  .c-topic-list-item {
    height: 180px;
  }
}
</style>
