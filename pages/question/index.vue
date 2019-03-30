<template>
  <div class="p-question-index">
    <div class="main-container">
      <nav class="main-nav">
        <nuxt-link :class="{'exact-active': $route.path === '/question'}" to="/question">问答</nuxt-link>
        <nuxt-link :class="{'exact-active': $route.path === '/question/topic'}" to="/question/topic">专题</nuxt-link>
      </nav>

      <main class="question-list">
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
      </main>
    </div>

    <aside class="right-container">
      <SideWidget key="question-create">
        <div class="question-container">
          <nuxt-link to="/question/create">
            <IButton
              type="primary"
              :long="true"
              size="large"
              shape="circle"
            >
              <svg class="icon"><use xlink:href="#icon-publish" /></svg>
              提问
            </IButton>
          </nuxt-link>
        </div>
      </SideWidget>

      <SideWidgetHotQuestions key="hot-questions" />

      <SideWidgetRanks key="answer-ranks" />
    </aside>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SideWidget from '@/components/common/SideWidget.vue'
import SideWidgetHotQuestions from '@/components/question/SideWidgetHotQuestions.vue'
import SideWidgetRanks from '@/components/question/SideWidgetRanks.vue'
import QuestionList from '@/components/question/QuestionList.vue'

export default {
  name: 'QuestionIndex',
  components: {
    SideWidget,
    SideWidgetHotQuestions,
    SideWidgetRanks,
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
  position: relative;
  display: flex;
  align-items: flex-start;

  .main-container {
    flex: auto;
    margin-right: 30px;

    .main-nav {
      padding: 30px;
      margin-bottom: 30px;
      background-color: #fff;

      > a {
        margin-right: 30px;
        color: @disabled-color;

        &.exact-active {
          color: @text-color;
        }
      }
    }
  }

  .right-container {
    // position: sticky;
    top: 30px;
    flex: none;
    width: @sidebar-width;

    .question-container {
      padding: 30px;
      background-color: #fff;

      a {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .question-list {
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
}
</style>
