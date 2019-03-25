<template>
  <ul class="c-question-topic-list">
    <QuestionTopicListItem
      v-for="topic in topics"
      :key="topic.id"
      :topic="topic"
    />
  </ul>
</template>

<script>
import QuestionTopicListItem from '@/components/question/QuestionTopicListItem.vue'

export default {
  name: 'QuestionList',
  components: {
    QuestionTopicListItem,
  },
  props: {
    topics: { type: Array, default: () => [] },
  },
}
</script>

<style lang="less" scoped>
.c-question-topic-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
  padding: 15px 0;
}
</style>
