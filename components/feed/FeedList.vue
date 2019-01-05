<template>
  <div class="c-feed-list">
    <keep-alive>
      <FeedListItem
        v-for="feed in pinneds"
        :key="`pinned-${feed.id}`"
        :feed="feed"
        :pinned="true"
      />
    </keep-alive>
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
