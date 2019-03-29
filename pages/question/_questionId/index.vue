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
        <Avatar :user="question.user" />
        <div class="date">
          <nuxt-link class="username" :to="`/users/${question.user.id}`">{{ question.user.name }}</nuxt-link>
          <time>{{ question.created_at | fromNow }}</time>
        </div>
      </div>
      <h1 class="title">{{ question.subject }}</h1>
      <p class="description">{{ question.body }}</p>

      <div class="extra">
        <a>
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

        <IButton
          type="text"
          class="primary-color"
          size="small"
        >
          未设置悬赏
        </IButton>

        <IPoptip v-model="showMore" placement="bottom">
          <a><svg class="icon lg more"><use xlink:href="#icon-more" /></svg></a>

          <template v-slot:content>
            <ul class="options" @click="showMore = false">
              <li @click="onRepost"><svg class="icon"><use xlink:href="#icon-share" /></svg> 转发</li>
              <template v-if="isMine">
                <li @click="onDelete"><svg class="icon"><use xlink:href="#icon-delete" /></svg> 删除</li>
              </template>
              <template v-else>
                <li @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
              </template>
            </ul>
          </template>
        </IPoptip>

        <div class="devide" />

        <IButton
          class="extra-btn"
          type="primary"
          size="small"
        >
          已关注
        </IButton>
        <IButton
          class="extra-btn"
          type="primary"
          size="small"
        >
          写回答
        </IButton>
      </div>

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
    </header>

    <div class="question-answers-wrap">
      <main class="answers-list">
        <nav class="answer-nav">
          <h3>{{ allAnswers.length }} 个回答</h3>
          <IDropdown
            trigger="click"
            transform="true"
            @on-click="val => (orderType = val)"
          >
            <template v-slot:default>
              <a>默认排序 <svg class="icon sm triangle"><use xlink:href="#icon-arrowDown-copy" /></svg></a>
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
            <AnswerList :question="question" :answers="allAnswers" />
          </Loadmore>

          <div v-if="!allAnswers.length" v-empty:content />
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
import { limit } from '@/utils'
import SideWidget from '@/components/common/SideWidget.vue'
import SocialShare from '@/components/common/SocialShare.vue'
import AnswerList from '@/components/question/AnswerList.vue'
import { mapActions } from 'vuex'

export default {
  name: 'QuestionDetail',
  components: {
    SocialShare,
    SideWidget,
    AnswerList,
  },
  data () {
    return {
      question: {},
      orderType: 'default',
      answers: [],

      showMore: false,
    }
  },
  computed: {
    isMine () {
      return this.logged && this.logged.id === this.question.user_id
    },
    allAnswers () {
      return [...this.question.adoption_answers, ...this.answers]
    },
    relevantQuestions () {
      const list = this.$store.state.question.new || []
      return list.slice(0, 9)
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
        margin-left: 12px;
        color: @disabled-color;

        &:first-child {
          margin-left: 0;
        }
      }

      .devide {
        margin-left: auto;
      }

      .extra-btn {
        color: #fff;
        padding: 4px 16px;
      }
    }

    .meta-info {
      position: absolute;
      top: 30px;
      right: 30px;
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
  }

  .question-answers-wrap {
    position: relative;
    display: flex;
    align-items: flex-start;
  }

  .answers-list {
    flex: auto;
    margin-right: 30px;
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
