<template>
  <aside class="c-notification-bar">
    <ul class="list">
      <NotificationBarItem :badge="at.badge">
        <Tooltip
          placement="left"
          theme="light"
          :content="previewAt"
        >
          <svg class="icon lg" @click="showNotificationModal('at')"><use xlink:href="#icon-side-mention" /></svg>
        </Tooltip>
      </NotificationBarItem>
      <NotificationBarItem :badge="comment.badge">
        <Tooltip
          placement="left"
          theme="light"
          :content="previewComment"
        >
          <svg class="icon lg" @click="showNotificationModal('comment')"><use xlink:href="#icon-side-msg" /></svg>
        </Tooltip>
      </NotificationBarItem>
      <NotificationBarItem :badge="like.badge">
        <Tooltip
          placement="left"
          theme="light"
          :content="previewLike"
        >
          <svg class="icon lg" @click="showNotificationModal('like')"><use xlink:href="#icon-side-like" /></svg>
        </Tooltip>
      </NotificationBarItem>
      <NotificationBarItem :badge="system.badge">
        <Tooltip
          placement="left"
          theme="light"
          :content="previewSystem"
        >
          <svg class="icon lg" @click="showNotificationModal('system')"><use xlink:href="#icon-side-notice" /></svg>
        </Tooltip>
      </NotificationBarItem>
      <NotificationBarItem :badge="unreadAudits">
        <Tooltip
          placement="left"
          theme="light"
          :content="previewAudit"
        >
          <svg class="icon lg" @click="showNotificationModal('audit')"><use xlink:href="#icon-side-auth" /></svg>
        </Tooltip>
      </NotificationBarItem>
    </ul>

    <ModalNotification />
  </aside>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import NotificationBarItem from './NotificationBarItem.vue'
import ModalNotification from './ModalNotification.vue'

export default {
  name: 'NotificationBar',
  components: {
    NotificationBarItem,
    ModalNotification,
  },
  computed: {
    ...mapState('notification', ['comment', 'like', 'system', 'at']),
    ...mapGetters('notification', [
      'unreadAudits',
      'previewComment',
      'previewAt',
      'previewLike',
      'previewSystem',
      'previewAudit',
    ]),
  },
  mounted () {
    this.getNotifications()
  },
  methods: {
    ...mapActions('notification', {
      getNotifications: 'getNotificationStatistics',
    }),
    showNotificationModal (type) {
      this.$root.$emit('notification', { type })
    },
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
