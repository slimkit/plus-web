<template>
  <div class="p-question-topic">
    <div class="main-container">
      <nav class="main-nav">
        <nuxt-link :class="{'exact-active': $route.path === '/question'}" to="/question">问答</nuxt-link>
        <nuxt-link :class="{'exact-active': $route.path === '/question/topic'}" to="/question/topic">专题</nuxt-link>
      </nav>

      <div class="topic-list">
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

      <SideWidgetHotQuestionTopics key="hot-question-topics" />
    </aside>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getLastField } from '@/utils'
import SideWidget from '@/components/common/SideWidget.vue'
import SideWidgetHotQuestionTopics from '@/components/question/SideWidgetHotQuestionTopics.vue'
import QuestionTopicList from '@/components/question/QuestionTopicList.vue'

export default {
  name: 'QuestionIndex',
  head () {
    return {
      title: `专题`,
    }
  },
  components: {
    SideWidget,
    SideWidgetHotQuestionTopics,
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
      let noMore
      switch (this.type) {
        case 'all':
          const params = {}
          if (this.logged) params.follow = 1
          noMore = await this.getQuestionTopicList(params)
          break
        case 'follow':
          noMore = await this.getFollowedTopicList()
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
      this.loader.afterLoadmore(noMore)
    },
  },
}
</script>

<style lang="less" scoped>
.p-question-topic {
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
    position: sticky;
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

  .topic-list {
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
