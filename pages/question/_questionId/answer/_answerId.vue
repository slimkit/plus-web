<template>
  <article class="p-question-answer-detail">
    <div class="article">
      <header class="article-header">
        <Avatar :user="user" :anonymity="answer.anonymity" />
        <div class="author-info">
          <h3>
            <template v-if="answer.anonymity">匿名用户</template>
            <nuxt-link v-else :to="`/user/${user.id}`">
              {{ user.name }} <small class="bio text-cut" :title="user.bio">{{ user.bio }}</small>
            </nuxt-link>
          </h3>
          <p class="time">{{ answer.created_at | fromNow }}</p>
        </div>
        <IPoptip
          v-model="showMore"
          placement="bottom"
          class="more"
        >
          <svg class="icon lg"><use xlink:href="#icon-more" /></svg>

          <template v-slot:content>
            <ul class="options" @click="showMore = false">
              <li @click="onRepost"><svg class="icon"><use xlink:href="#icon-share" /></svg> 转发</li>
              <template v-if="isMyAnswer">
                <li @click="showEdit = true"><svg class="icon"><use xlink:href="#icon-edit" /></svg> 编辑</li>
                <li @click="onDelete"><svg class="icon"><use xlink:href="#icon-delete" /></svg> 删除</li>
              </template>
              <li v-else @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
            </ul>
          </template>
        </IPoptip>
      </header>

      <main class="article-content">
        <ISpin v-if="loading" fix />
        <h1 class="question-title">{{ question.subject }}</h1>

        <div class="text-wrap" v-html="formatContent(answer.body)" />
      </main>

      <footer class="article-footer">
        <ArticleLike
          :like-count="answer.likes_count"
          :liked="answer.liked"
          :collected="answer.collected"
          :share="shareInfo"
          @like="onLike"
          @collect="onCollect"
        />

        <ArticleReward
          v-if="allowReward"
          type="answer"
          :article="answer.id"
          :count="rewardCount"
          :amount="rewardAmount"
          :rewards="rewards"
          @fetch="fetchRewards"
          @reward="onReward"
        />

        <hr>

        <ArticleComment
          ref="comment"
          type="answer"
          :count="answer.comments_count"
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
          <div class="avatar-wrap">
            <Avatar :user="user" :anonymity="answer.anonymity" />
            <IButton
              v-if="!answer.anonymity"
              type="primary"
              size="small"
              class="follow-btn"
              :class="{disabled: user.follower}"
              :loading="followUserLock"
              :title="user.follower ? '点击取消关注' : '点击关注用户'"
              @click="onFollowUser"
            >
              <template v-if="!followUserLock">
                {{ user.follower ? '已关注' : '+ 关注' }}
              </template>
            </IButton>
          </div>
          <div class="info">
            <h3>
              <template v-if="answer.anonymity">匿名用户</template>
              <nuxt-link v-else :to="`/user/${user.id}`">{{ user.name }}</nuxt-link>
            </h3>
            <p class="bio text-cut-3" :title="user.bio">
              {{ user.bio || '暂无简介' }}
            </p>
          </div>
        </div>
        <div v-if="!answer.anonymity" class="meta">
          <div class="meta-item">提问 <span>{{ user.extra.questions_count || 0 }}</span></div>
          <div class="meta-item">回答 <span>{{ user.extra.answers_count || 0 }}</span></div>
        </div>
      </SideWidget>

      <SideWidgetHotQuestions />
    </aside>

    <IModal
      v-model="showEdit"
      title="编辑回答"
      :transfer="false"
      :width="1080"
      :footer-hide="true"
      :mask-closable="false"
    >
      <PostAnswer
        v-if="showEdit"
        :question="question"
        :answer="answer"
        @after-patch="afterPatchAnswer"
      />
    </IModal>
  </article>
</template>

<script>
import { noop, limit, isNumber } from '@/utils'
import { convertLinkHTML } from '@/utils/text'
import markdown from '@/utils/markdown'
import SideWidget from '@/components/common/SideWidget.vue'
import ArticleLike from '@/components/common/ArticleLike.vue'
import ArticleReward from '@/components/common/ArticleReward.vue'
import ArticleComment from '@/components/common/ArticleComment.vue'
import SideWidgetHotQuestions from '@/components/question/SideWidgetHotQuestions.vue'
import PostAnswer from '@/components/question/PostAnswer.vue'

export default {
  name: 'QuestionAnswerDetail',
  components: {
    SideWidget,
    ArticleLike,
    ArticleReward,
    ArticleComment,
    SideWidgetHotQuestions,
    PostAnswer,
  },
  head: {
    title: '回答详情',
  },
  validate ({ params }) {
    return isNumber(params.questionId) && isNumber(params.answerId)
  },
  data () {
    return {
      answer: {},
      rewards: [],
      comments: [],

      loading: false,
      showMore: false,
      showEdit: false,
      followUserLock: false,
    }
  },
  computed: {
    question () {
      return this.answer.question || {}
    },
    user () {
      return this.answer.user || {}
    },
    isMyAnswer () {
      return this.logged && this.logged.id === this.user.id
    },
    rewardAmount: {
      get () {
        return this.answer.rewards_amount
      },
      set (val) {
        this.answer.rewards_amount = val
      },
    },
    rewardCount: {
      get () {
        return this.answer.rewarder_count
      },
      set (val) {
        this.answer.rewarder_count = val
      },
    },
    shareInfo () {
      return {
        title: this.answer.subject,
        content: this.answer.body,
      }
    },
  },
  async asyncData ({ $axios, params }) {
    const answer = await $axios.$get(`/question-answers/${params.answerId}`)
    return { answer }
  },
  methods: {
    formatContent (text) {
      text = markdown(text)
      text = convertLinkHTML(text)
      return text
    },
    async fetchRewards (offset = 0, callback = noop) {
      const list = await this.$axios.$get(`/question-answers/${this.answer.id}/rewarders`, { params: { offset, limit } })
      if (!offset) {
        this.rewards = list
      } else {
        this.rewards.push(...list)
      }
      const noMore = list.length < limit
      callback(noMore)
    },
    async fetchComments (after = 0, callback = noop) {
      const comments = await this.$axios.$get(`/question-answers/${this.answer.id}/comments`, { params: { after, limit } })
      if (!after) {
        this.comments = comments
      } else {
        this.comments.push(...comments)
      }
      const noMore = comments.length < limit
      callback(noMore)
    },
    async onLike (callback) {
      if (!this.answer.liked) {
        // 喜欢
        await this.$axios.$post(`/question-answers/${this.answer.id}/likes`)
        this.answer.likes_count += 1
        this.answer.liked = true
      } else {
        // 取消喜欢
        this.$axios.$delete(`/question-answers/${this.answer.id}/likes`)
        this.answer.likes_count -= 1
        this.answer.liked = false
      }
      callback()
    },
    async onCollect (callback) {
      if (!this.answer.collected) {
        // 收藏
        await this.$axios.$post(`/user/question-answer/collections/${this.answer.id}`)
        this.answer.collected = true
        this.$Message.success('收藏成功')
      } else {
        // 取消收藏
        await this.$axios.$delete(`/user/question-answer/collections/${this.answer.id}`)
        this.answer.collected = false
      }
      callback()
    },
    onReward (amount) {
      this.rewardCount += 1
      this.rewardAmount += amount
      this.fetchRewards()
    },
    async onComment (content, replyUser = {}) {
      const ret = await this.$axios.$post(`/question-answers/${this.answer.id}/comments`, {
        body: content,
        reply_user: replyUser.id,
      })
      this.$Message.success('评论成功')

      // 更新评论列表
      if (replyUser.id) ret.comment.reply = replyUser
      ret.comment.user = this.logged
      this.comments.unshift(ret.comment)
      this.answer.comments_count += 1

      // 清空评论框
      this.$refs.comment.clean()
    },
    async onCommentDelete (comment, callback) {
      await this.$axios.$delete(`/question-answers/${comment.commentable_id}/comments/${comment.id}`)
      this.$Message.success('删除成功')
      // 更新评论列表
      this.comments = this.comments.filter(item => item.id !== comment.id)
      this.answer.comments_count -= 1

      // 删除成功会调(关闭对话框)
      callback()
    },
    async onFollowUser () {
      this.followUserLock = true
      if (this.user.follower) {
        await this.$axios.$delete(`/user/followings/${this.user.id}`)
        this.user.follower = false
      } else {
        await this.$axios.$put(`/user/followings/${this.user.id}`)
        this.user.follower = true
        this.$Message.success('关注成功')
      }
      this.followUserLock = false
    },
    async onReport () {
      this.$root.$emit('report', {
        type: 'answer',
        id: this.answer.id,
      })
    },
    async onRepost () {
      this.$root.$emit('repost', {
        type: 'question-answers',
        source: this.answer,
      })
    },
    async onDelete () {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除这条回答？',
        onOk: async () => {
          await this.$axios.$delete(`/question-answers/${this.answer.id}`)
          this.$Message.success('删除成功')
          this.$router.back()
        },
      })
    },
    afterPatchAnswer () {
      this.fetchAnswer()
      this.showEdit = false
    },
    async fetchAnswer () {
      this.loading = true
      this.answer = await this.$axios.$get(`/question-answers/${this.answer.id}`)
      this.loading = false
    },
  },
}
</script>

<style lang="less" scoped>
.p-question-answer-detail {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

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

      h3 > a {
        display: flex;
        align-items: flex-end;

        small {
          flex: auto;
          display: inline-block;
          max-width: 80%;
          margin-left: 16px;
          color: @disabled-color;
          font-weight: normal;
        }
      }

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
    position: relative;
    margin: 30px 0;

    .question-title {
      color: @primary-color;
      margin-bottom: 24px;
    }

    .text-wrap {
      min-height: 100px;

      /deep/ a {
        color: @primary-color;
      }
    }
  }

  .widgets {
    position: sticky;
    top: 30px;
    flex: none;
    width: @sidebar-width;

    .author-widget {
      display: flex;
      flex-direction: column;

      .user {
        display: flex;
        padding: 16px;

        .avatar-wrap {
          flex: none;
          display: flex;
          flex-direction: column;
          align-items: center;

          .follow-btn {
            margin-top: 8px;

            &.disabled {
              cursor: pointer;
            }
          }
        }

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

  /deep/ .ProseMirror {
    min-height: 21px * 15;
    max-height: none;
  }
}
</style>
