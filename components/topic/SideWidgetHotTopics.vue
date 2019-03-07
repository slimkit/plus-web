<template>
  <SideWidget
    v-if="topics.length"
    title="热门话题"
    :loading="loading"
  >
    <ul class="hot-list">
      <li
        v-for="(topic, index) in topics"
        :key="topic.id"
        :class="{top3: index < 3}"
      >
        <nuxt-link :to="`/topic/${topic.id}`">{{ topic.name }}</nuxt-link>
      </li>
    </ul>
  </SideWidget>
</template>

<script>
import SideWidget from '@/components/common/SideWidget.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SideWidgetHotTopics',
  components: {
    SideWidget,
  },
  data () {
    return {
      loading: true,
    }
  },
  computed: {
    ...mapState('topic', {
      topics: 'hot',
    }),
  },
  async mounted () {
    await this.getHotTopicList()
    this.loading = false
  },
  methods: {
    ...mapActions('topic', {
      getHotTopicList: 'getHotTopicList',
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
  }
}
</style>
