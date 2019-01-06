<template>
  <li class="c-article-comment-item">
    <Avatar class="avatar" :user="comment.user" />
    <div class="detail">
      <h6 class="username" @click="$router.push(`/user/${comment.user.id}`)">{{ comment.user.name }}</h6>
      <p class="time">{{ comment.created_at | fromNow }}</p>
      <p class="content">
        <template v-if="comment.reply_user">
          回复 <nuxt-link class="reply" :to="`/user/${comment.reply.id}`">{{ comment.reply.name }}</nuxt-link>:&nbsp;
        </template>
        {{ comment.body }}
      </p>
      <div class="options">
        <a v-if="!isMine" @click="onReply(comment.user)">回复</a>
      </div>
    </div>
    <IPoptip v-model="more" placement="bottom">
      <svg class="icon lg more" @click="onMore"><use xlink:href="#icon-more" /></svg>

      <ul slot="content" class="options">
        <li @click="onPinned"><svg class="icon"><use xlink:href="#icon-pinned2" /></svg> 申请置顶</li>
        <li @click="onDelete"><svg class="icon"><use xlink:href="#icon-delete" /></svg> 删除评论</li>
      </ul>
    </IPoptip>
  </li>
</template>

<script>
export default {
  name: 'ArticleCommentItem',
  props: {
    comment: { type: Object, default: () => {} },
    pinned: { type: Boolean, default: false },
  },
  data () {
    return {
      more: false,
    }
  },
  computed: {
    isMine () {
      return this.comment.user.id === this.logged.id
    },
  },
  methods: {
    onReply (user) {
      this.$emit('reply', user)
    },
    onMore () {

    },
    onPinned () {},
    onDelete () {
      this.more = false
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除这条评论？',
        loading: true,
        onOk: () => {
          this.$emit('delete', this.comment, () => {
            this.$Modal.remove()
          })
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.c-article-comment-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 0;
  .border(bottom);

  &:last-child {
    border: none;
  }

  .avatar {
    flex: none;
    margin-right: 16px;
  }

  .detail {
    flex: auto;
    min-width: 0;

    .username {
      display: inline-block;
      font-size: @font-size-large;
      font-weight: normal;
      cursor: pointer;
    }

    .content {
      .reply {
        color: @primary-color;
      }
    }

    .time {
      margin-bottom: 8px;
      color: @text-info-color;
    }

    .options {
      margin-top: 8px;
      visibility: hidden;

      > a {
        color: @primary-color;
      }
    }
  }

  .more {
    flex: none;
    margin-top: 8px;
    cursor: pointer;
  }

  &:hover {
    .options {
      visibility: visible;
    }
  }
}
</style>
