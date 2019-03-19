<template>
  <Loadmore
    ref="loader"
    class="c-notification-list-item audit"
    @refresh="onRefresh"
    @loadmore="onLoadmore"
  >
    <div v-if="!list.length" v-empty:content />
    <ul v-else class="list">
      <li v-for="item in list" :key="item.id">
        <Avatar :user="item.user" />
        <div class="info">
          <p>{{ item.user.name }}</p>
          <time>{{ item.created_at | fromNow }}</time>
          <p class="content">{{ item | auditMessageFormat(auditType) }}</p>

          <template v-if="auditType === 'postPinned'">
            <p v-if="!item.post" class="deleted">该帖子已被删除</p>
            <p v-else-if="item.status === 1" class="already">同意置顶</p>
            <p v-else-if="item.status === 2" class="already">拒绝置顶</p>
          </template>
          <template v-else>
            <p v-if="!item.comment" class="deleted">该评论已被删除</p>
            <p v-else-if="item.expires_at" class="already">已处理</p>
          </template>
        </div>
      </li>
    </ul>
  </Loadmore>
</template>

<script>
import { limit, getLastField } from '@/utils'

const typeMap = {
  feedCommentPinned: { api: '/user/feed-comment-pinneds' },
  newsCommentPinned: { api: '/news/comments/pinneds' },
  postCommentPinned: { api: '/plus-group/pinned/comments' },
  postPinned: { api: '/plus-group/pinned/posts' },
  // groupJoin: { api: '/user/feed-comment-pinneds' },
}

export default {
  name: 'NotificationListAuditList',
  filters: {
    auditMessageFormat (item, auditType) {
      if (item.channel === 'post') {
        return `对帖子「${item.post.title}」申请置顶，请及时审核。`
      }
      switch (auditType) {
        case 'feedCommentPinned':
          return `对你的动态进行了“${(item.comment || {}).body || ''}”评论并申请置顶，请及时审核。`
        case 'newsCommentPinned':
          return `对你的资讯进行了“${(item.comment || {}).body || ''}”评论并申请置顶，请及时审核。`
        case 'postCommentPinned':
          return `对你的帖子进行了“${(item.comment || {}).body || ''}”评论并申请置顶，请及时审核。`
      }
      return ''
    },
  },
  props: {
    auditType: { type: String, required: true, validator: type => Object.keys(typeMap).includes(type) },
  },
  data () {
    return {
      list: [],
    }
  },
  watch: {
    auditType () {
      this.loader.beforeRefresh()
    },
  },
  methods: {
    async onRefresh () {
      const params = { limit }
      const list = await this.$axios.$get(typeMap[this.auditType].api, { params })
      this.list = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { limit, after: getLastField(this.list) }
      const list = await this.$axios.$get(typeMap[this.auditType].api, { params })
      this.list.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
  },
}
</script>

<style lang="less" scoped>
.c-notification-list-item.audit {
  .deleted {
    color: @error-color;
  }
  .already {
    color: @disabled-color;
  }
  .v-empty-content {
    height: 100%;
  }
}
</style>
