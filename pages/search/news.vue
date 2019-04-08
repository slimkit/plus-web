<template>
  <div class="p-search-news">
    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <NewsList v-if="list.length" :news="list" />

      <div v-else-if="!searchLock" v-empty:search />
    </Loadmore>
  </div>
</template>

<script>
import { limit, getLastField } from '@/utils'
import NewsList from '@/components/news/NewsList.vue'

export default {
  name: 'SearchNews',
  components: {
    NewsList,
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
      const params = { key: this.keyword, limit }
      this.searchLock = true
      const list = await this.$axios.$get('/news', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { key: this.keyword, limit, after: getLastField(this.list) }
      this.searchLock = true
      const list = await this.$axios.$get('/news', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
  },
}
</script>
