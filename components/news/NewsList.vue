<template>
  <ul class="c-news-list">
    <NewsListItem
      v-for="newsItem in news"
      :key="newsItem.id"
      :news="newsItem"
    />
  </ul>
</template>

<script>
import NewsListItem from './NewsListItem.vue'

export default {
  name: 'NewsList',
  components: {
    NewsListItem,
  },
  props: {
    news: { type: Array, default: () => [] },
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
