<template>
  <SideWidget title="热门专题" :loading="loading">
    <ul class="hot-list">
      <li
        v-for="(topic, index) in topics.slice(0, 9)"
        :key="topic.id"
        :class="{top3: index < 3}"
      >
        <nuxt-link class="text-cut" :to="`/question/topic/${topic.id}`">{{ topic.name }}</nuxt-link>
        <p>关注 {{ topic.follows_count }} 问题 {{ topic.questions_count }}</p>
      </li>
    </ul>
  </SideWidget>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SideWidget from '@/components/common/SideWidget.vue'

export default {
  name: 'SideWidgetHotQuestionTopics',
  components: {
    SideWidget,
  },
  data () {
    return {
      loading: true,
    }
  },
  computed: {
    ...mapState('question', {
      topics: 'topics',
    }),
  },
  async mounted () {
    await this.getQuestionTopicList({ limit: 9 })
    this.loading = false
  },
  methods: {
    ...mapActions('question', {
      getQuestionTopicList: 'getQuestionTopicList',
    }),
  },
}
</script>

<style lang="less" scoped>
.hot-list {
  counter-reset: hot;

  li {
    position: relative;
    margin: 24px 0;
    margin-left: 32px;

    &::before {
      counter-increment: hot;
      content: counter(hot);
      position: absolute;
      top: 50%;
      left: -26px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      margin-top: -8px;
      border-radius: @border-radius-small;
      background-color: @text-info-color;
      font-size: 80%;
      color: #fff;
    }

    &.top3::before {
      background-color: @primary-color;
    }

    h2 {
      bottom: 12px;
      font-size: @font-size-base;
      font-weight: normal;
    }

    > a {
      display: inline-block;
      width: 100%;
    }

    p {
      color: @disabled-color;
      font-size: @font-size-small;
    }
  }
}
</style>
