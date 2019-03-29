<template>
  <li class="c-question-list-item">
    <h2 class="title">
      <nuxt-link :to="`/question/${question.id}`">{{ question.subject }}</nuxt-link>
      <nuxt-link class="time" :to="`/question/${question.id}`">{{ question.created_at | fromNow }}</nuxt-link>
    </h2>
    <div class="user-info">
      <Avatar
        :user="user"
        size="xs"
        :anonymity="!user.name"
      />
      <nuxt-link :to="`/user/${user.id}`" class="username">{{ user.name || '(匿名)' }}</nuxt-link>
    </div>

    <p class="answer-body">{{ answer.body }}</p>
    <nuxt-link class="primary-color" :to="`/question/${question.id}/answer/${answer.id}`">查看详情</nuxt-link>

    <footer class="footer">
      <nuxt-link :to="`/question/${question.id}`">
        <svg class="icon"><use xlink:href="#icon-follow" /></svg>
        {{ question.watchers_count }}关注
      </nuxt-link>
      <nuxt-link :to="`/question/${question.id}`">
        <svg class="icon"><use xlink:href="#icon-comment" /></svg>
        {{ question.answers_count }}条回答
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
    margin: 16px 0;

    .username {
      margin-left: 8px;
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
