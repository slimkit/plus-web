<template>
  <div class="p-user-question">
    <nav class="cate-wrap">
      <IPoptip
        v-model="showQuestionCate"
        class="cate"
        placement="bottom"
      >
        <div class="label" :class="{active: ['questions', 'questionInvited', 'questionReward', 'questionOther'].includes(type)}">
          <template>全部问题</template>
          <i class="drop-icon" :class="{open: showQuestionCate}" />
        </div>

        <template v-slot:content>
          <ul class="options" @click="showQuestionCate = false">
            <li :class="{active: type == 'questions'}" @click="type = 'questions'">全部问题</li>
            <li :class="{active: type == 'questionInvited'}" @click="type = 'questionInvited'">邀请提问</li>
            <li :class="{active: type == 'questionReward'}" @click="type = 'questionReward'">悬赏提问</li>
            <li :class="{active: type == 'questionOther'}" @click="type = 'questionOther'">其他提问</li>
          </ul>
        </template>
      </IPoptip>

      <IPoptip
        v-model="showAnswerCate"
        class="cate"
        placement="bottom"
      >
        <div class="label" :class="{active: ['answers', 'answersAdopt', 'answersInvited', 'answersOther'].includes(type)}">
          <template>我的回答</template>
          <i class="drop-icon" :class="{open: showAnswerCate}" />
        </div>

        <template v-slot:content>
          <ul class="options" @click="showAnswerCate = false">
            <li :class="{active: type == 'answers'}" @click="type = 'answers'">我的回答</li>
            <li :class="{active: type == 'answersAdopt'}" @click="type = 'answersAdopt'">被采纳</li>
            <li :class="{active: type == 'answersInvited'}" @click="type = 'answersInvited'">被邀请</li>
            <li :class="{active: type == 'answersOther'}" @click="type = 'answersOther'">其他回答</li>
          </ul>
        </template>
      </IPoptip>

      <nuxt-link
        class="cate"
        :to="{query: {type: 'followedQuestion'}}"
        :class="{'exact-active': type === 'followedQuestion'}"
      >
        关注的问题
      </nuxt-link>

      <nuxt-link
        class="cate"
        :to="{query: {type: 'followedTopic'}}"
        :class="{'exact-active': type === 'followedTopic'}"
      >
        关注的专题
      </nuxt-link>
    </nav>

    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <QuestionList v-if="isQuestion" :questions="questions" />
      <AnswerList v-if="isAnswer" :answers="answers" />
      <QuestionList v-if="isFollowedQuestion" :questions="followedQuestions" />
      <QuestionTopicList v-if="isQuestionTopic" :topics="topics" />
    </Loadmore>
  </div>
</template>

<script>
import { limit, getLastField } from '@/utils'
import QuestionList from '@/components/question/QuestionList.vue'
import QuestionTopicList from '@/components/question/QuestionTopicList.vue'
import AnswerList from '@/components/question/AnswerList.vue'

const questionTypeMap = {
  questions: 'all',
  questionInvited: 'invitation',
  questionReward: 'reward',
  questionOther: 'other',
}

const answerTypeMap = {
  answers: 'all',
  answersAdopt: 'adoption',
  answersInvited: 'invitation',
  answersOther: 'other',
}

export default {
  name: 'UserQuestion',
  components: {
    QuestionList,
    AnswerList,
    QuestionTopicList,
  },
  data () {
    return {
      questions: [],
      answers: [],
      topics: [],
      followedQuestions: [],

      showQuestionCate: false,
      showAnswerCate: false,
    }
  },
  computed: {
    type: {
      get () {
        return this.$route.query.type || 'questions'
      },
      set (type) {
        this.$router.replace({ query: { type } })
      },
    },
    isQuestion () {
      return Object.keys(questionTypeMap).includes(this.type)
    },
    isAnswer () {
      return Object.keys(answerTypeMap).includes(this.type)
    },
    isQuestionTopic () {
      return this.type === 'followedTopic'
    },
    isFollowedQuestion () {
      return this.type === 'followedQuestion'
    },
  },
  watch: {
    type () {
      this.loader.beforeRefresh()
    },
  },
  methods: {
    async onRefresh () {
      let noMore = true
      if (this.isQuestion) {
        this.questions = await this.fetchQuestions()
        noMore = this.questions.length < limit
      } else if (this.isAnswer) {
        this.answers = await this.fetchAnswers()
        noMore = this.answers.length < limit
      } else if (this.isFollowedQuestion) {
        this.followedQuestions = await this.fetchFollowedQuestions()
        noMore = this.followedQuestions.length < limit
      } else if (this.isQuestionTopic) {
        this.topics = await this.fetchTopics()
        noMore = this.topics.length < limit
      }
      this.loader.afterRefresh(noMore)
    },
    async onLoadmore () {
      let noMore = true
      if (this.isQuestion) {
        const after = getLastField(this.questions)
        const list = await this.fetchQuestions(after)
        this.questions.push(...list)
        noMore = list.length < limit
      } else if (this.isAnswer) {
        const after = getLastField(this.answers)
        const list = await this.fetchAnswers(after)
        this.answers.push(...list)
        noMore = list.length < limit
      } else if (this.isFollowedQuestion) {
        const list = await this.fetchFollowedQuestions()
        this.followedQuestions.push(...list)
        noMore = list.length < limit
      } else if (this.isQuestionTopic) {
        const after = getLastField(this.topics)
        const list = await this.fetchTopics(after)
        this.topics.push(...list)
        noMore = list.length < limit
      }
      this.loader.afterLoadmore(noMore)
    },
    async fetchQuestions (after = 0) {
      const type = questionTypeMap[this.type]
      const params = { type, user_id: this.logged.id, limit, after }
      const questions = await this.$axios.$get('/user/questions', { params })
      return questions
    },
    async fetchAnswers (after = 0) {
      const type = answerTypeMap[this.type]
      const params = { type, user_id: this.logged.id, limit, after }
      const answers = await this.$axios.$get('/user/question-answer', { params })
      return answers
    },
    async fetchFollowedQuestions () {
      const params = { limit, offset: this.followedQuestions.length }
      const answers = await this.$axios.$get('/user/question-watches', { params })
      return answers
    },
    async fetchTopics (after = 0) {
      const params = { limit, after, type: 'follow' }
      const topics = await this.$axios.$get('/user/question-topics', { params })
      return topics
    },
  },
}
</script>

<style lang="less" scoped>
.p-user-question {
  .cate-wrap {
    display: flex;
    margin-bottom: 16px;

    .cate {
      display: flex;
      align-items: center;
      margin-right: 2em;

      .label {
        display: flex;
        align-items: center;
        cursor: pointer;

        i.drop-icon {
          display: inline-block;
          width: 0;
          height: 0;
          margin-left: 4px;
          border: 6px solid transparent;
          border-top-color: @text-color;
          transform-origin: center 2px;
          transform: translateY(2px);
          transition: transform .2s;

          &.open {
            transform: translateY(4px) rotate(180deg);
          }
        }

        &.active {
          color: @primary-color;
        }
      }

      .options {
        text-align: center;
        font-size: @font-size-base;

        > li {
          &.active {
            color: @primary-color;
          }
          &.disabled {
            color: @disabled-color;
            cursor: not-allowed;
          }
        }
      }

      &.exact-active {
        color: @primary-color;
      }
    }
  }
}
</style>
