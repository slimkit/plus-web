<template>
  <div class="p-search-question">
    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <QuestionList v-if="list.length" :questions="list" />

      <div v-else-if="!searchLock" v-empty:search />
    </Loadmore>
  </div>
</template>

<script>
import { limit } from '@/utils'
import QuestionList from '@/components/question/QuestionList.vue'

export default {
  name: 'SearchQuestion',
  components: {
    QuestionList,
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
      const params = { subject: this.keyword, limit }
      this.searchLock = true
      const list = await this.$axios.$get('/questions', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { subject: this.keyword, limit, offset: this.list.length }
      this.searchLock = true
      const list = await this.$axios.$get('/questions', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
  },
}
</script>
