<template>
  <li class="c-question-list-item">
    <h2 class="title">{{ question.subject }} <span>{{ question.created_at | fromNow }}</span></h2>
    <div class="user-info">
      <Avatar
        :user="user"
        size="xs"
        :anonymity="!user.name"
      />
      <span class="username">{{ user.name || '(匿名)' }}</span>
    </div>

    <p class="answer-body">{{ answer.body }}</p>
    <nuxt-link class="primary-color" :to="`/question/${question.id}/answer/${answer.id}`">查看详情</nuxt-link>

    <footer class="footer">
      <span>
        <svg class="icon"><use xlink:href="#icon-follow" /></svg>
        {{ question.watchers_count }}关注
      </span>
      <span>
        <svg class="icon"><use xlink:href="#icon-comment" /></svg>
        {{ question.answers_count }}条回答
      </span>
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

    > span {
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

    > span {
      margin-right: 1em;
    }
  }
}
</style>
