<template>
  <div class="c-topic-participants">
    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <ul class="user-list">
        <li v-for="user in users" :key="user.id">
          <nuxt-link :to="`/user/${user.id}`" class="user">
            <Avatar :user="user" />
            <span class="username">{{ user.name }}</span>
          </nuxt-link>
        </li>
      </ul>
    </Loadmore>
  </div>
</template>

<script>
import { limit } from '@/utils'

export default {
  name: 'TopicParticipants',
  props: {
    topicId: { type: Number, required: true },
    initialParticipants: { type: Array, default: () => [] },
  },
  data () {
    return {
      users: this.initialParticipants,
    }
  },
  methods: {
    async onRefresh () {
      this.users = this.initialParticipants
      const params = { limit, offset: this.users.length }
      const participants = await this.$axios.$get(`/feed/topics/${this.topicId}/participants`, { params })
      if (participants.length) {
        this.users = await this.$axios.$get('/users', { params: { id: participants.join(',') } })
      }
      this.loader.afterRefresh(participants.length < limit)
    },
    async onLoadmore () {
      const params = { limit, offset: this.users.length }
      const participants = await this.$axios.$get(`/feed/topics/${this.topicId}/participants`, { params })
      if (participants.length) {
        const users = await this.$axios.$get('/users', { params: { id: participants.join(',') } })
        this.users.push(...users)
      }
      this.loader.afterLoadmore(participants.length < limit)
    },
  },
}
</script>

<style lang="less" scoped>
.c-topic-participants {
  .user-list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 16px;

    .user {
      display: flex;
      align-items: center;

      .username {
        margin-left: 8px;
      }
    }
  }
}
</style>
