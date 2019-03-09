<template>
  <li class="c-feed-list-item-comment-list-item">
    {{ user.name }}:
    <span v-if="comment.reply">回复<nuxt-link :to="`/user/${comment.reply.id}`">{{ comment.reply.name }}</nuxt-link>: </span>
    {{ comment.body }}
    <span v-if="pinned" class="pinned">置顶</span>
    <div class="options">
      <span v-if="isOwner" @click="onTop">置顶</span>
      <template v-if="isMine">
        <span v-if="!isOwner" @click="onApplyTop">申请置顶</span>
        <span @click="onDelete">删除</span>
      </template>
      <template v-else>
        <span @click="onReply">回复</span>
        <span @click="onReport">举报</span>
      </template>
    </div>
  </li>
</template>

<script>
export default {
  name: 'ArticleListCommentListItem',
  props: {
    type: { type: String, required: true },
    comment: { type: Object, required: true },
    isOwner: { type: Boolean, default: false }, // 是否属于自己的动态
  },
  computed: {
    user () {
      return this.comment.user || this.logged || {}
    },
    isMine () {
      return this.logged && this.user.id === this.logged.id
    },
    pinned () {
      return this.comment.pinned
    },
  },
  methods: {
    onApplyTop () {},
    onTop () {},
    onReply () {
      this.$emit('reply', this.comment.user)
    },
    onReport () {
      this.$root.$emit('report', {
        type: 'comment',
        id: this.comment.id,
      })
    },
    onDelete () {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除这条评论？',
        onOk: async () => {
          await this.$axios.$delete(`/feeds/${this.comment.commentable_id}/comments/${this.comment.id}`)
          this.$Message.success('删除成功')
          this.$emit('delete', this.comment.id)
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.c-feed-list-item-comment-list-item {
  padding: 8px 0;
  color: @disabled-color;
  font-size: @font-size-small;

  a {
    color: @primary-color;
  }

  .pinned {
    color: @success-color;
  }

  .options {
    display: inline-block;

    > span {
      position: relative;
      left: 8px;
      color: @primary-color;
      cursor: pointer;
      opacity: 0;
      transition: opacity .2s, left .1s;
    }
  }

  &:hover {
    .options > span {
      left: 0;
      opacity: 1;
    }
  }
}
</style>
