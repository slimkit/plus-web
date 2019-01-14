<script>
import { limit } from '@/utils'
import UserFeed from '../index/feed.vue'

export default {
  extends: UserFeed,
  computed: {
    userId () {
      return Number(this.$route.params.id)
    },
  },
  methods: {
    async fetchFeeds (after) {
      const params = {
        type: 'users',
        user: this.userId,
        limit,
        after,
      }
      return this.$axios.$get('/feeds', { params })
    },
  },
}
</script>
