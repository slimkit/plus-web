<template>
  <ul class="c-news-list">
    <template v-for="(newsItem, index) in news">
      <Component
        :is="computedComponent(newsItem)"
        :key="index"
        :news="newsItem"
        v-bind="$attrs"
      />
    </template>
  </ul>
</template>

<script>
import NewsListItem from './NewsListItem.vue'
import NewsListAdvertiseItem from '@/components/advertise/NewsListAdvertiseItem.vue'

export default {
  name: 'NewsList',
  components: {
    NewsListItem,
    NewsListAdvertiseItem,
  },
  props: {
    news: { type: Array, default: () => [] },
  },
  methods: {
    computedComponent (item) {
      if (!item) return
      if (item.itemType === 'advertise') return NewsListAdvertiseItem
      return NewsListItem
    },
  },
}
</script>

<style lang="less" scoped>
.c-news-list {
  background: #fff;

  .c-news-list-item {
    padding: 24px 0;
    .border(bottom);

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
