<template>
  <ul class="c-group-post-list">
    <GrouppostListItem
      v-for="post in convertedPosts"
      :key="post.id"
      :feed="post"
    />
  </ul>
</template>

<script>
import GrouppostListItem from './GrouppostListItem.vue'

/**
 * 因为帖子列表卡片继承了动态列表卡片，所以对字段做映射（与动态详情字段对应）
 */
const convertMap = {
  like_count: 'likes_count',
  feed_view_count: 'views_count',
  feed_comment_count: 'comments_count',
  feed_content: 'summary',
}

export default {
  name: 'GrouppostList',
  components: {
    GrouppostListItem,
  },
  props: {
    posts: { type: Array, default: () => [] },
  },
  computed: {
    convertedPosts () {
      this.posts.forEach(item => {
        for (const key in convertMap) {
          const value = convertMap[key]
          item[key] = item[value]
        }
      })
      return this.posts
    },
  },
}
</script>

<style lang="less" scoped>
.c-group-post-list {}
</style>
