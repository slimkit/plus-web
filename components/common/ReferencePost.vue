<template>
  <article class="c-reference-post">
    <ISpin v-if="loading" fix />

    <template v-if="notFound">
      该资源不存在或已被删除
    </template>
    <template v-else>
      <h3>{{ post.title }}</h3>
      <p class="text-cut-2">{{ post.summary }}</p>
      <AsyncFile
        v-if="post.image"
        class="image"
        type="image"
        :file="{id: post.image}"
        :max-height="200"
        :max-width="600"
        :quility="60"
      />
      <nuxt-link
        v-if="!noLink"
        class="link"
        :to="`/group/${post.group_id}/post/${post.id}`"
      />
    </template>
  </article>
</template>

<script>
export default {
  name: 'ReferencePost',
  props: {
    source: { type: Object, required: true },
    noLink: { type: Boolean, default: false },
  },
  data () {
    return {
      remotePost: null,

      notFound: false,
      loading: false,
    }
  },
  computed: {
    post () {
      return this.remotePost || this.source
    },
  },
  mounted () {
    if (!this.post.group_id) this.fetchPost()
  },
  methods: {
    async fetchPost () {
      this.loading = true
      const { data: posts, status } = await this.$axios.get('/group/simple-posts', {
        params: { id: this.post.id },
        validateStatus: s => [200, 404].includes(s),
      })
      this.loading = false
      if (status === 404) {
        this.notFound = true
      } else {
        this.remotePost = posts[0]
      }
    },
  },
}
</script>

<style lang="less" scoped>
.c-reference-post {
  .image {
    margin-top: 8px;
  }
}
</style>
