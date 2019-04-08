<template>
  <div class="p-search-feed">
    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <FeedList v-if="list.length" :feeds="list" />

      <div v-else-if="!searchLock" v-empty:search />
    </Loadmore>
  </div>
</template>

<script>
import { limit, getLastField } from '@/utils'
import FeedList from '@/components/feed/FeedList.vue'

export default {
  name: 'SearchFeed',
  components: {
    FeedList,
  },
  data () {
    return {
      list: [],

      searchLock: false,
    }
  },
  computed: {
    keyword () {
      return this.$parent.keyword
    },
  },
  watch: {
    keyword () {
      this.loader.beforeRefresh()
    },
  },
  methods: {
    async onRefresh () {
      const params = { search: this.keyword, limit }
      this.searchLock = true
      const { feeds } = await this.$axios.$get('/feeds', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list = feeds
      this.loader.afterRefresh(feeds.length < limit)
    },
    async onLoadmore () {
      const params = { search: this.keyword, limit, after: getLastField(this.list) }
      this.searchLock = true
      const { feeds } = await this.$axios.$get('/feeds', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list.push(...feeds)
      this.loader.afterLoadmore(feeds.length < limit)
    },
  },
}
</script>
