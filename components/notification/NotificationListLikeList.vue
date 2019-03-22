<template>
  <Loadmore
    ref="loader"
    class="c-notification-list-item like"
    @refresh="onRefresh"
    @loadmore="onLoadmore"
  >
    <ul class="list">
      <li v-for="like in likes" :key="like.id">
        <Avatar :user="like.user" />
        <div class="info">
          <p>{{ like.user.name }}赞了你的{{ typeMap[like.likeable_type] }}</p>
          <time>{{ like.created_at | fromNow }}</time>
          <p class="content">{{ like.body }}</p>

          <Reference :type="like.likeable_type" :source="like.likeable" />
        </div>
      </li>
    </ul>
  </Loadmore>
</template>

<script>
import { limit, getLastField } from '@/utils'
import Reference from '@/components/common/Reference.vue'

const typeMap = {
  'feeds': '动态',
  'news': '资讯',
  'group-posts': '帖子',
  'questions': '问题',
  'question-answers': '答案',
}

export default {
  name: 'NotificationListLikeList',
  components: {
    Reference,
  },
  data () {
    return {
      typeMap,
      likes: [],
    }
  },
  mounted () {
    this.$store.dispatch('notification/clearUnreadNotification', 'like')
  },
  methods: {
    async onRefresh () {
      const params = { limit }
      this.likes = await this.$axios.$get('/user/likes', { params })
      this.loader.afterRefresh(this.likes.length < limit)
    },
    async onLoadmore () {
      const params = { limit, after: getLastField(this.likes) }
      const likes = await this.$axios.$get('/user/likes', { params })
      this.likes.push(...likes)
      this.loader.afterLoadmore(likes.length < limit)
    },
  },
}
</script>
