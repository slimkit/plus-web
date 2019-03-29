<template>
  <li class="c-answer-list-item">
    <div class="user-wrap">
      <Avatar :user="user" />
      <div class="user-info">
        <h4><nuxt-link :to="`/user/${user.id}`">{{ user.name }}</nuxt-link></h4>
        <time>{{ answer.created_at | fromNow }}</time>
      </div>
    </div>
    <div class="answer-body">
      {{ answer.body }}
    </div>
    <nuxt-link class="primary-color" :to="`/question/${question.id}/answer/${answer.id}`">查看详情</nuxt-link>

    <footer class="extra">
      <nuxt-link :to="`/question/${question.id}/answer/${answer.id}`"><svg class="icon"><use xlink:href="#icon-comment" /></svg> {{ answer.comments_count }} 评论</nuxt-link>

      <a @click="onLike"><svg class="icon"><use :xlink:href="answer.liked ? '#icon-likered' : '#icon-like'" /></svg> {{ answer.likes_count }} 点赞</a>

      <IPoptip v-model="showMore" placement="bottom">
        <template v-slot:default>
          <a><svg class="icon lg more"><use xlink:href="#icon-more" /></svg></a>
        </template>

        <template v-slot:content>
          <ul class="options" @click="showMore = false">
            <li :class="{active: answer.collected}" @click="onCollect"><svg class="icon"><use xlink:href="#icon-collect" /></svg> {{ answer.collected ? '已收藏' : '收藏' }}</li>
            <li @click="onRepost"><svg class="icon"><use xlink:href="#icon-share" /></svg> 转发</li>
            <li v-if="!isMine" @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
          </ul>
        </template>
      </IPoptip>
    </footer>
  </li>
</template>

<script>
export default {
  name: 'AnswerListItem',
  props: {
    question: { type: Object, required: true },
    answer: { type: Object, required: true },
  },
  data () {
    return {
      showMore: false,
    }
  },
  computed: {
    user () {
      return this.answer.user || {}
    },
    isMine () {
      return this.logged && this.logged.id === this.user.id
    },
  },
  methods: {
    async onCollect () {
      if (!this.answer.collected) {
        await this.$axios.$post(`/user/question-answer/collections/${this.answer.id}`)
        this.$Message.success('收藏成功')
      } else {
        await this.$axios.$delete(`/user/question-answer/collections/${this.answer.id}`)
        this.$Message.success('取消收藏')
      }
      this.answer.collected = !this.answer.collected
    },
    onLike () {},
    onRepost () {},
    onReport () {},
  },
}
</script>

<style lang="less" scoped>
.c-answer-list-item {
  padding: 24px 0;
  .border(bottom);
  &:last-child {
    border-bottom: none;
  }

  .user-wrap {
    display: flex;

    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-left: 16px;

      time {
        color: @disabled-color;
        font-size: @font-size-small;
      }
    }
  }

  .answer-body {
    margin: 24px 0 18px;
  }

  .extra {
    display: flex;
    align-items: center;
    margin-top: 18px;

    > * {
      margin-right: 24px;
      color: @disabled-color;
    }
  }
}
</style>
