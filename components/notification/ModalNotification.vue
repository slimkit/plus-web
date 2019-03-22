<template>
  <IModal
    v-model="show"
    class="c-modal-notification"
    width="720"
    :footer-hide="true"
    :loading="loading"
    :transfer="false"
  >
    <div class="modal-container">
      <aside class="nav">
        <ul>
          <li :class="{active: type !== 'chat'}"><svg class="icon lg"><use xlink:href="#icon-liaotiantubiao_8" /></svg></li>
          <li :class="{active: type === 'chat'}"><svg class="icon lg"><use xlink:href="#icon-liaotiantubiao_1" /></svg></li>
        </ul>
      </aside>

      <main>
        <!-- 通知列表 -->
        <NotificationList
          v-if="show"
          :type.sync="type"
          :audit-type.sync="auditType"
        />

        <!-- 聊天列表 -->
        <!-- <ChatList v-else /> -->
      </main>
    </div>
  </IModal>
</template>

<script>
import NotificationList from './NotificationList.vue'

export default {
  name: 'ModalNotification',
  components: {
    NotificationList,
  },
  data () {
    return {
      type: 'comment',
      auditType: 'feedCommentPinned',

      show: false,
      loading: true,
    }
  },
  computed: {
    title () {
      return '系统消息'
    },
  },
  created () {
    this.$root.$on('notification', options => {
      if (options.type) this.type = options.type
      if (options.auditType) this.auditType = options.auditType
      this.open()
    })
    this.$root.$on('notification:close', () => {
      this.close()
    })
  },
  destoryed () {
    this.$root.$off('notification')
  },
  methods: {
    open () {
      this.show = true
    },
    close () {
      this.show = false
    },
  },
}
</script>

<style lang="less" scoped>
.c-modal-notification {

  .modal-container {
    display: flex;
    font-size: @font-size-base;
  }

  /deep/ .ivu-modal-body {
    padding: 0;
  }

  .nav {
    flex: none;
    width: 48px;
    background-color: #363844;
    border-radius: 6px 0 0 6px;
    overflow: hidden;

    li {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      cursor: pointer;

      &.active {
        background-color: #2b2d38;
        color: @primary-color;
      }
    }
  }

  main {
    flex: auto;
  }
}
</style>
