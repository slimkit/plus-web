<template>
  <ul class="c-topic-list">
    <TopicListItem
      v-for="topic in topics"
      :key="topic.id"
      :topic="topic"
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

}
</style>
