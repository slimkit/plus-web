<template>
  <Loadmore
    ref="loader"
    class="p-user-collect-feed"
    @refresh="onRefresh"
    @loadmore="onLoadmore"
  >
    <FeedList :feeds="feeds" @after-delete="afterDeleteFeed" />
  </Loadmore>
</template>

<script>
import _ from 'lodash'
import { limit } from '@/utils'
import FeedList from '@/components/feed/FeedList.vue'

export default {
  name: 'UserCollectFeed',
  components: {
    FeedList,
  },
  data () {
    return {
      feeds: [],
    }
  },
  methods: {
    async onRefresh () {
      const feeds = await this.fetchFeeds()
      this.feeds = feeds
      this.loader.afterRefresh(feeds.length < limit)
    },
    async onLoadmore () {
      const offset = this.feeds.length
      const feeds = await this.fetchFeeds(offset)
      this.feeds.push(...feeds)
      this.loader.afterLoadmore(feeds.length < limit)
    },
    async fetchFeeds (offset) {
      const params = {
        limit,
        offset,
      }
      return this.$axios.$get('/feeds/collections', { params })
    },
    afterDeleteFeed (feedId) {
      this.feeds = _.filter(this.feeds, feed => feed.id !== feedId)
    },
  },
}
</script>
