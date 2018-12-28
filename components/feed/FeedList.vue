<template>
  <div class="c-feed-list">
    <FeedItem
      v-for="feed in pinneds"
      :key="`pinned-${feed.id}`"
      :feed="feed"
      :pinned="true"
    />
    <FeedItem
      v-for="feed in feeds"
      :key="`feed-${feed.id}`"
      :feed="feed"
    />
  </div>
</template>

<script>
import FeedItem from './FeedItem.vue'

export default {
  name: 'FeedList',
  components: {
    FeedItem,
  },
  props: {
    pinneds: { type: Array, default: () => [] },
    feeds: { type: Array, default: () => [] },
  },
}
</script>
