<template>
  <div class="p-question-detail">
    <header class="header">
      <ul class="tags">
        <Tag
          v-for="topic in question.topics"
          :key="topic.id"
          :selected="true"
          size="sm"
        >
          <nuxt-link :to="`/question/topic/${topic.id}`">{{ topic.name }}</nuxt-link>
        </Tag>
      </ul>

      <div class="user-info">
        <Avatar :user="question.user" :anonymity="question.anonymity" />
        <div class="date">
          <nuxt-link
            v-if="!question.anonymity"
            class="username"
            :to="`/users/${question.user.id}`"
          >
            {{ question.user.name }}
          </nuxt-link>
          <span v-else-if="isMine" class="username">{{ question.user.name }} (匿名)</span>
          <span v-else>匿名用户</span>
          <time>{{ question.created_at | fromNow }}</time>
        </div>
      </div>

      <h1 class="title">{{ question.subject }}</h1>
      <p class="description">{{ question.body }}</p>

      <div class="extra">
        <a @click="showPostAnswer = false, showComment = !showComment">
          <svg class="icon"><use xlink:href="#icon-comment" /></svg>
          {{ question.comments_count }} 评论
        </a>
        <IPoptip
          trigger="hover"
          placement="bottom"
          class="poptip-social-share"
        >
          <template v-slot:default>
            <a class="disabled-color"><svg class="icon"><use xlink:href="#icon-share" /></svg> 分享</a>
          </template>

          <template v-slot:content>
            <SocialShare
              :title="question.subject"
              :description="question.body"
            />
          </template>
        </IPoptip>

        <div class="set-amount">
          <a v-if="!question.amount">未设置悬赏</a>
          <a v-else-if="question.invitations.length">已邀请悬赏</a>
          <a v-else>已设置悬赏 金额：{{ question.amount }}</a>
        </div>

        <IPoptip v-model="showMore" placement="bottom">
          <a><svg class="icon lg more"><use xlink:href="#icon-more" /></svg></a>

          <template v-slot:content>
            <ul class="options" @click="showMore = false">
              <li @click="onRepost"><svg class="icon"><use xlink:href="#icon-share" /></svg> 转发</li>
              <template v-if="isMine">
                <li v-if="!question.excellent" @click="applyExtra"><svg class="icon"><use xlink:href="#icon-text" /></svg> 申请为精选</li>
                <li @click="onDelete"><svg class="icon"><use xlink:href="#icon-delete" /></svg> 删除</li>
              </template>
              <template v-else>
                <li @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
              </template>
            </ul>
          </template>
        </IPoptip>

        <div class="devide" />

        <span v-if="question.amount && question.invitations.length && totalLookAmount" class="onlook-amount">总围观金额：{{ totalLookAmount }}</span>

        <IButton
          class="extra-btn"
          :class="{disabled: question.watched}"
          type="primary"
          size="small"
          :loading="followLock"
          :title="question.watched ? '点击取消关注' : '点击关注问题'"
          @click="onFollow"
        >
          {{ question.watched ? '已关注' : '关注' }}
        </IButton>
        <IButton
          v-if="question.my_answer"
          key="view-answer"
          class="extra-btn"
          type="primary"
          size="small"
          :to="`/question/${question.id}/answer/${question.my_answer.id}`"
        >
          查看回答
        </IButton>
        <IButton
          v-else
          key="create-answer"
          class="extra-btn"
          type="primary"
          size="small"
          @click="showComment = false, showPostAnswer = !showPostAnswer"
        >
          写回答
        </IButton>
      </div>

      <div class="other-info">
        <div class="meta-info">
          <div class="meta">
            <strong>{{ question.watchers_count }}</strong>
            关注
          </div>
          <div class="meta">
            <strong>{{ question.views_count }}</strong>
            浏览
          </div>
        </div>

        <div v-if="question.amount && question.invitations.length" class="invite-info">
          <span class="amount">¥{{ question.amount }}</span>
          <span class="invitor">
            已邀请悬赏：
            <div
              v-for="u in question.invitations"
              :key="u.id"
              class="invite-user"
            >
              <Avatar :user="u" size="xs" />
              {{ u.name }}
            </div>
          </span>
        </div>
      </div>
    </header>

    <div class="question-answers-wrap">
      <main class="left-wrap">
        <Collapse>
          <div v-if="showPostAnswer" class="post-answer-wrap">
            <PostAnswer :question="question" />
          </div>
        </Collapse>

        <Collapse>
          <div v-if="showComment" class="comment-list">
            <ArticleComment
              ref="comment"
              type="question"
              :count="question.comments_count"
              :comments="comments"
              @fetch="fetchComments"
              @comment="onComment"
              @comment:delete="onCommentDelete"
            />
          </div>
        </Collapse>

        <div class="answers-list">
          <nav class="answer-nav">
            <h3>{{ question.answers_count }} 个回答</h3>
            <IDropdown
              trigger="click"
              transform="true"
              @on-click="val => (orderType = val)"
            >
              <template v-slot:default>
                <a>{{ orderType === 'default' ? '默认排序' : '时间排序' }} <svg class="icon sm triangle"><use xlink:href="#icon-arrowDown-copy" /></svg></a>
              </template>
              <template v-slot:list>
                <IDropdownMenu>
                  <IDropdownItem name="default" :selected="orderType === 'default'">默认排序</IDropdownItem>
                  <IDropdownItem name="time" :selected="orderType === 'time'">时间排序</IDropdownItem>
                </IDropdownMenu>
              </template>
            </IDropdown>
          </nav>

          <div class="answers">
            <Loadmore
              ref="loader"
              :show-bottom="allAnswers.length"
              @refresh="onRefresh"
              @loadmore="onLoadmore"
            >
              <AnswerList
                :question="question"
                :answers="allAnswers"
                @delete="afterDeleteAnswer"
              />
            </Loadmore>

            <div v-if="!allAnswers.length" v-empty:content />
          </div>
        </div>
      </main>

      <aside class="side-wrap">
        <SideWidget :loading="!relevantQuestions.length" title="相关问题推荐">
          <ul class="relevant-questions">
            <li v-for="quest in relevantQuestions" :key="quest.id">
              <nuxt-link :to="`/question/${quest.id}`">{{ quest.subject }}</nuxt-link>
            </li>
          </ul>
        </SideWidget>
      </aside>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { limit, noop } from '@/utils'
import SideWidget from '@/components/common/SideWidget.vue'
import SocialShare from '@/components/common/SocialShare.vue'
import ArticleComment from '@/components/common/ArticleComment.vue'
import AnswerList from '@/components/question/AnswerList.vue'
import PostAnswer from '@/components/question/PostAnswer.vue'

export default {
  name: 'QuestionDetail',
  components: {
    SocialShare,
    SideWidget,
    ArticleComment,
    AnswerList,
    PostAnswer,
  },
  data () {
    return {
      question: {},
      orderType: 'default',
      answers: [],
      comments: [],

      showMore: false,
      showComment: false,
      showPostAnswer: false,
      followLock: false,
    }
  },
  computed: {
    isMine () {
      return this.logged && this.logged.id === this.question.user_id
    },
    allAnswers () {
      return [
        ...this.question.invitation_answers,
        ...this.question.adoption_answers,
        ...this.answers,
      ]
    },
    relevantQuestions () {
      const list = this.$store.state.question.new || []
      return list.slice(0, 9)
    },
    totalLookAmount () {
      return this.question.invitation_answers
        .map(a => +a.onlookers_total)
        .reduce((sum, i) => sum + i, 0)
    },
  },
  watch: {
    orderType () {
      this.loader.beforeRefresh()
    },
  },
  async asyncData ({ params, $axios }) {
    const questionId = +params.questionId
    const question = await $axios.$get(`/questions/${questionId}`)
    return { question }
  },
  mounted () {
    this.getQuestionList({ type: 'new' })
  },
  methods: {
    ...mapActions('question', {
      getQuestionList: 'getQuestionList',
    }),
    async onRefresh () {
      const params = { limit: limit, order_type: this.orderType }
      const list = await this.$axios.$get(`/questions/${this.question.id}/answers`, { params })
      this.answers = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { limit: limit, order_type: this.orderType, offset: this.answers.length }
      const list = await this.$axios.$get(`/questions/${this.question.id}/answers`, { params })
      this.answers.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
    async fetchComments (after = 0, callback = noop) {
      const params = { after, limit }
      const comments = await this.$axios.$get(`/questions/${this.question.id}/comments`, { params })
      if (!after) {
        this.comments = comments
      } else {
        this.comments.push(...comments)
      }
      const noMore = comments.length < limit
      callback(noMore)
    },
    async onComment (content, replyUser = {}) {
      const ret = await this.$axios.$post(`/questions/${this.question.id}/comments`, {
        body: content,
        reply_user: replyUser.id,
      })
      this.$Message.success('评论成功')

      // 更新评论列表
      if (replyUser.id) ret.comment.reply = replyUser
      ret.comment.user = this.logged
      this.comments.unshift(ret.comment)
      this.question.comments_count += 1

      // 清空评论框
      this.$refs.comment.clean()
    },
    async onCommentDelete (comment, callback) {
      await this.$axios.$delete(`/questions/${comment.commentable_id}/comments/${comment.id}`)
      this.$Message.success('删除成功')
      // 更新评论列表
      this.comments = this.comments.filter(item => item.id !== comment.id)
      this.question.comments_count -= 1

      // 删除成功会调(关闭对话框)
      callback()
    },
    onRepost () {
      this.$root.$emit('repost', {
        type: 'questions',
        source: this.question,
      })
    },
    onReport () {
      this.$root.$emit('report', {
        type: 'question',
        id: this.question.id,
      })
    },
    onDelete () {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要删除该问题？',
        onOk: async () => {
          await this.$axios.$delete(`/questions/${this.question.id}`)
          this.$Message.success('删除成功!')
          this.$router.back()
        },
      })
    },
    afterDeleteAnswer (answerId, index) {
      this.answers = this.answers.filter(a => a.id !== answerId)
      this.question.answers_count -= 1
    },
    async onFollow () {
      this.followLock = true
      if (this.question.watched) {
        await this.$axios.$delete(`/user/question-watches/${this.question.id}`)
        this.question.watched = false
        this.question.watchers_count -= 1
      } else {
        await this.$axios.$put(`/user/question-watches/${this.question.id}`)
        this.question.watched = true
        this.question.watchers_count += 1
        this.$Message.success('关注问题成功！')
      }
      this.followLock = false
    },
    async applyExtra () {
      const amount = this.boot['Q&A'].apply_amount
      if (amount > 0) {
        this.$Modal.confirm({
          title: '精选问答支付',
          content: `本次申请精选您需要支付<strong class="pay-amount error-color">${amount}</strong>积分，是否继续？`,
          onOk: async () => {
            const password = await new Promise(resolve => {
              this.$root.$emit('password', password => resolve(password))
            })
            if (!password) return
            await this.$axios.$post(`/user/currency-question-application/${this.question.id}`, { password })
              .finally(() => {
                this.$root.$emit('password:close')
              })
            this.$Message.success('申请成功!')
          },
        })
      } else {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要申请该问题为精选问题？',
          onOk: async () => {
            await this.$axios.$post(`/user/currency-question-application/${this.question.id}`)
            this.$Message.success('申请成功!')
          },
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.p-question-detail {
  .header {
    position: relative;
    padding: 30px;
    margin-bottom: 30px;
    background-color: #fff;

    .tags {
      display: flex;
      margin-bottom: 16px;

      > li {
        margin-right: 8px;
      }
    }

    .user-info {
      display: flex;
      align-items: center;

      .date {
        display: flex;
        flex-direction: column;
        margin-left: 18px;

        .username {
          font-size: @font-size-large;
        }

        time {
          font-size: @font-size-small;
          color: @disabled-color;
        }
      }
    }

    .title {
      font-size: 24px;
      margin: 16px 0;
    }

    .extra {
      display: flex;
      align-items: center;
      font-size: @font-size-small;
      margin-top: 24px;

      > * {
        margin-left: 16px;
        color: @disabled-color;

        &:first-child {
          margin-left: 0;
        }
      }

      .set-amount {
        a {
          color: @primary-color;
        }
      }

      .devide {
        margin-left: auto;
      }

      .onlook-amount {
        margin-right: 24px;
        color: @primary-color;
      }

      .extra-btn {
        color: #fff;
        padding: 4px 16px;

        &.disabled {
          cursor: pointer;
          color: @disabled-color;
        }
      }
    }

    .other-info {
      position: absolute;
      top: 30px;
      right: 30px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .meta-info {
      display: flex;

      .meta {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 4px 24px;
        .border(right);

        &:last-child {
          border: none;
        }

        strong {
          color: @primary-color;
          font-size: @font-size-large;
        }
      }
    }

    .invite-info {
      display: flex;
      align-items: center;
      margin-top: 16px;

      .amount {
        color: @error-color;
        margin-right: 1em;
        font-size: @font-size-large;
      }

      .invitor {
        display: inline-flex;
        align-items: center;
      }

      .invite-user {
        display: inline-flex;
        align-items: center;

        .c-avatar {
          margin-right: 8px;
        }
      }
    }

  }

  .question-answers-wrap {
    position: relative;
    display: flex;
    align-items: flex-start;
  }

  .left-wrap {
    flex: auto;
    margin-right: 30px;
  }

  .post-answer-wrap {
    padding: 30px;
    background-color: #fff;
    margin-bottom: 30px;
  }

  .comment-list {
    padding: 30px;
    background-color: #fff;
    margin-bottom: 30px;
  }

  .answers-list {
    padding: 30px;
    background-color: #fff;

    .answer-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      .border(bottom);
    }

    .triangle {
      transform: rotateZ(180deg);
    }

    .answers {
      margin-top: 16px;
    }
  }

  .side-wrap {
    position: sticky;
    top: 30px;
    flex: none;
    width: @sidebar-width;
    background-color: #fff;

    .relevant-questions {

      > li {
        margin: 16px 0;
      }
    }
  }
}
</style>
