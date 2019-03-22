<template>
  <article class="c-reference-comment">
    <ISpin v-if="loading" fix />

    <template v-if="notFound">
      该资源不存在或已被删除
    </template>
    <template v-else>
      {{ comment.body }}
      <nuxt-link
        v-if="!noLink"
        class="link"
        :to="jumpRoute"
      />
    </template>
  </article>
</template>

<script>
export default {
  name: 'ReferenceComment',
  props: {
    source: { type: Object, required: true },
    noLink: { type: Boolean, default: false },
  },
  data () {
    return {
      remoteComment: null,

      notFound: false,
      loading: false,
    }
  },
  computed: {
    comment () {
      return this.remoteComment || this.source
    },
    jumpRoute () {
      const { resourceable } = this.comment
      switch (resourceable.type) {
        case 'feeds':
          return `/feed/${resourceable.id}`
      }
      return 'javascript:;'
    },
  },
  mounted () {
    this.fetchComment()
  },
  methods: {
    async fetchComment () {
      this.loading = true
      const { data: comments, status } = await this.$axios.get('/comments', {
        params: { id: this.comment.id },
        validateStatus: s => [200, 404].includes(s),
      })
      this.loading = false
      if (status === 404) {
        this.notFound = true
      } else {
        this.remoteComment = comments[0]
      }
    },
  },
}
</script>
