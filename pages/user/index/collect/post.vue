<template>
  <Loadmore
    ref="loader"
    class="p-user-collect-post"
    @refresh="onRefresh"
    @loadmore="onLoadmore"
  >
    <GrouppostList :posts="posts" />
  </Loadmore>
</template>

<script>
import { limit } from '@/utils'
import GrouppostList from '@/components/group/GrouppostList.vue'

export default {
  name: 'UserCollectPost',
  components: {
    GrouppostList,
  },
  data () {
    return {
      posts: [],
    }
  },
  methods: {
    async onRefresh () {
      const posts = await this.fetchPosts()
      this.posts = posts
      this.loader.afterRefresh(posts.length < limit)
    },
    async onLoadmore () {
      const offset = this.posts.length
      const posts = await this.fetchPosts(offset)
      this.posts.push(...posts)
      this.loader.afterLoadmore(posts.length < limit)
    },
    async fetchPosts (offset) {
      const params = { limit, offset }
      return this.$axios.$get('/plus-group/user-post-collections', { params })
    },
  },
}
</script>

<style lang="less" scoped>
.p-user-collect-post {

}
</style>
