<template>
  <li class="c-question-list-item">
    <h2 class="title">
      <nuxt-link :to="`/question/${question.id}`">{{ question.subject }}</nuxt-link>
      <nuxt-link class="time" :to="`/question/${question.id}`">{{ question.created_at | fromNow }}</nuxt-link>
    </h2>

    <template v-if="answer.id">
      <div v-if="user.name" class="user-info">
        <Avatar
          :user="user"
          size="xs"
          :anonymity="!user.name"
        />
        <nuxt-link :to="`/user/${user.id}`" class="username">{{ user.name || '(匿名)' }}</nuxt-link>
      </div>
      <p v-if="!isBlur" class="answer-body">
        {{ answer.body }}
        <nuxt-link class="primary-color" :to="`/question/${question.id}/answer/${answer.id}`">查看详情</nuxt-link>
      </p>
      <p
        v-else
        class="answer-body blur"
        @click="onLook"
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea repudiandae quod perspiciatis est ullam praesentium asperiores recusandae magni earum tempora.
      </p>
    </template>

    <footer class="footer">
      <nuxt-link :to="`/question/${question.id}`">
        <svg class="icon"><use xlink:href="#icon-follow" /></svg>
        {{ question.watchers_count }} 关注
      </nuxt-link>
      <nuxt-link :to="`/question/${question.id}`">
        <svg class="icon"><use xlink:href="#icon-comment" /></svg>
        {{ question.answers_count }} 条回答
      </nuxt-link>
      <nuxt-link v-if="question.amount" :to="`/question/${question.id}`">
        <svg class="icon"><use xlink:href="#icon-money" /></svg>
        {{ question.amount }}
      </nuxt-link>
    </footer>
  </li>
</template>

<script>
export default {
  name: 'QuestionListItem',
  props: {
    question: { type: Object, required: true },
  },
  computed: {
    user () {
      return this.answer.user || {}
    },
    answer () {
      return this.question.answer || {}
    },
    isMyQuestion () {
      return this.logged && this.logged.id === this.question.id
    },
    isMyAnswer () {
      return this.logged && this.logged.id === this.answer.id
    },
    isBlur () {
      if (this.isMyQuestion || this.isMyAnswer) return false
      return (
        this.question.look &&
        this.answer.invited &&
        (!this.logged || !this.answer.could)
      )
    },
  },
  methods: {
    async onLook () {
      const amount = this.boot['Q&A'].onlookers_amount || 0
      this.$root.$emit('pay', {
        title: '围观支付',
        content: `本次围观您需要支付${amount}积分，是否继续围观？`,
        api: `/question-answers/${this.answer.id}/currency-onlookers`,
        callback: ({ answer }, amount) => {
          this.answer.body = answer.body
          this.answer.could = true
          this.answer.onlookers_count += 1
          this.answer.onlookers_total = +this.answer.onlookers_total + amount
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.c-question-list-item {
  padding: 24px 0 12px;
  .border(bottom);

  .title {
    display: flex;
    align-items: center;
    font-size: @font-size-large;

    .time {
      margin-left: auto;
      font-size: @font-size-small;
      font-weight: normal;
      color: @disabled-color;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    margin: 24px 0 8px;

    .username {
      margin-left: 8px;
    }
  }

  .answer-body {
    &.blur {
      filter: blur(5px);
      cursor: pointer;
    }
  }

  .footer {
    padding: 12px 0;
    margin-top: 12px;
    color: @disabled-color;

    > a {
      margin-right: 1em;
    }
  }
}
</style>
