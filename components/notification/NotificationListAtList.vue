<template>
  <Loadmore
    ref="loader"
    class="c-notification-list-item at"
    @refresh="onRefresh"
    @loadmore="onLoadmore"
  >
    <ul class="list">
      <li v-for="like in likes" :key="like.id">
        <Avatar :user="like.data.sender" />
        <div class="info">
          <p>{{ like.data.sender.name }}</p>
          <time>{{ like.created_at | fromNow }}</time>
          <p class="content">{{ like.body }}</p>

          <Reference :type="like.data.resource.type" :source="{id: like.data.resource.id}" />
        </div>
      </li>
    </ul>
  </Loadmore>
</template>

<script>
import Reference from '@/components/common/Reference.vue'

export default {
  name: 'NotificationListAtList',
  components: {
    Reference,
  },
  data () {
    return {
      likes: [],

      nextApi: null,
    }
  },
  mounted () {
    this.$store.dispatch('notification/clearUnreadNotification', 'at')
  },
  methods: {
    async onRefresh () {
      const params = { type: 'at' }
      const { data, links } = await this.$axios.$get('/user/notifications', { params })
      this.nextApi = links.next
      this.likes = data
      this.loader.afterRefresh(this.nextApi)
    },
    async onLoadmore () {
      const { data, links } = await this.$axios.$get(this.nextApi)
      this.nextApi = links.next
      this.likes.push(...data)
      this.loader.afterLoadmore(this.nextApi)
    },
  },
}
</script>
