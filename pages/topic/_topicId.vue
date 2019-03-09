<template>
  <div class="p-topic-detail">
    <main class="main-container">
      <header class="topic-cover" :style="{backgroundImage: `url(${topic.logo.url})`}">
        <h1 class="name">{{ topic.name }}</h1>
        <p class="creator">{{ topic.creator_user_id }}</p>
        <p class="description">{{ topic.desc }}</p>

        <IButton
          class="report-btn"
          ghost
          shape="circle"
          size="small"
          @click="onReport"
        >
          举报
        </IButton>
      </header>

      <Loadmore
        ref="loader"
        class="feeds-container"
        @refresh="onRefresh"
        @loadmore="onLoadmore"
      >
        <FeedList :feeds="feeds" />
      </Loadmore>
    </main>

    <aside class="side-container">
      <SideWidget class="topic-widget">
        <IButton
          shape="circle"
          size="large"
          type="primary"
          :long="true"
        >
          <svg class="icon"><use xlink:href="#icon-topic" /></svg>
          关注话题
        </IButton>

        <IButton
          shape="circle"
          size="large"
          type="primary"
          :long="true"
        >
          <svg class="icon"><use xlink:href="#icon-edit" /></svg>
          发动态
        </IButton>
      </SideWidget>

      <SideWidget key="topic-info" class="info-widget">
        <template #default>
          <ul class="topic-info">
            <li>动态 <strong>{{ topic.feeds_count || 0 }}</strong></li>
            <li>关注 <strong>{{ topic.followers_count || 0 }}</strong></li>
          </ul>
        </template>

        <template #footer>
          <footer>
            分享至：
            <svg class="icon"><use xlink:href="#icon-weibo" /></svg>
            <svg class="icon"><use xlink:href="#icon-qq" /></svg>
            <svg class="icon"><use xlink:href="#icon-weixin" /></svg>
          </footer>
        </template>
      </SideWidget>

      <SideWidget
        key="topic-participants"
        title="参与话题的人"
        type="user"
        :users="participants.slice(0, 9)"
        :loading="!participants.length"
      />

      <SideWidgetHotTopics key="hot-topics" />
    </aside>
  </div>
</template>

<script>
import _ from 'lodash'
import SideWidget from '@/components/common/SideWidget.vue'
import SideWidgetHotTopics from '@/components/topic/SideWidgetHotTopics.vue'
import FeedList from '@/components/feed/FeedList.vue'
import { limit, getLastField } from '@/utils'

export default {
  name: 'TopicDetail',
  components: {
    SideWidget,
    SideWidgetHotTopics,
    FeedList,
  },
  data () {
    return {
      topic: {},
      participants: [], // 参与话题的人
      feeds: [],
    }
  },
  computed: {
    topicId () {
      return +this.$route.params.topicId
    },
  },
  async asyncData ({ $axios, params }) {
    const { topicId } = params
    const topic = await $axios.$get(`/feed/topics/${topicId}`)
    return { topic }
  },
  mounted () {
    this.fetchParticipants()
  },
  methods: {
    async onRefresh () {
      const params = { limit }
      const list = await this.$axios.$get(`/feed/topics/${this.topicId}/feeds`, { params })
      this.feeds = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { limit, index: getLastField(this.feeds, 'index') }
      const list = await this.$axios.$get(`/feed/topics/${this.topicId}/feeds`, { params })
      this.feeds.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
    async fetchParticipants () {
      const params = { limit: 10 }
      const id = await this.$axios.$get(`/feed/topics/${this.topicId}/participants`, { params })
      // TODO: 从缓存读取以加速
      const users = await this.$axios.$get('/users', { params: { id: id.join(',') } })
      this.participants = _.sortBy(users, user => user.id !== this.topic.creator_user_id)
    },
    onReport () {
      this.$root.$emit('report', {
        type: 'topic',
        id: this.topicId,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.p-topic-detail {
  display: flex;

  .main-container {
    flex: auto;
    margin-right: 30px;

    .topic-cover {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 400px;
      margin-bottom: 30px;
      background: #ccc center / cover no-repeat;
      color: #fff;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0,0,0,.4);
      }

      .name, .creator, .description, .report-btn {
        position: relative;
        z-index: 1;
      }

      .creator {
        margin: 24px 0 16px;
        font-size: @font-size-large;
      }

      .report-btn {
        position: absolute;
        bottom: 30px;
        right: 30px;
        padding: 3px 12px;
      }
    }

    .feeds-container {
      padding: 30px;
      background-color: #fff;
    }
  }

  .side-container {
    flex: none;
    width: @sidebar-width;

    > * {
      background-color: #fff;
    }

    .topic-widget {
      padding: 16px;

      .ivu-btn {
        margin-top: 16px;

        &:first-child {
          margin-top: 0;
        }
      }
    }

    .info-widget {
      .topic-info {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 100px;

        > li {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;

          > strong {
            font-size: @font-size-large * 1.2;
          }
        }
      }

      footer {
        display: flex;
        height: 50px;
        justify-content: center;
        align-items: center;
        background-color: @error-color;
        color: #fff;
      }
    }
  }
}
</style>
