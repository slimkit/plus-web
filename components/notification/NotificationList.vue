<template>
  <div class="c-notification-list">
    <aside>
      <ul class="nav">
        <li :class="{active: type === 'at'}" @click="$emit('update:type', 'at')"><svg class="icon lg"><use xlink:href="#icon-side-mention" /></svg> @我的</li>
        <li :class="{active: type === 'comment'}" @click="$emit('update:type', 'comment')"><svg class="icon lg"><use xlink:href="#icon-side-msg" /></svg> 评论我的</li>
        <li :class="{active: type === 'like'}" @click="$emit('update:type', 'like')"><svg class="icon lg"><use xlink:href="#icon-side-like" /></svg> 赞了我的</li>
        <li :class="{active: type === 'system'}" @click="$emit('update:type', 'system')"><svg class="icon lg"><use xlink:href="#icon-side-notice" /></svg> 系统通知</li>
        <li :class="{active: type === 'audit'}" @click="$emit('update:type', 'audit')"><svg class="icon lg"><use xlink:href="#icon-side-auth" /></svg> 审核通知</li>
      </ul>
    </aside>

    <main>
      <h3 class="title">{{ computedType.title }}</h3>

      <div class="list-container">
        <Component :is="computedType.component" />
      </div>
    </main>
  </div>
</template>

<script>
import NotificationListAtItem from './NotificationListAtItem.vue'
import NotificationListLikeItem from './NotificationListLikeItem.vue'
import NotificationListCommentItem from './NotificationListCommentItem.vue'
import NotificationListSystemItem from './NotificationListSystemItem.vue'

const typeMap = {
  at: { title: 'at我的', component: NotificationListAtItem },
  like: { title: '赞我的', component: NotificationListLikeItem },
  comment: { title: '评论我的', component: NotificationListCommentItem },
  system: { title: '系统消息', component: NotificationListSystemItem },
}

export default {
  name: 'NotificationList',
  props: {
    type: { type: String, default: 'comment' },
  },
  data () {
    return {
    }
  },
  computed: {
    computedType () {
      return typeMap[this.type]
    },
  },
}
</script>

<style lang="less" scoped>
.c-notification-list {
  display: flex;
  max-height: 90vh;

  aside {
    flex: none;
    width: 160px;
    background-color: @background-color-base;
  }

  .nav {
    > li {
      display: flex;
      align-items: center;
      padding: 0 1em;
      height: 48px;
      cursor: pointer;

      &:hover {
        background-color: @border-color-base;
      }

      &.active {
        background-color: @btn-disable-color;
      }

      .icon {
        margin-right: .5em;
      }
    }
  }

  main {
    display: flex;
    flex-direction: column;
    flex: auto;
    overflow: hidden;

    .title {
      flex: none;
      display: flex;
      align-items: center;
      height: 48px;
      padding: 0 1em;
      .border(bottom);
    }
  }

  .list-container {
    flex: auto;
    overflow: auto;
  }
}
</style>

<style lang="less">
.c-notification-list {
  .c-notification-list-item {
    .list {
      > li {
        display: flex;
        padding: 16px;
        .border(bottom);

        .c-avatar {
          flex: none;
          margin-right: 16px;
        }

        .info {
          flex: auto;

          > time {
            color: @disabled-color;
            font-size: @font-size-small;
          }

          .c-reference {
            margin-top: 8px;
            font-size: 80%;
          }
        }
      }
    }
  }
}
</style>
