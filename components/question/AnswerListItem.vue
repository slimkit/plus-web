<template>
  <li class="c-answer-list-item">
    <div class="user-wrap">
      <Avatar :user="user" :anonymity="answer.anonymity" />
      <div class="user-info">
        <h4>
          <nuxt-link v-if="!answer.anonymity" :to="`/user/${user.id}`">{{ user.name }}</nuxt-link>
          <span v-else>匿名用户</span>

          <span v-if="answer.invited" class="badge invited">邀请回答</span>
          <span v-if="answer.adoption" class="badge adopt">已采纳</span>
        </h4>
        <time>{{ answer.created_at | fromNow }}</time>
      </div>
    </div>

    <template v-if="!isBlur">
      <div class="answer-body">
        {{ answer.body }}
      </div>
      <nuxt-link class="primary-color" :to="`/question/${question.id}/answer/${answer.id}`">查看详情</nuxt-link>
    </template>
    <div
      v-else
      class="answer-body blur"
      @click="viewAnswer"
    >
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut ipsa vero alias autem, facere beatae aliquid laborum iure molestiae assumenda. Quis voluptates itaque culpa eum perferendis accusantium nisi vero. Delectus repudiandae officiis porro fugit eaque at hic, optio quasi, rerum, esse voluptatibus? Architecto vero temporibus quia voluptates voluptate!
    </div>

    <footer class="extra">
      <a href="javascript:;" click="viewAnswer"><svg class="icon"><use xlink:href="#icon-comment" /></svg> {{ answer.comments_count }} 评论</a>

      <a @click="onLike"><svg class="icon"><use :xlink:href="answer.liked ? '#icon-likered' : '#icon-like'" /></svg> {{ answer.likes_count }} 点赞</a>

      <IPoptip v-model="showMore" placement="bottom">
        <template v-slot:default>
          <a><svg class="icon lg more"><use xlink:href="#icon-more" /></svg></a>
        </template>

        <template v-slot:content>
          <ul class="options" @click="showMore = false">
            <li :class="{active: answer.collected}" @click="onCollect"><svg class="icon"><use xlink:href="#icon-collect" /></svg> {{ answer.collected ? '已收藏' : '收藏' }}</li>
            <li @click="onRepost"><svg class="icon"><use xlink:href="#icon-share" /></svg> 转发</li>
            <li v-if="!isMyAnswer" @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
          </ul>
        </template>
      </IPoptip>

      <div class="devide" />

      <template v-if="question.look && answer.invited">
        <span>{{ answer.onlookers_count }}人正在围观</span>
        <IButton
          type="primary"
          size="small"
          class="onlook-btn"
          :disabled="answer.could"
          @click="onLook"
        >
          {{ answer.could ? '已围观':'围观' }}
        </IButton>
      </template>
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
    isMyQuestion () {
      return this.logged && this.logged.id === this.question.id
    },
    isMyAnswer () {
      return this.logged && this.logged.id === this.user.id
    },
    isBlur () {
      if (!this.logged) return true
      if (this.isMyQuestion || this.isMyAnswer) return false
      return (
        this.question.look &&
        this.answer.invited &&
        !this.answer.could
      )
    },
  },
  methods: {
    viewAnswer () {
      if (this.isBlur) return this.onLook()
      this.$router.push(`/question/${this.question.id}/answer/${this.answer.id}`)
    },
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
    async onLike () {
      await this.checkAuth()
      if (!this.answer.liked) {
        await this.$axios.$post(`/question-answers/${this.answer.id}/likes`)
        this.answer.liked = true
        this.answer.likes_count += 1
        this.$Message.success('点赞成功')
      } else {
        await this.$axios.$delete(`/question-answers/${this.answer.id}/likes`)
        this.answer.liked = false
        this.answer.likes_count -= 1
      }
    },
    onRepost () {
      const source = this.answer
      source.question = this.question
      this.$root.$emit('repost', {
        type: 'question-answers',
        source,
      })
    },
    onReport () {
      this.$root.$emit('report', {
        type: 'answer',
        id: this.answer.id,
      })
    },
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

      .badge {
        padding: 0 3px;
        margin-left: 8px;
        .border();
        border-radius: @border-radius-small;
        font-size: @font-size-small;
        font-weight: normal;

        &.adopt {
          color: @success-color;
          border-color: @success-color;
        }

        &.invited {
          color: @primary-color;
          border-color: @primary-color;
        }
      }

      time {
        color: @disabled-color;
        font-size: @font-size-small;
      }
    }
  }

  .answer-body {
    margin: 24px 0 18px;

    &.blur {
      filter: blur(5px);
      cursor: pointer;
    }
  }

  .extra {
    display: flex;
    align-items: center;
    margin-top: 18px;

    > * {
      margin-right: 24px;
      color: @disabled-color;

      &:last-child {
        margin-right: 0;
      }
    }

    .devide {
      margin-left: auto;
    }

    .onlook-btn {
      color: #fff;
      padding: 4px 16px;

      &[disabled] {
        color: @disabled-color;
        background-color: #fff;
      }
    }
  }
}
</style>
