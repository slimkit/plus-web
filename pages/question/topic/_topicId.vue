<template>
  <div class="p-question-topic-detail">
    <div class="main-container">
      <header class="header">
        <div class="info">
          <div class="cover" />
          <div class="topic-detail">
            <h1>{{ topic.name }}</h1>
            <p>
              关注 <span class="primary-color">{{ topic.follows_count }}</span>
              问题 <span class="primary-color">{{ topic.questions_count }}</span>
            </p>
          </div>
          <div class="extra">
            <div><Button class="">已关注</Button></div>
            <Poptip
              trigger="hover"
              placement="bottom"
              class="poptip-social-share"
            >
              <template v-slot:default>
                <a><svg class="icon"><use xlink:href="#icon-share" /></svg> 分享</a>
              </template>

              <template v-slot:content>
                <SocialShare
                  :title="topic.title"
                  :description="topic.description"
                  :image="topic.avatar"
                />
              </template>
            </Poptip>
          </div>
        </div>
        <p>专题简介：{{ topic.description }}</p>
      </header>

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
            <Button
              type="primary"
              :long="true"
              size="large"
              shape="circle"
            >
              <svg class="icon"><use xlink:href="#icon-publish" /></svg>
              提问
            </Button>
          </nuxt-link>
        </div>
      </SideWidget>

      <SideWidgetHotQuestionTopics key="hot-question-topics" />
    </aside>
  </div>
</template>

<script>
import { limit } from '@/utils'
import SideWidget from '@/components/common/SideWidget.vue'
import SideWidgetHotQuestionTopics from '@/components/question/SideWidgetHotQuestionTopics.vue'
import QuestionList from '@/components/question/QuestionList.vue'
import SocialShare from '@/components/common/SocialShare.vue'

export default {
  name: 'QuestionTopicDetail',
  head () {
    return {
      title: `${this.topic.name} - 专题`,
    }
  },
  components: {
    SideWidget,
    SideWidgetHotQuestionTopics,
    QuestionList,
    SocialShare,
  },
  validate ({ params }) {
    return /^\d+$/.test(params.topicId)
  },
  data () {
    return {
      topic: {},
      all: [],
      new: [],
      hot: [],
      excellent: [],
      reward: [],
    }
  },
  computed: {
    topicId () {
      return +this.$route.params.topicId
    },
    type () {
      return this.$route.query.type || 'hot'
    },
    questions: {
      get () {
        return this[this.type] || this.hot
      },
      set (list) {
        this[this.type] = list
      },
    },
  },
  watch: {
    type () {
      this.loader.beforeRefresh()
    },
  },
  async asyncData ({ $axios, params }) {
    const topicId = +params.topicId
    const topic = await $axios.$get(`/question-topics/${topicId}`)
    return { topic }
  },
  methods: {
    async onRefresh () {
      const params = { type: this.type, limit }
      const list = await this.$axios.$get(`/question-topics/${this.topicId}/questions`, { params })
      this.questions = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { type: this.type, limit, offset: this.questions.length }
      const list = await this.$axios.$get(`/question-topics/${this.topicId}/questions`, { params })
      this.questions.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
  },
}
</script>

<style lang="less" scoped>
.p-question-topic-detail {
  position: relative;
  display: flex;
  align-items: flex-start;

  .main-container {
    flex: auto;
    margin-right: 30px;

    .header {
      margin-bottom: 30px;
      padding: 30px;
      background-color: #fff;

      .info {
        display: flex;
        margin-bottom: 20px;

        .cover {
          flex: none;
          width: 100px;
          height: 100px;
          margin-right: 30px;
          background: @border-color-base url(~assets/images/default_image.png) no-repeat center / cover;
        }

        .topic-detail {
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          h1 {
            font-size: @font-size-large * 1.2;
          }
        }

        .extra {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: auto;
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
