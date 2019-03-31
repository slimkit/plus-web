<template>
  <ul class="c-anser-list">
    <AnswerListItem
      v-for="(answer, index) in answers"
      :key="answer.id"
      :answer="answer"
      v-bind="$attrs"
      @delete="answerId => onDelete(answerId, index)"
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
  methods: {
    onDelete (answerId, index) {
      this.$emit('delete', answerId, index)
    },
  },
}
</script>
