<template>
  <article class="p-feed-detail">
    <div class="article">
      <header class="article-header">
        <Avatar :user="user" />
        <div class="author-info">
          <h3>{{ user.name }}</h3>
          <p class="time">{{ feed.created_at | fromNow }}</p>
        </div>
        <Poptip
          v-model="showMore"
          placement="bottom"
          class="more"
        >
          <svg class="icon lg"><use xlink:href="#icon-more" /></svg>

          <template v-slot:content>
            <ul class="options" @click="showMore = false">
              <li @click="onRepost"><svg class="icon"><use xlink:href="#icon-share" /></svg> 转发</li>
              <li @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
            </ul>
          </template>
        </Poptip>
      </header>

      <hr>

      <main class="article-content">
        <div v-if="video" class="video-wrap">
          <AsyncFile type="video" :file="video" />
        </div>
        <div v-if="images.length" class="images-wrap">
          <div
            v-for="(image, index) in images"
            :key="image.file"
            class="image-wrap"
            @click="viewImage(image, index)"
          >
            <AsyncFile type="image" :file="image" />

            <div v-if="image.amount && !image.paid" class="badge pay">付费</div>
          </div>
        </div>

        <div class="text-wrap" v-html="formatContent(feed.feed_content)" />
      </main>
      <footer class="article-footer">
        <ArticleLike
          :like-count="feed.like_count"
          :liked="feed.has_like"
          :collected="feed.has_collect"
          :share="shareInfo"
          @like="onLike"
          @collect="onCollect"
        />

        <ArticleReward
          v-if="allowReward"
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

      <SideWidgetRecommendUsers />
    </aside>
  </article>
</template>

<script>
import _ from 'lodash'
import { noop, limit } from '@/utils'
import { getFileUrl } from '@/utils/file'
import { convertAtHTML, convertLinkHTML, cutText } from '@/utils/text'
import SideWidget from '@/components/common/SideWidget.vue'
import SideWidgetRecommendUsers from '@/components/user/SideWidgetRecommendUsers.vue'
import ArticleLike from '@/components/common/ArticleLike.vue'
import ArticleReward from '@/components/common/ArticleReward.vue'
import ArticleComment from '@/components/common/ArticleComment.vue'

export default {
  name: 'FeedDetail',
  components: {
    SideWidget,
    SideWidgetRecommendUsers,
    ArticleLike,
    ArticleReward,
    ArticleComment,
  },
  head () {
    let username = cutText(this.feed.user.name || '', 8)
    return {
      title: `${username}的动态`,
    }
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
    user () {
      return this.feed.user || {}
    },
    video () {
      return this.feed.video || null
    },
    images () {
      return this.feed.images || []
    },
    allowReward () {
      return this.boot.feed.reward
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
    shareInfo () {
      const info = {
        title: this.feed.feed_content,
      }
      if (this.images.length) info.image = getFileUrl(this.images[0].file)
      return info
    },
  },
  async asyncData ({ $axios, params }) {
    const feed = await $axios.$get(`/feeds/${params.id}`)
    return { feed }
  },
  methods: {
    formatContent (text) {
      text = convertLinkHTML(text)
      text = convertAtHTML(text)
      return text
    },
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
      ret.comment.user = this.logged
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
    async onRepost () {
      this.$root.$emit('repost', {
        type: 'feeds',
        source: this.feed,
      })
    },
    async viewImage (image, index) {
      if (image.amount && !image.paid) {
        await this.checkAuth()
        this.$root.$emit('pay', {
          title: '购买支付',
          content: `您只需要支付${image.amount}积分即可查看高清大图，是否确认支付？`,
          amount: image.amount,
          api: `/currency/purchases/${image.paid_node}`,
          callback: (res, amount) => {
            this.$set(this.images[index], 'paid', true)
            this.$set(this.images[index], '_t', +new Date())
          },
        })
        return
      }
      const originalUrl = getFileUrl(image.file)
      window.open(originalUrl)
    },
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

    .images-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .image-wrap {
      position: relative;
      display: flex;
      justify-content: center;
      background-color: @background-color-base;
      margin-bottom: 24px;
      overflow: hidden;
      cursor: zoom-in;

      .badge.pay {
        position: absolute;
        top: 0;
        left: 0;
        padding-top: 20px;
        width: 5em;
        text-align: center;
        color: #fff;
        background-color: #c8a06c;
        background-image: linear-gradient(135deg, #cfac7d 50%, #c8a06c 50%);
        transform: translate(-25px, -10px) rotateZ(-45deg);
      }
    }

    .video-wrap {
      margin-bottom: 24px;
    }

    .text-wrap {
      /deep/ a {
        color: @primary-color;
      }
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
