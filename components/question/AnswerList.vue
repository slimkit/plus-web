<template>
  <ul class="c-anser-list">
    <AnswerListItem
      v-for="answer in answers"
      :key="answer.id"
      v-bind="$attrs"
      :answer="answer"
    />
  </ul>
</template>

<script>
import AnswerListItem from './AnswerListItem.vue'

export default {
  name: 'AnswerList',
  components: {
    AnswerListItem,
  },
  props: {
    answers: { type: Array, default: () => [] },
  },
}
</script>
