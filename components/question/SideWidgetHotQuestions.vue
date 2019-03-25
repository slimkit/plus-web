<template>
  <SideWidget
    v-if="questions.length"
    title="热门问题"
    :loading="loading"
  >
    <ul class="hot-list">
      <li
        v-for="(question, index) in questions.slice(0, 9)"
        :key="question.id"
        :class="{top3: index < 3}"
      >
        <nuxt-link class="text-cut" :to="`/question/${question.id}`">{{ question.subject }}</nuxt-link>
      </li>
    </ul>
  </SideWidget>
</template>

<script>
import SideWidget from '@/components/common/SideWidget.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SideWidgetHotQuestions',
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
      questions: 'hot',
    }),
  },
  async mounted () {
    await this.getQuestionList({ type: 'hot', limit: 9 })
    this.loading = false
  },
  methods: {
    ...mapActions('question', {
      getQuestionList: 'getQuestionList',
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
  }
}
</style>
