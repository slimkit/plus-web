<template>
  <div class="p-topic-detail">
    <main class="main-container">
      <header class="topic-cover" :style="{backgroundImage: cover.url && `url(${cover.url})`}">
        <Spin v-if="!topic.name" fix />

        <h1 class="name">{{ topic.name }}</h1>
        <p class="creator" :class="{show: creator.name}">创建者：{{ creator.name }}</p>
        <p class="description">{{ topic.desc }}</p>

        <Button
          v-if="isCreator"
          class="report-btn"
          ghost
          shape="circle"
          size="small"
          :to="`/topic/${topicId}/edit`"
        >
          编辑话题
        </Button>
        <Button
          v-else
          class="report-btn"
          ghost
          shape="circle"
          size="small"
          @click="onReport"
        >
          举报
        </Button>
      </header>

      <Collapse>
        <div v-if="logged && showPost" class="post-container">
          <PostFeed :topic="topic" @post="afterPostFeed" />
        </div>
      </Collapse>

      <Loadmore
        ref="loader"
        class="feeds-container"
        :show-bottom="feeds.length"
        @refresh="onRefresh"
        @loadmore="onLoadmore"
      >
        <div v-if="!feeds.length" v-empty:content />

        <FeedList
          :feeds="feeds"
          :hide-topic="topicId"
          @after-delete="afterDeleteFeed"
        />
      </Loadmore>
    </main>

    <aside class="side-container">
      <SideWidget class="topic-widget" :loading="!topic.name">
        <Button
          v-if="!logged || !isCreator"
          shape="circle"
          size="large"
          :type="isFollow ? undefined : 'primary'"
          :long="true"
          @click="checkAuth() && isFollow ? onUnfollow() : onFollow()"
        >
          <span v-if="isFollow" title="点击取消关注">
            <svg class="icon"><use xlink:href="#icon-topic2" /></svg>
            已关注话题
          </span>
          <template v-else>
            <svg class="icon"><use xlink:href="#icon-topic" /></svg>
            关注话题
          </template>
        </Button>

        <Button
          shape="circle"
          size="large"
          type="primary"
          :long="true"
          @click="checkAuth() && (showPost = !showPost)"
        >
          <svg class="icon"><use xlink:href="#icon-edit" /></svg>
          发动态
        </Button>
      </SideWidget>

      <SideWidget
        key="topic-info"
        class="info-widget"
        :loading="!topic.name"
      >
        <template #default>
          <ul class="topic-info">
            <li>动态 <strong>{{ topic.feeds_count || 0 }}</strong></li>
            <li>关注 <strong>{{ topic.followers_count || 0 }}</strong></li>
          </ul>
        </template>

        <template #footer>
          <footer>
            <SocialShare
              :title="topic.name"
              :description="topic.desc"
              :image="cover.url"
            />
          </footer>
        </template>
      </SideWidget>

      <SideWidget
        key="topic-participants"
        class="participants-widget"
        title="参与话题的人"
        type="user"
        :users="participants.slice(0, 9)"
        :loading="!participants.length"
      >
        <template v-if="participants.length > 9" v-slot:footer>
          <div class="view-more" @click="showMoreParticipants = true">更多</div>
          <Modal
            v-model="showMoreParticipants"
            title="参与话题的人"
            :footer-hide="true"
            :width="1050"
          >
            <TopicParticipants
              v-if="showMoreParticipants"
              :topic-id="topicId"
              :initial-participants="participants"
            />
          </Modal>
        </template>
      </SideWidget>

      <SideWidgetHotTopics key="hot-topics" />
    </aside>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import { limit, getLastField } from '@/utils'
import SideWidget from '@/components/common/SideWidget.vue'
import SideWidgetHotTopics from '@/components/topic/SideWidgetHotTopics.vue'
import SocialShare from '@/components/common/SocialShare.vue'
import FeedList from '@/components/feed/FeedList.vue'
import PostFeed from '@/components/feed/PostFeed.vue'
import TopicParticipants from '@/components/topic/TopicParticipants.vue'

export default {
  name: 'TopicDetail',
  head () {
    return {
      title: `${this.topic.name} - 话题`,
    }
  },
  components: {
    SideWidget,
    SideWidgetHotTopics,
    SocialShare,
    FeedList,
    PostFeed,
    TopicParticipants,
  },
  validate ({ params }) {
    return /^\d+$/.test(params.topicId)
  },
  data () {
    return {
      participants: [], // 参与话题的人
      feeds: [],
      creator: {}, // 话题创建者

      showPost: false,
      showMoreParticipants: false,
    }
  },
  computed: {
    ...mapState('topic', {
      topic: 'current',
    }),
    topicId () {
      return +this.$route.params.topicId
    },
    cover () {
      return this.topic.logo || {}
    },
    isFollow: {
      get () {
        return this.logged && this.topic.has_followed
      },
      set (val) {
        this.topic.has_followed = val
      },
    },
    isCreator () {
      return this.logged && this.logged.id === this.topic.creator_user_id
    },
  },
  async asyncData ({ store, params }) {
    const topicId = params.topicId
    await store.dispatch('topic/getTopic', topicId)
  },
  async mounted () {
    this.fetchCreator()
    this.fetchParticipants()
  },
  methods: {
    ...mapActions('topic', {
      getTopic: 'getTopic',
    }),
    async fetchCreator () {
      this.creator = await this.$axios.$get(`/users/${this.topic.creator_user_id}`)
    },
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
    async onFollow () {
      await this.$axios.$put(`/user/feed-topics/${this.topicId}`)
      this.isFollow = true
      this.$Message.success('关注话题成功')
    },
    async onUnfollow () {
      await this.$axios.$delete(`/user/feed-topics/${this.topicId}`)
      this.isFollow = false
      this.$Message.success('取消关注话题')
    },
    async afterPostFeed () {
      this.loader.beforeRefresh()
      this.showPost = false
    },
    afterDeleteFeed (feedId) {
      this.feeds = _.filter(this.feeds, feed => feed.id !== feedId)
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
        opacity: 0;
        transition: opacity .6s;

        &.show {
          opacity: 1;
        }
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

  .post-container {
    padding: 30px;
    margin-bottom: 30px;
    background-color: #fff;
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

        /deep/ .share-icon {
          fill: #fff;
        }
      }
    }

    .participants-widget {
      /deep/ .view-more {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        background-color: #f9fcff;
        color: #999;
        cursor: pointer;
      }
    }
  }
}
</style>
