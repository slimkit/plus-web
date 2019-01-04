<template>
  <div class="c-news-list">
    <NewsListItem
      v-for="news in news"
      :key="`news-${news.id}`"
      :news="news"
    />
  </div>
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
<style lang="less">
.c-news-list{
  background: #fff;
}
</style>
