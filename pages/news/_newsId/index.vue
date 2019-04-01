<template>
  <article class="p-news-detail">
    <div class="article">
      <header class="article-header">
        <h1>{{ news.title }}</h1>

        <p class="time">
          <nuxt-link class="badge" :to="`/news?cate=${news.category.id}`">{{ news.category.name }}</nuxt-link>
          {{ news.author }} ·
          浏览量 {{ news.hits }} ·
          发布时间 {{ news.created_at | fromNow }}

          <no-ssr>
            <IPoptip
              v-model="showMore"
              placement="bottom"
              class="more"
            >
              <svg class="icon lg"><use xlink:href="#icon-more" /></svg>

              <template v-slot:content>
                <ul class="options" @click="showMore = false">
                  <li @click="onRepost"><svg class="icon"><use xlink:href="#icon-share" /></svg> 转发</li>
                  <template v-if="isMine">
                    <li @click="onPinned"><svg class="icon"><use xlink:href="#icon-pinned" /></svg> 申请置顶</li>
                    <li @click="onDelete"><svg class="icon"><use xlink:href="#icon-delete" /></svg> 删除</li>
                  </template>
                  <li v-else @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
                </ul>
              </template>
            </IPoptip>
          </no-ssr>
        </p>

        <blockquote v-if="news.subject" class="subject">
          {{ news.subject }}
        </blockquote>
      </header>

      <main class="article-content">
        <div class="markdown-body" v-html="renderedBody" />
      </main>

      <footer class="article-footer">
        <ArticleLike
          :like-count="news.digg_count"
          :liked="news.has_like"
          :collected="news.has_collect"
          :share="shareInfo"
          @like="onLike"
          @collect="onCollect"
        />

        <ArticleReward
          v-if="allowReward"
          type="news"
          :article="news.id"
          :count="news.reward_count"
          :amount="news.reward_amount"
          :rewards="rewards"
          @fetch="fetchRewards"
          @reward="onReward"
        />

        <hr>

        <ArticleComment
          ref="comment"
          type="news"
          :count="news.comment_count"
          :comments="comments"
          @fetch="fetchComments"
          @comment="onComment"
          @comment:delete="onCommentDelete"
          @comment:pinned="onCommentPinned"
        />
      </footer>
    </div>

    <aside class="widgets">
      <SideWidget key="publish">
        <div class="publish-wrap">
          <IButton
            type="primary"
            :long="true"
            shape="circle"
            size="large"
          >
            <svg class="icon"><use xlink:href="#icon-publish" /></svg>
            投稿
          </IButton>
        </div>
      </SideWidget>

      <SideWidgetHotNews key="hot-news" />
    </aside>
  </article>
</template>

<script>
import _ from 'lodash'
import { noop, limit, isNumber } from '@/utils'
import { getFileUrl } from '@/utils/file'
import markdown from '@/utils/markdown'
import SideWidget from '@/components/common/SideWidget.vue'
import ArticleLike from '@/components/common/ArticleLike.vue'
import ArticleReward from '@/components/common/ArticleReward.vue'
import ArticleComment from '@/components/common/ArticleComment.vue'
import SideWidgetHotNews from '@/components/news/SideWidgetHotNews.vue'

export default {
  name: 'NewsDetail',
  validate ({ params }) {
    return isNumber(params.newsId)
  },
  components: {
    SideWidget,
    ArticleLike,
    ArticleReward,
    ArticleComment,
    SideWidgetHotNews,
  },
  data () {
    return {
      news: {},
      rewards: [],
      comments: [],
      pinnedComments: [],

      showMore: false,
    }
  },
  computed: {
    newsId () {
      return Number(this.$route.params.newsId)
    },
    isMine () {
      return this.logged && (this.logged.id === this.news.user_id)
    },
    renderedBody () {
      return markdown(this.news.content)
    },
    shareInfo () {
      return {
        title: this.news.title,
        description: this.news.subject,
        image: this.news.image ? getFileUrl(this.news.image.id) : null,
      }
    },
  },
  async asyncData ({ params, $axios }) {
    const { newsId } = params
    const news = await $axios.$get(`/news/${newsId}`)
    return { news }
  },
  methods: {
    async fetchRewards (offset = 0, callback = noop) {
      const params = { offset, limit }
      const [list, { count, amount }] = await Promise.all([
        this.$axios.$get(`/news/${this.news.id}/rewards`, { params }),
        this.$axios.$get(`/news/${this.news.id}/rewards/sum`),
      ])
      this.news.reward_count = +count
      this.news.reward_amount = +amount
      if (!offset) {
        this.rewards = list
      } else {
        this.rewards.push(...list)
      }
      const noMore = list.length < limit
      callback(noMore)
    },
    async fetchComments (after = 0, callback = noop) {
      const params = { after, limit }
      const { comments, pinneds } = await this.$axios.$get(`/news/${this.news.id}/comments`, { params })
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
    async onPinned () {
      this.$root.$emit('pinned', {
        type: 'news',
        params: { newsId: this.news.id },
      })
    },
    onRepost () {
      this.$root.$emit('repost', {
        type: 'news',
        source: this.news,
      })
    },
    async onReport () {
      await this.checkAuth()
      this.$root.$emit('report', {
        type: 'news',
        id: this.news.id,
      })
    },
    async onCollect (callback) {
      if (!this.news.has_collect) {
        // 收藏
        await this.$axios.$post(`/news/${this.news.id}/collections`)
        this.news.has_collect = true
        this.$Message.success('收藏成功！')
      } else {
        // 取消收藏
        this.$axios.$delete(`/news/${this.news.id}/collections`)
        this.news.has_collect = false
      }
      callback()
    },
    async onLike (callback) {
      if (!this.news.has_like) {
        // 喜欢
        await this.$axios.$post(`/news/${this.news.id}/likes`)
        this.news.digg_count += 1
        this.news.has_like = true
      } else {
        // 取消喜欢
        await this.$axios.$delete(`/news/${this.news.id}/likes`)
        this.news.digg_count -= 1
        this.news.has_like = false
      }
      callback()
    },
    onReward (amount) {
      this.news.reward_count += 1
      this.news.reward_amount += amount
      this.fetchRewards()
    },
    async onComment (content, replyUser = {}) {
      const ret = await this.$axios.$post(`/news/${this.news.id}/comments`, {
        body: content,
        reply_user: replyUser.id,
      })
      this.$Message.success('评论成功')

      // 更新评论列表
      if (replyUser.id) ret.comment.reply = replyUser
      ret.comment.user = this.logged
      this.comments.unshift(ret.comment)
      this.news.comment_count += 1

      // 清空评论框
      this.$refs.comment.clean()
    },
    async onCommentDelete (comment, callback) {
      await this.$axios.$delete(`/news/${comment.commentable_id}/comments/${comment.id}`)
      this.$Message.success('删除成功')
      // 更新评论列表
      this.comments = this.comments.filter(item => item.id !== comment.id)
      this.news.comment_count -= 1

      // 删除成功会调(关闭对话框)
      callback()
    },
    onCommentPinned (commentId) {
      this.fetchComments()
    },
    onDelete () {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除这条资讯？',
        onOk: async () => {
          const { status } = await this.$axios.delete(`/news/categories/${this.news.category.id}/news/${this.news.id}`)
          if (status === 204) {
            this.$Message.success('删除成功')
            this.$router.back()
          } else {
            this.$Message.warning('删除申请已提交，请等待审核')
          }
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.p-news-detail {
  display: flex;
  flex-direction: row;

  .article {
    flex: auto;
    background-color: #fff;
    padding: 30px;
    margin-right: 30px;
  }

  .article-header {
    margin-bottom: 32px;

    .time {
      display: flex;
      align-items: center;
      margin-top: 32px;
      color: @disabled-color;
    }

    .badge {
      padding: 0 4px;
      margin-right: 8px;
      border: 1px solid @primary-color;
      border-radius: @border-radius-base;
      color: @primary-color;
      font-size: @font-size-small;
    }

    .more {
      margin-left: auto;
      cursor: pointer;
    }

    .subject {
      margin: 32px 0;
      color: @disabled-color;

      &::before,
      &::after {
        content: '';
        display: block;
        width: 60px;
        height: 30px;
      }

      &::before {
        border: 6px solid @border-color-base;
        border-width: 6px 0 0 6px;
        margin-bottom: 16px;
      }

      &::after {
        border: 6px solid @border-color-base;
        border-width: 0 6px 6px 0;
        margin-top: 16px;
        margin-left: auto;
      }
    }
  }

  .article-content {
    margin: 48px 0;

    .image-wrap {
      display: flex;
      justify-content: center;
      background-color: @background-color-base;
      margin-bottom: 24px;
    }

    .markdown-body {
      margin-top: 16px;
    }
  }

  .widgets {
    flex: none;
    width: @sidebar-width;

    .publish-wrap {
      padding: 30px;
    }
  }
}
</style>
