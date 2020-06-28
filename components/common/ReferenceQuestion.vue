<template>
  <article class="c-reference-question">
    <Spin v-if="loading" fix />

    <template v-if="notFound">
      该资源不存在或已被删除
    </template>
    <template v-else>
      <h3>{{ question.subject }}</h3>
      <p>{{ question.body }}</p>

      <nuxt-link
        v-if="!noLink"
        class="link"
        :to="`/question/${question.id}`"
      />
    </template>
  </article>
</template>

<script>
export default {
  name: 'ReferenceQuestion',
  props: {
    source: { type: Object, required: true },
    noLink: { type: Boolean, default: false },
  },
  data () {
    return {
      remoteQuestion: null,

      notFound: false,
      loading: false,
    }
  },
  computed: {
    question () {
      return this.remoteQuestion || this.source
    },
  },
  mounted () {
    if (!this.question.subject) this.fetchQuestion()
  },
  methods: {
    async fetchQuestion () {
      this.loading = true
      const { data: question, status } = await this.$axios.get(`/questions/${this.question.id}`, {
        validateStatus: s => [200, 404].includes(s),
      })
      this.loading = false
      if (status === 404) {
        this.notFound = true
      } else {
        this.remoteQuestion = question
      }
    },
  },
}
</script>
