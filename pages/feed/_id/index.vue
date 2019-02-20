<template>
  <article class="p-feed-detail">
    <div class="article">
      <header class="article-header">
        <Avatar :user="user" />
        <div class="author-info">
          <h3>{{ user.name }}</h3>
          <p class="time">{{ feed.created_at | fromNow }}</p>
        </div>
        <IPoptip
          v-model="showMore"
          placement="bottom"
          class="more"
        >
          <svg class="icon lg"><use xlink:href="#icon-more" /></svg>

          <ul
            slot="content"
            class="options"
            @click="showMore = false"
          >
            <li @click="onRepostable"><svg class="icon"><use xlink:href="#icon-share" /></svg> 转发</li>
            <li @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
          </ul>
        </IPoptip>
      </header>

      <hr>

      <main class="article-content">
        <div v-if="video" class="video-wrap">
          <AsyncFile type="video" :file="video" />
        </div>
        <div v-if="images.length" class="image-wrap">
          <template v-for="(image, index) in images">
            <AsyncFile
              v-if="!index"
              :key="image.file"
              type="image"
              :file="image"
            />
          </template>
        </div>
        <div class="text-wrap">
          {{ feed.feed_content }}
        </div>
      </main>
      <footer class="article-footer">
        <ArticleLike
          :like-count="feed.like_count"
          :liked="feed.has_like"
          :collected="feed.has_collect"
          @like="onLike"
          @collect="onCollect"
        />

        <ArticleReward
          type="feed"
          :article="feed.id"
          :count="rewardCount"
          :amount="rewardAmount"
          :rewards="rewards"
          @fetch="fetchRewards"
          @reward="onReward"
        />

        <hr>

        <ArticleComment
          ref="comment"
          type="feed"
          :count="feed.feed_comment_count"
          :comments="comments"
          @fetch="fetchComments"
          @comment="onComment"
          @comment:delete="onCommentDelete"
        />
      </footer>
    </div>

    <aside class="widgets">
      <SideWidget class="author-widget">
        <div class="user">
          <Avatar :user="user" />
          <div class="info">
            <h3>{{ user.name }}</h3>
            <p class="bio">{{ user.bio || '暂无简介' }}</p>
          </div>
        </div>
        <div class="meta">
          <div class="meta-item">粉丝 <span>{{ user.extra.followers_count || 0 }}</span></div>
          <div class="meta-item">关注 <span>{{ user.extra.followings_count || 0 }}</span></div>
        </div>
      </SideWidget>

      <SideWidget
        v-if="recommendUsers.length"
        :users="recommendUsers"
        type="user"
        title="推荐用户"
      />
    </aside>
  </article>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import { noop, limit } from '@/utils'
import SideWidget from '@/components/common/SideWidget.vue'
import ArticleLike from '@/components/common/ArticleLike.vue'
import ArticleReward from '@/components/common/ArticleReward.vue'
import ArticleComment from '@/components/common/ArticleComment.vue'

export default {
  name: 'FeedDetail',
  components: {
    SideWidget,
    ArticleLike,
    ArticleReward,
    ArticleComment,
  },
  head: {
    title: '动态详情',
  },
  validate ({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  data () {
    return {
      feed: {},
      rewards: [],
      comments: [],

      showMore: false,
    }
  },
  computed: {
    ...mapState('user', {
      recommendUsers: 'recommend',
    }),
    user () {
      return this.feed.user || {}
    },
    video () {
      return this.feed.video || null
    },
    images () {
      return this.feed.images || []
    },
    rewardAmount: {
      get () {
        return Number(this.feed.reward.amount)
      },
      set (val) {
        this.feed.reward.amount = val
      },
    },
    rewardCount: {
      get () {
        return Number(this.feed.reward.count)
      },
      set (val) {
        this.feed.reward.count = val
      },
    },
  },
  async asyncData ({ $axios, params }) {
    const feed = await $axios.$get(`/feeds/${params.id}`)
    return { feed }
  },
  mounted () {
    this.fetchRecommendUsers()
  },
  methods: {
    ...mapActions('user', {
      fetchRecommendUsers: 'fetchRecommendUsers',
    }),
    async fetchRewards (offset = 0, callback = noop) {
      const list = await this.$axios.$get(`/feeds/${this.feed.id}/rewards`, { params: { offset, limit } })
      if (!offset) {
        this.rewards = list
      } else {
        this.rewards.push(...list)
      }
      const noMore = list.length < limit
      callback(noMore)
    },
    async fetchComments (after = 0, callback = noop) {
      const { comments, pinneds } = await this.$axios.$get(`/feeds/${this.feed.id}/comments`, { params: { after, limit } })
      if (!after) {
        pinneds.forEach(comment => (comment.pinned = true))
        const merged = _.unionBy(pinneds, comments, 'id') // 合并去重
        this.comments = merged
      } else {
        this.comments.push(...comments)
      }
      const noMore = comments.length < limit
      callback(noMore)
    },
    async onLike (callback) {
      if (!this.feed.has_like) {
        // 喜欢
        await this.$axios.$post(`/feeds/${this.feed.id}/like`)
        this.feed.like_count += 1
        this.feed.has_like = true
      } else {
        // 取消喜欢
        this.$axios.$delete(`/feeds/${this.feed.id}/unlike`)
        this.feed.like_count -= 1
        this.feed.has_like = false
      }
      callback()
    },
    async onCollect (callback) {
      if (!this.feed.has_collect) {
        // 收藏
        await this.$axios.$post(`/feeds/${this.feed.id}/collections`)
        // this.feed.collect_count += 1
        this.feed.has_collect = true
      } else {
        // 取消收藏
        this.$axios.$delete(`/feeds/${this.feed.id}/uncollect`)
        // this.feed.collect_count -= 1
        this.feed.has_collect = false
      }
      callback()
    },
    onReward (amount) {
      this.rewardCount += 1
      this.rewardAmount += amount
      this.fetchRewards()
    },
    async onComment (content, replyUser = {}) {
      const ret = await this.$axios.$post(`/feeds/${this.feed.id}/comments`, {
        body: content,
        reply_user: replyUser.id,
      })
      this.$Message.success('评论成功')

      // 更新评论列表
      if (replyUser.id) ret.comment.reply = replyUser
      this.comments.unshift(ret.comment)
      this.feed.feed_comment_count += 1

      // 清空评论框
      this.$refs.comment.clean()
    },
    async onCommentDelete (comment, callback) {
      await this.$axios.$delete(`/feeds/${comment.commentable_id}/comments/${comment.id}`)
      this.$Message.success('删除成功')
      // 更新评论列表
      this.comments = this.comments.filter(item => item.id !== comment.id)
      this.feed_comment_count -= 1

      // 删除成功会调(关闭对话框)
      callback()
    },
    async onReport () {
      this.$root.$emit('report', {
        type: 'feed',
        id: this.feed.id,
      })
    },
    async onRepostable () { },
  },
}
</script>

<style lang="less" scoped>
.p-feed-detail {
  display: flex;
  flex-direction: row;

  .article {
    flex: auto;
    background-color: #fff;
    margin-right: 30px;
    padding: 30px;
  }

  .article-header {
    display: flex;
    align-items: center;

    .author-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 16px;

      .time {
        margin-top: 4px;
        color: @disabled-color;
      }
    }

    .more {
      margin-left: auto;
      cursor: pointer;
    }
  }

  .article-content {
    margin-bottom: 30px;

    .image-wrap {
      display: flex;
      justify-content: center;
      background-color: @background-color-base;
      margin-bottom: 24px;
    }

    .video-wrap {
      margin-bottom: 24px;
    }
  }

  .widgets {
    flex: none;
    width: @sidebar-width;

    .author-widget {
      display: flex;
      flex-direction: column;

      .user {
        display: flex;
        padding: 16px;

        .info {
          display: flex;
          flex-direction: column;
          margin-left: 16px;

          .bio {
            color: @disabled-color;
            margin-top: 8px;
          }
        }
      }

      .meta {
        display: flex;
        height: 49px;
        justify-content: space-between;
        align-items: center;
        .border(top);

        .meta-item {
          flex: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          .border(right);

          &:last-child {
            border-right: 0;
          }

          > span {
            font-size: 140%;
            color: @title-color;
            margin-left: 4px;
          }
        }
      }
    }
  }
}
</style>
