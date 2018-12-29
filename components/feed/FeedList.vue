<template>
  <div class="c-feed-list">
    <FeedListItem
      v-for="feed in pinneds"
      :key="`pinned-${feed.id}`"
      :feed="feed"
      :pinned="true"
    />
    <FeedListItem
      v-for="feed in feeds"
      :key="`feed-${feed.id}`"
      :feed="feed"
    />
  </div>
</template>

<script>
import FeedListItem from './FeedListItem.vue'

export default {
  name: 'FeedList',
  components: {
    FeedListItem,
  },
  props: {
    pinneds: { type: Array, default: () => [] },
    feeds: { type: Array, default: () => [] },
  },
}
</script>
