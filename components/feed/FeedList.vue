<template>
  <div class="c-feed-list">
    <FeedListItem
      v-for="feed in feeds"
      :key="`${feed.pinned ? 'pinned' : 'feed'}-${feed.id}`"
      :feed="feed"
      @after-delete="afterDelete"
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
    afterDelete (feedId) {
      this.$emit('after-delete', feedId)
    },
  },
}
</script>
