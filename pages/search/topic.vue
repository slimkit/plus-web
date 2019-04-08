<template>
  <div class="p-search-topic">
    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <TopicList v-if="list.length" :topics="list" />

      <div v-else-if="!searchLock" v-empty:search />
    </Loadmore>
  </div>
</template>

<script>
import { limit, getLastField } from '@/utils'
import TopicList from '@/components/topic/TopicList.vue'

export default {
  name: 'SearchTopic',
  components: {
    TopicList,
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
      const params = { q: this.keyword, limit }
      this.searchLock = true
      const list = await this.$axios.$get('/feed/topics', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { q: this.keyword, limit, index: getLastField(this.list) }
      this.searchLock = true
      const list = await this.$axios.$get('/feed/topics', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
  },
}
</script>
