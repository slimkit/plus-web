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
        <p>{{ index }}{{ data | getNotificationDisplay }}</p>
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
  mounted () {
    this.$store.dispatch('notification/clearUnreadNotification', 'system')
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
        case 'user-certification':
          url = '/setting/certificate'; break
        case 'user-cash':
          url = '/setting/wallet/detail'; break
        case 'user-currency:cash':
          url = '/setting/currency/detail'; break

        case 'reward:feeds':
        case 'pinned:feeds':
          url = `/feed/${data.feed_id}`; break

        case 'pinned:feed/comment':
          url = `/feed/${data.feed.id}`; break

        case 'reward:news':
        case 'pinned:news/comment':
          url = `/news/${data.news.id}`; break

        case 'qa:answer-adoption':
        case 'question:answer':
          url = `/question/${data.question.id}/answer/${data.answer.id}`; break
        case 'qa:reward':
          url = `/question/${data.answer.question_id}/answer/${data.answer.id}`; break
        case 'qa:invitation':
          url = `/question/${data.question.id}`; break
        case 'qa:question-topic:accept':
          url = `/question/topic/${data.topic.id}`; break
        case 'qa:question-topic:reject':
          return

        case 'qa:question-excellent:accept':
          url = `/question/${data.application.question_id}`; break

        case 'group:join':
          if (data.state) url = `/group/${data.group.id}`
          else url = `/group/${data.group.id}/manage/members?type=audit`
          break
        case 'group:post-reward':
        case 'group:pinned-admin':
        case 'group:comment-pinned':
        case 'group:send-comment-pinned':
        case 'group:post-pinned':
          url = `/group/${data.group_id}/post/${data.post.id}`; break
      }
      if (url) {
        this.$router.push(url)
        this.$root.$emit('notification:close')
      }
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
