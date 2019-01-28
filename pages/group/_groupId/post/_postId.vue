<template>
  <article class="p-group-post-detail">
    <div class="article">
      <header class="article-header">
        <Avatar :user="user" />
        <div class="author-info">
          <h3>{{ user.name }}</h3>
          <p class="time">
            发布时间 {{ post.created_at | fromNow }}
            浏览量 {{ post.views_count }}
          </p>
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
            <template v-if="isManager">
              <li v-if="!post.excellent_at" @click="onExcellent(true)"><svg class="icon"><use xlink:href="#icon-text" /></svg> 设为精华</li>
              <li v-else @click="onExcellent(false)"><svg class="icon"><use xlink:href="#icon-text" /></svg> 取消精华</li>

              <li v-if="!post.pinned" @click="onPinned(true)"><svg class="icon"><use xlink:href="#icon-pinned2" /></svg> 置顶帖子</li>
              <li v-else @click="onPinned(false)"><svg class="icon"><use xlink:href="#icon-pinned1" /></svg> 撤销置顶</li>
            </template>

            <li @click="onRepostable"><svg class="icon"><use xlink:href="#icon-share" /></svg> 转发</li>
            <li @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
          </ul>
        </IPoptip>
      </header>

      <hr>

      <main class="article-content">
        <h1>{{ post.title }}</h1>
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
        <div class="markdown-body" v-html="renderedBody" />
      </main>

      <footer class="article-footer">
        <ArticleLike
          :like-count="post.likes_count"
          :liked="post.liked"
          :collected="post.collected"
          @like="onLike"
          @collect="onCollect"
        />

        <ArticleReward
          type="post"
          :article="post.id"
          :count="post.reward_number"
          :amount="post.reward_amount"
          :rewards="rewards"
          @fetch="fetchRewards"
          @reward="onReward"
        />

        <hr>

        <ArticleComment
          ref="comment"
          type="post"
          :count="post.comments_count"
          :comments="comments"
          @fetch="fetchComments"
          @comment="onComment"
          @comment:delete="onCommentDelete"
          @comment:pinned="onCommentPinned"
        />
      </footer>
    </div>

    <aside class="widgets">
      <SideWidget class="author-widget">
        <div class="user">
          <Avatar :user="group" />
          <div class="info">
            <h3>{{ group.name }}</h3>
            <p class="bio text-cut-2">{{ group.summary || '暂无简介' }}</p>
          </div>
        </div>
        <div class="meta">
          <div class="meta-item">成员 <span>{{ group.users_count || 0 }}</span></div>
          <div class="meta-item">帖子 <span>{{ group.posts_count || 0 }}</span></div>
        </div>
      </SideWidget>

      <SideWidget
        :users="recommendUsers"
        type="user"
        title="推荐用户"
        :loading="!recommendUsers.length"
      />
    </aside>
  </article>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapState } from 'vuex'
import { noop, limit } from '@/utils'
import markdown from '@/utils/markdown'
import SideWidget from '@/components/common/SideWidget.vue'
import ArticleLike from '@/components/common/ArticleLike.vue'
import ArticleReward from '@/components/common/ArticleReward.vue'
import ArticleComment from '@/components/common/ArticleComment.vue'

export default {
  name: 'GroupPostDetail',
  components: {
    SideWidget,
    ArticleLike,
    ArticleReward,
    ArticleComment,
  },
  data () {
    return {
      post: {},
      rewards: [],
      comments: [],
      pinnedComments: [],

      showMore: false,
      excellentLock: false,
    }
  },
  computed: {
    ...mapState('user', {
      recommendUsers: 'recommend',
    }),
    postId () {
      return Number(this.$route.params.postId)
    },
    user () {
      return this.post.user
    },
    group () {
      return this.post.group
    },
    isMine () {
      return this.logged && this.logged.id === this.post.user_id
    },
    isManager () {
      const { joined } = this.group
      return ['founder', 'administrator'].includes(joined && joined.role)
    },
    images () {
      return this.post.images || []
    },
    renderedBody () {
      return markdown(this.post.body)
    },
  },
  async asyncData ({ params, $axios }) {
    const { groupId, postId } = params
    const post = await $axios.$get(`/plus-group/groups/${groupId}/posts/${postId}`)
    return { post }
  },
  created () {
    this.rewards = this.post.rewards || []
    this.comments = this.post.comments || []
  },
  mounted () {
    this.fetchRecommendUsers()
  },
  methods: {
    ...mapActions('user', {
      fetchRecommendUsers: 'fetchRecommendUsers',
    }),
    async fetchRewards (offset = 0, callback = noop) {
      const params = { offset, limit }
      const list = await this.$axios.$get(`/plus-group/group-posts/${this.postId}/rewards`, { params })
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
      const { comments, pinneds } = await this.$axios.$get(`/plus-group/group-posts/${this.postId}/comments`, { params })
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
    async onExcellent (status) {
      if (this.excellentLock) return
      this.excellentLock = true
      await this.$axios.$put(`/group/posts/${this.postId}/toggle-excellent`, {}, { loading: true })
        .finally(() => {
          this.excellentLock = false
        })
      this.post.excellent_at = !this.post.excellent_at
      this.$Message.success('操作成功！')
    },
    async onPinned (status) {
      if (status) {
        await this.$axios.$patch(`/plus-group/posts/${this.postId}/cancel`)
        this.$Message.success('撤销置顶成功')
      } else {
        this.$root.$emit('pinned', {
          type: 'post',
          params: { postId: this.postId },
          isOwner: this.isManager,
        })
      }
    },
    onRepostable () {},
    onReport () {},
    async onCollect (callback) {
      if (!this.post.collected) {
        // 收藏
        await this.$axios.$post(`/plus-group/group-posts/${this.postId}/collections`)
        this.post.collected = true
      } else {
        // 取消收藏
        this.$axios.$delete(`/plus-group/group-posts/${this.postId}/uncollect`)
        this.post.collected = false
      }
      callback()
    },
    async onLike (callback) {
      if (!this.post.liked) {
        // 喜欢
        await this.$axios.$post(`/plus-group/group-posts/${this.postId}/likes`)
        this.post.likes_count += 1
        this.post.liked = true
      } else {
        // 取消喜欢
        this.$axios.$delete(`/plus-group/group-posts/${this.postId}/likes`)
        this.post.likes_count -= 1
        this.post.liked = false
      }
      callback()
    },
    onReward (amount) {
      this.post.reward_number += 1
      this.post.reward_amount += amount
      this.fetchRewards()
    },
    async onComment (content, replyUser = {}) {
      const ret = await this.$axios.$post(`/plus-group/group-posts/${this.postId}/comments`, {
        body: content,
        reply_user: replyUser.id,
      })
      this.$Message.success('评论成功')

      // 更新评论列表
      if (replyUser.id) ret.comment.reply = replyUser
      this.comments.unshift(ret.comment)
      this.post.comments_count += 1

      // 清空评论框
      this.$refs.comment.clean()
    },
    async onCommentDelete (comment, callback) {
      await this.$axios.$delete(`/plus-group/group-posts/${comment.commentable_id}/comments/${comment.id}`)
      this.$Message.success('删除成功')
      // 更新评论列表
      this.comments = this.comments.filter(item => item.id !== comment.id)
      this.post.comments_count -= 1

      // 删除成功会调(关闭对话框)
      callback()
    },
    onCommentPinned (commentId) {
      this.fetchComments()
    },
  },
}
</script>

<style lang="less" scoped>
.p-group-post-detail {
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

    .markdown-body {
      margin-top: 16px;
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
