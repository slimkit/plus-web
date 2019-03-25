<template>
  <div class="p-question-topic-detail">
    1
  </div>
</template>

<script>
export default {
  name: 'QuestionTopicDetail',
  validate ({ params }) {
    return /^\d+$/.test(params.topicId)
  },
}
</script>

<style lang="less" scoped>
.p-question-topic-detail {}
</style>
