<template>
  <div class="p-user-news">
    <nav class="cate-wrap">
      <span>TA的资讯</span>
    </nav>

    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <NewsList :news="news" />
    </Loadmore>
  </div>
</template>

<script>
import { limit, getLastField } from '@/utils'
import UserNews from '../index/news.vue'

export default {
  extends: UserNews,
  data: function () {
    return {
      all: [],
    }
  },
  computed: {
    type () { return 'all' },
  },
  methods: {
    async onRefresh () {
      const params = { limit, user: this.$parent.user.id }
      this.news = await this.$axios.$get('/user/news/contributes', { params })
      this.loader.afterRefresh(this.news.length < limit)
    },
    async onLoadmore () {
      const params = { limit, user: this.$parent.user.id, after: getLastField(this.news) }
      const news = await this.$axios.$get('/user/news/contributes', { params })
      this.news.push(...news)
      this.loader.afterLoadmore(news.length < limit)
    },
  },
}
</script>
