<template>
  <article class="c-reference-answer">
    <Spin v-if="loading" fix />

    <template v-if="notFound">
      该资源不存在或已被删除
    </template>
    <template v-else>
      <h3>{{ question.subject }}</h3>
      <p>{{ user.name || '(匿名)' }}: {{ answer.body }}</p>

      <nuxt-link
        v-if="!noLink"
        class="link"
        :to="`/question/${answer.question_id}/answer/${answer.id}`"
      />
    </template>
  </article>
</template>

<script>
export default {
  name: 'ReferenceAnswer',
  props: {
    source: { type: Object, required: true },
    noLink: { type: Boolean, default: false },
  },
  data () {
    return {
      remoteAnswer: null,

      notFound: false,
      loading: false,
    }
  },
  computed: {
    answer () {
      return this.remoteAnswer || this.source
    },
    question () {
      return this.answer.question || {}
    },
    user () {
      return this.answer.user || {}
    },
  },
  mounted () {
    if (!this.answer.question_id) this.fetchAnswer()
  },
  methods: {
    async fetchAnswer () {
      this.loading = true
      const { data: answer, status } = await this.$axios.get(`/question-answers/${this.answer.id}`, {
        validateStatus: s => [200, 404].includes(s),
      })
      this.loading = false
      if (status === 404) {
        this.notFound = true
      } else {
        this.remoteAnswer = answer
      }
    },
  },
}
</script>
