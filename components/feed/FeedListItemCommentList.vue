<template>
  <div class="c-feed-list-item-comment-list">
    <PostText ref="editor" @submit="onComment" />
    <ul class="comments">
      <FeedListItemCommentListItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :is-owner="isOwner"
        @reply="onReply"
        @delete="onDelete"
      />
    </ul>
    <nuxt-link
      v-if="count >= 5"
      class="view-more"
      :to="`/feed/${feedId}`"
    >
      查看全部评论
    </nuxt-link>
  </div>
</template>

<script>
import PostText from '@/components/common/PostText.vue'
import FeedListItemCommentListItem from './FeedListItemCommentListItem.vue'

export default {
  name: 'FeedListItemCommentList',
  components: {
    PostText,
    FeedListItemCommentListItem,
  },
  props: {
    feedId: { type: Number, required: true },
    isOwner: { type: Boolean, default: false },
    count: { type: Number, default: 0 },
    comments: { type: Array, default: () => [] },
  },
  computed: {
    commentLimited () {
      return this.comments.slice(0, 5)
    },
  },
  methods: {
    async onComment (content, replyUser) {
      const { comment } = await this.$axios.$post(`/feeds/${this.feedId}/comments`, {
        body: content,
        reply_user: replyUser.id,
      })
      this.$Message.success('评论成功')

      // 更新评论列表
      if (replyUser.id) comment.reply = replyUser
      this.$emit('update:comments', [comment, ...this.comments])
      this.$emit('update:count', this.count + 1)

      // 清空评论框
      this.$refs.editor.clean()
    },
    onReply (replyUser) {
      this.$refs.editor.reply(replyUser)
    },
    onDelete (commentId) {
      this.$emit('update:comments', this.comments.filter(item => item.id !== commentId))
      this.$emit('update:count', this.count - 1)
    },
  },
}
</script>

<style lang="less" scoped>
.c-feed-list-item-comment-list {
  position: relative;
  padding: 16px 0;
  .border(top);

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -16px;
    left: 76px;
    display: block;
    width: 0px;
    height: 0px;
    border: 8px solid transparent;
    border-bottom-color: @border-color-base;
  }

  &::after {
    top: -15px;
    border-bottom-color: #fff;
  }

  .comments {
    padding: 8px 0 0;
  }

  .view-more {
    font-size: @font-size-small;
  }
}
</style>
