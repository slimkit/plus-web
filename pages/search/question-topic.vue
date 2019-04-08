<template>
  <div class="p-search-question-topic">
    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <QuestionTopicList v-if="list.length" :topics="list" />

      <div v-else-if="!searchLock" v-empty:search />
    </Loadmore>
  </div>
</template>

<script>
import { limit } from '@/utils'
import QuestionTopicList from '@/components/question/QuestionTopicList.vue'

export default {
  name: 'SearchQuestionTopic',
  components: {
    QuestionTopicList,
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
      const params = { name: this.keyword, limit }
      this.searchLock = true
      const list = await this.$axios.$get('/question-topics', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { name: this.keyword, limit, offset: this.list.length }
      this.searchLock = true
      const list = await this.$axios.$get('/question-topics', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
  },
}
</script>
