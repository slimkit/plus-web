<template>
  <Loadmore
    ref="loader"
    class="c-notification-list-item comment"
    @refresh="onRefresh"
    @loadmore="onLoadmore"
  >
    <ul class="list">
      <li v-for="comment in comments" :key="comment.id">
        <Avatar :user="comment.user" />
        <div class="info">
          <p>{{ comment.user.name }}评论了你的{{ typeMap[comment.commentable_type] }}</p>
          <time>{{ comment.created_at | fromNow }}</time>
          <p class="content">{{ comment.body }}</p>

          <Reference :type="comment.commentable_type" :source="comment.commentable" />
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
  name: 'NotificationListCommentList',
  components: {
    Reference,
  },
  data () {
    return {
      typeMap,
      comments: [],
    }
  },
  methods: {
    async onRefresh () {
      const params = { limit }
      this.comments = await this.$axios.$get('/user/comments', { params })
      this.loader.afterRefresh(this.comments.length < limit)
    },
    async onLoadmore () {
      const params = { limit, after: getLastField(this.comments) }
      const comments = await this.$axios.$get('/user/comments', { params })
      this.comments.push(...comments)
      this.loader.afterLoadmore(comments.length < limit)
    },
  },
}
</script>
