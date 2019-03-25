<template>
  <li class="c-question-topic-list-item">
    <nuxt-link :to="`/question/topic/${topic.id}`" class="cover" />

    <div class="info">
      <h2><nuxt-link :to="`/question/topic/${topic.id}`">{{ topic.name }}</nuxt-link></h2>
      <p>关注 <span>{{ topic.follows_count }}</span> 回答 <span>{{ topic.questions_count }}</span></p>
      <IButton
        class="follow-btn"
        :class="{disabled: hasFollowed}"
        size="small"
        shape="circle"
        type="primary"
        ghost
        :title="hasFollowed ? '点击取消关注' : '点击关注专题'"
      >
        {{ hasFollowed ? '已关注' :'+ 关注' }}
      </IButton>
    </div>
  </li>
</template>

<script>
export default {
  name: 'QuestionTopicListItem',
  props: {
    topic: { type: Object, required: true },
  },
  computed: {
    hasFollowed () {
      return this.$route.query.type === 'follow' || this.topic.has_follow
    },
  },
}
</script>

<style lang="less" scoped>
.c-question-topic-list-item {
  display: flex;

  .cover {
    flex: none;
    width: 100px;
    height: 100px;
    background: @border-color-base url(~assets/images/default_image.png) no-repeat center / cover;
  }

  .info {
    flex: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    margin-left: 15px;

    h2 {
      font-size: @font-size-large;
    }

    p {
      font-size: @font-size-small;
      color: @disabled-color;

      span {
        color: @primary-color;
      }
    }

    .follow-btn {
      cursor: pointer;

      &:hover {
        border-color: @primary-color;
      }
    }
  }
}
</style>
