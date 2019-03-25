<template>
  <ul class="c-question-list">
    <QuestionListItem
      v-for="question in questions"
      :key="question.id"
      :question="question"
    />
  </ul>
</template>

<script>
import QuestionListItem from '@/components/question/QuestionListItem.vue'

export default {
  name: 'QuestionList',
  components: {
    QuestionListItem,
  },
  props: {
    questions: { type: Array, default: () => [] },
  },
}
</script>

<style lang="less" scoped>
.c-question-list {}
</style>
