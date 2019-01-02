<template>
  <section class="c-article-comment">
    <h3 class="total"><span>{{ count }}</span> 人评论</h3>
    <PostText />
    <div v-if="!count" v-empty:content />
    <ul class="comments">
      <ArticleCommentItem
        v-for="comment in pinnedComments"
        :key="`comment-pinned-${comment.id}`"
        :comment="comment"
        :pinned="true"
      />
      <ArticleCommentItem
        v-for="comment in comments"
        :key="`comment-${comment.id}`"
        :comment="comment"
      />
    </ul>
  </section>
</template>

<script>
import PostText from '@/components/common/PostText.vue'
import ArticleCommentItem from './ArticleCommentItem.vue'

export default {
  name: 'ArticleComment',
  components: {
    PostText,
    ArticleCommentItem,
  },
  props: {
    count: { type: Number, default: 0 },
    comments: { type: Array, default: () => [] },
    pinnedComments: { type: Array, default: () => [] },
  },
  computed: {
  },
}
</script>

<style lang="less" scoped>
.c-article-comment {
  .total {
    margin-bottom: 16px;
    font-weight: normal;

    > span {
      color: @primary-color;
      font-size: 160%;
    }
  }

  .comments {
    margin-top: 40px;
  }
}
</style>
