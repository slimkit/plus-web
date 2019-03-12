<template>
  <article class="c-reference-news">
    <ISpin v-if="loading" fix />

    <template v-if="notFound">
      该资源不存在或已被删除
    </template>
    <template v-else>
      <div class="news-container">
        <AsyncFile
          v-if="news.image"
          type="image-wrap"
          :file="news.image"
          class="image"
          :max-height="120"
          :max-width="160"
        />

        <div class="news-info">
          <h3>{{ news.title }}</h3>
          <p class="text-cut-2">{{ news.subject }}</p>
          <p class="more">
            <span class="category">{{ (news.category || {}).name }}</span>
            {{ news.author }} ·
            {{ news.hits }}浏览 ·
            {{ news.created_at|fromNow({full: true}) }}
          </p>
        </div>
      </div>

      <nuxt-link
        v-if="!noLink"
        class="link"
        :to="`/news/${news.id}`"
      />
    </template>
  </article>
</template>

<script>
export default {
  name: 'ReferenceNews',
  props: {
    source: { type: Object, required: true },
    noLink: { type: Boolean, default: false },
  },
  data () {
    return {
      remoteNews: null,

      notFound: false,
      loading: false,
    }
  },
  computed: {
    news () {
      return this.remoteNews || this.source
    },
  },
  mounted () {
    if (!this.news.user) this.fetchNews()
  },
  methods: {
    async fetchNews () {
      this.loading = true
      const { data: news, status } = await this.$axios.get(`/news/${this.news.id}`, {
        validateStatus: s => [200, 404].includes(s),
      })
      this.loading = false
      if (status === 404) {
        this.notFound = true
      } else {
        this.remoteNews = news
      }
    },
  },
}
</script>

<style lang="less" scoped>
.c-reference-news {
  max-height: 160px;

  .news-container {
    display: flex;

    .image {
      flex: none;
      width: 160px;
      height: 120px;
      margin-right: 12px;
    }

    .news-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .category {
        padding: 0 2px;
        margin-right: 4px;
        border: 1px solid @primary-color;
        border-radius: @border-radius-small;
        color: @primary-color;
      }

      .more {
        font-size: @font-size-small;
        color: @disabled-color;
      }
    }
  }
}
</style>
