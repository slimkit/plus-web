<template>
  <ul class="c-anser-list">
    <AnswerListItem
      v-for="answer in answers"
      :key="answer.id"
      :answer="answer"
      v-bind="$attrs"
      v-on="$listeners"
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
