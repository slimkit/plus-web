<template>
  <Loadmore
    ref="loader"
    class="c-notification-list-item system"
    @refresh="onRefresh"
    @loadmore="onLoadmore"
  >
    <ul class="system-list">
      <li
        v-for="({data, created_at}, index) in messages"
        :key="index.id"
        @click="jumpTo(data)"
      >
        <p>{{ data | getNotificationDisplay }}</p>
        <time>{{ created_at | fromNow }}</time>
      </li>
    </ul>
  </Loadmore>
</template>

<script>
import { getNotificationDisplay } from './messageMap'

export default {
  name: 'NotificationListSystemList',
  filters: {
    getNotificationDisplay,
  },
  data () {
    return {
      messages: [],

      nextApi: null,
    }
  },
  methods: {
    async onRefresh () {
      const params = { type: 'system' }
      const { data, links } = await this.$axios.$get('/user/notifications', { params })
      this.nextApi = links.next
      this.messages = data
      this.loader.afterRefresh(this.nextApi)
    },
    async onLoadmore () {
      const { data, links } = await this.$axios.$get(this.nextApi)
      this.nextApi = links.next
      this.messages.push(...data)
      this.loader.afterLoadmore(this.nextApi)
    },
    jumpTo (data) {
      let url
      switch (data.type) {
        case 'reward':
          url = `/user/${data.sender.id}`; break
        case 'reward:feeds':
          url = `/feed/${data.feed_id}`; break
        case 'reward:news':
          url = `/news/${data.news.id}`; break
        case 'group:post-reward':
          url = `/group/${data.group_id}/post/${data.post.id}`; break
        case 'user-certification':
          url = '/setting/certificate'; break
        case 'qa:answer-adoption':
        case 'question:answer':
          url = `/question/${data.question.id}/answer/${data.answer.id}`; break
        case 'qa:reward':
          url = `/question/${data.answer.question_id}/answer/${data.answer.id}`; break
        case 'qa:invitation':
          url = `/question/${data.question.id}`; break
        // case 'group:join':
          // url = `/message/audits/groupjoins`; break
        // case 'pinned:feed/comment':
        //   url = `/message/audits/feedcomments`; break
        // case 'pinned:news/comment':
        //   url = `/message/audits/newscomments`; break
        // case 'group:comment-pinned':
        // case 'group:send-comment-pinned':
        //   url = `/message/audits/groupcomments`; break
        // case 'group:post-pinned':
        //   url = `/message/audits/groupposts`; break
      }
      if (url) this.$router.push(url)
    },
  },
}
</script>

<style lang="less" scoped>
.c-notification-list-item.system {
  .system-list {

    > li {
      padding: 8px;
      .border(bottom);
      cursor: pointer;

      time {
        color: @disabled-color;
      }
    }
  }
}
</style>
