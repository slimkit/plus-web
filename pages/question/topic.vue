<template>
  <div class="p-question-topic">
    <nav class="nav">
      <nuxt-link :class="{'exact-active': type === 'all'}" :to="{query: {type: 'all'}}">全部专题</nuxt-link>
      <nuxt-link
        v-if="logged"
        :class="{'exact-active': type === 'follow'}"
        :to="{query: {type: 'follow'}}"
      >
        我关注的
      </nuxt-link>
    </nav>

    <main>
      <Loadmore
        ref="loader"
        @refresh="onRefresh"
        @loadmore="onLoadmore"
      >
        <QuestionTopicList :topics="topics" />
      </Loadmore>
    </main>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getLastField } from '@/utils'
import QuestionTopicList from '@/components/question/QuestionTopicList.vue'

export default {
  name: 'QuestionIndex',
  components: {
    QuestionTopicList,
  },
  computed: {
    ...mapState('question', {
      all: 'topics',
      follow: 'followedTopics',
    }),
    type () {
      return this.$route.query.type || 'all'
    },
    topics () {
      return this[this.type] || this.all
    },
  },
  watch: {
    type () {
      this.loader.beforeRefresh()
    },
  },
  methods: {
    ...mapActions('question', {
      getQuestionTopicList: 'getQuestionTopicList',
      getFollowedTopicList: 'getFollowedTopicList',
    }),
    async onRefresh () {
      let noMore, params
      switch (this.type) {
        case 'all':
          params = {}
          if (this.logged) params.follow = 1
          noMore = await this.getQuestionTopicList(params)
          break
        case 'follow':
          params = {}
          noMore = await this.getFollowedTopicList(params)
          break
      }
      this.loader.afterRefresh(noMore)
    },
    async onLoadmore () {
      let noMore, params
      switch (this.type) {
        case 'all':
          params = { offset: this.all.length }
          if (this.logged) params.follow = 1
          noMore = await this.getQuestionTopicList(params)
          break
        case 'follow':
          params = { after: getLastField(this.follow) }
          noMore = await this.getFollowedTopicList(params)
          break
      }
      this.loader.afterRefresh(noMore)
    },
  },
}
</script>

<style lang="less" scoped>
.p-question-topic {
  padding: 30px;
  background-color: #fff;

  .nav {
    padding: 16px 0;
    .border(bottom);
    margin-bottom: 16px;

    > a {
      margin-right: 22px;
      color: @disabled-color;

      &.exact-active {
        color: @text-color;
      }
    }
  }
}
</style>
