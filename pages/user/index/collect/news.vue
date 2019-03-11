<template>
  <Loadmore
    ref="loader"
    class="p-user-collect-news"
    @refresh="onRefresh"
    @loadmore="onLoadmore"
  >
    <NewsList :news="news" />
  </Loadmore>
</template>

<script>
import { limit, getLastField } from '@/utils'
import NewsList from '@/components/news/NewsList.vue'

export default {
  name: 'UserCollectFeed',
  components: {
    NewsList,
  },
  data () {
    return {
      news: [],
    }
  },
  methods: {
    async onRefresh () {
      const params = { limit }
      this.news = await this.$axios.$get('/news/collections', { params })
      this.loader.afterRefresh(this.news.length < limit)
    },
    async onLoadmore () {
      const params = { limit, after: getLastField(this.news) }
      const news = await this.$axios.$get('/news/collections', { params })
      this.news.push(...news)
      this.loader.afterLoadmore(news.length < limit)
    },
  },
}
</script>
