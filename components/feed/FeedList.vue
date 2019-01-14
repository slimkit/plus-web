<template>
  <div class="c-feed-list">
    <FeedListItem
      v-for="feed in feeds"
      :key="`${feed.pinned ? 'pinned' : 'feed'}-${feed.id}`"
      :feed="feed"
      @delete="onDelete"
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
    feeds: { type: Array, default: () => [] },
  },
  methods: {
    onDelete (feedId) {
      this.$emit('delete', feedId)
    },
  },
}
</script>
