<template>
  <div class="p-question-index">
    <nav class="nav">
      <nuxt-link :class="{'exact-active': type === 'hot'}" :to="{query: {type: 'hot'}}">热门</nuxt-link>
      <nuxt-link :class="{'exact-active': type === 'excellent'}" :to="{query: {type: 'excellent'}}">精选</nuxt-link>
      <nuxt-link :class="{'exact-active': type === 'reward'}" :to="{query: {type: 'reward'}}">悬赏</nuxt-link>
      <nuxt-link :class="{'exact-active': type === 'new'}" :to="{query: {type: 'new'}}">最新</nuxt-link>
      <nuxt-link :class="{'exact-active': type === 'all'}" :to="{query: {type: 'all'}}">全部</nuxt-link>
    </nav>

    <main>
      <Loadmore
        ref="loader"
        @refresh="onRefresh"
        @loadmore="onLoadmore"
      >
        <QuestionList :questions="questions" />
      </Loadmore>
    </main>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import QuestionList from '@/components/question/QuestionList.vue'

export default {
  name: 'QuestionIndex',
  components: {
    QuestionList,
  },
  computed: {
    ...mapState('question', ['all', 'new', 'hot', 'excellent', 'reward']),
    type () {
      return this.$route.query.type || 'hot'
    },
    questions () {
      return this[this.type] || this.hot
    },
  },
  watch: {
    type () {
      this.loader.beforeRefresh()
    },
  },
  methods: {
    ...mapActions('question', {
      getQuestionList: 'getQuestionList',
    }),
    async onRefresh () {
      const params = { type: this.type }
      const noMore = await this.getQuestionList(params)
      this.loader.afterRefresh(noMore)
    },
    async onLoadmore () {
      const params = { type: this.type, offset: this.questions.length }
      const noMore = await this.getQuestionList(params)
      this.loader.afterLoadmore(noMore)
    },
  },
}
</script>

<style lang="less" scoped>
.p-question-index {
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
