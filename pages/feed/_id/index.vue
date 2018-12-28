<template>
  <div class="p-feed-detail">{{ feedId }}</div>
</template>

<script>
export default {
  name: 'FeedDetail',
  data: function () {
    return {
      feed: {},
    }
  },
  computed: {
    feedId () {
      return Number(this.$route.params.id)
    },
  },
  async asyncData ({ $axios, params }) {
    const feed = $axios.$get(`/feeds/${params.id}`)
    return { feed }
  },
}
</script>
