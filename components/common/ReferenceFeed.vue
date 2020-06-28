<template>
  <article class="c-reference-feed">
    <Spin v-if="loading" fix />

    <template v-if="notFound">
      该资源不存在或已被删除
    </template>
    <template v-else>
      <strong>{{ user.name }}：</strong>
      {{ feed.feed_content }}
      <span v-if="video || image" class="media">
        <template v-if="video">
          <svg class="icon"><use xlink:href="#icon-video" /></svg> 查看视频
        </template>
        <template v-if="image">
          <svg class="icon"><use xlink:href="#icon-image" /></svg> 查看图片
        </template>
      </span>
      <nuxt-link
        v-if="!noLink"
        class="link"
        :to="`/feed/${feed.id}`"
      />
    </template>
  </article>
</template>

<script>
export default {
  name: 'ReferenceFeed',
  props: {
    source: { type: Object, required: true },
    noLink: { type: Boolean, default: false },
  },
  data () {
    return {
      remoteFeed: null,

      notFound: false,
      loading: false,
    }
  },
  computed: {
    feed () {
      return this.remoteFeed || this.source
    },
    user () {
      return this.feed.user || {}
    },
    video () {
      return this.feed.video || null
    },
    image () {
      return (this.feed.images || []).length
    },
  },
  mounted () {
    if (!this.feed.user) this.fetchFeed()
  },
  methods: {
    async fetchFeed () {
      this.loading = true
      const { data: feed, status } = await this.$axios.get(`/feeds/${this.feed.id}`, {
        validateStatus: s => [200, 404].includes(s),
      })
      this.loading = false
      if (status === 404) {
        this.notFound = true
      } else {
        this.remoteFeed = feed
      }
    },
  },
}
</script>
