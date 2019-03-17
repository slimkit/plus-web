<template>
  <aside class="c-notification-bar">
    <ul class="list">
      <NotificationBarItem :badge="at.badge">
        <svg class="icon lg"><use xlink:href="#icon-side-mention" /></svg>
      </NotificationBarItem>
      <NotificationBarItem :badge="comment.badge">
        <svg class="icon lg"><use xlink:href="#icon-side-msg" /></svg>
      </NotificationBarItem>
      <NotificationBarItem :badge="like.badge">
        <svg class="icon lg"><use xlink:href="#icon-side-like" /></svg>
      </NotificationBarItem>
      <NotificationBarItem :badge="system.badge">
        <svg class="icon lg"><use xlink:href="#icon-side-notice" /></svg>
      </NotificationBarItem>
      <NotificationBarItem :badge="unreadAudits">
        <svg class="icon lg"><use xlink:href="#icon-side-auth" /></svg>
      </NotificationBarItem>
    </ul>
  </aside>
</template>

<script>
import NotificationBarItem from './NotificationBarItem.vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'NotificationBar',
  components: {
    NotificationBarItem,
  },
  computed: {
    ...mapState('notification', ['comment', 'like', 'system', 'at']),
    ...mapGetters('notification', ['unreadAudits']),
  },
  mounted () {
    this.getNotifications()
  },
  methods: {
    ...mapActions('notification', {
      getNotifications: 'getNotificationStatistics',
    }),
  },
}
</script>

<style lang="less" scoped>
.c-notification-bar {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 48px;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 10, .1);

  .list {
    > li {
      cursor: pointer;
    }
  }
}
</style>
