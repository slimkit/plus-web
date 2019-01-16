<template>
  <div class="p-user-feed">
    <nav class="cate-wrap">
      <span>全部</span>
    </nav>

    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <FeedList :feeds="feeds" />
    </Loadmore>
  </div>
</template>

<script>
import { limit, getLastField } from '@/utils'
import FeedList from '@/components/feed/FeedList.vue'

export default {
  name: 'UserFeed',
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
      const { feeds } = await this.fetchFeeds()
      this.feeds = feeds
      this.loader.afterRefresh(feeds.length < limit)
    },
    async onLoadmore () {
      const after = getLastField(this.feeds, 'id')
      const { feeds } = await this.fetchFeeds(after)
      this.feeds.push(...feeds)
      this.loader.afterLoadmore(feeds.length < limit)
    },
    async fetchFeeds (after) {
      const params = {
        type: 'users',
        limit,
        after,
      }
      return this.$axios.$get('/feeds', { params })
    },
  },
}
</script>

<style lang="less" scoped>
.p-user-feed {
  .cate-wrap {
    margin-bottom: 16px;
  }
}
</style>
