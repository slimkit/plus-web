<template>
  <div class="p-user-feed">
    <nav class="cate-wrap">
      <span>全部</span>
    </nav>

    <Loadmore
      ref="loadmore"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <FeedList :feeds="feeds" />
    </Loadmore>
  </div>
</template>

<script>
import _ from 'lodash'
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
      const params = {
        type: 'users',
        limit,
      }
      const { feeds, pinned } = await this.$axios.$get('/feeds', { params })
      pinned.forEach(item => void (item.pinned = true))
      this.feeds = _.unionBy(pinned, feeds, 'id')
      this.$refs.loadmore.afterRefresh(feeds.length < limit)
    },
    async onLoadmore () {
      const params = {
        type: 'users',
        limit,
        after: getLastField(this.feeds, 'id'),
      }
      const { feeds } = await this.$axios.$get('/feeds', { params })
      this.feeds.push(...feeds)
      this.$refs.loadmore.afterLoadmore(feeds.length < limit)
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
