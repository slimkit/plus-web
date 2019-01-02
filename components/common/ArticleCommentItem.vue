<template>
  <li class="c-article-comment-item">
    <Avatar class="avatar" :user="comment.user" />
    <div class="detail">
      <h6 class="username" @click="$router.push(`/user/${comment.user.id}`)">{{ comment.user.name }}</h6>
      <p class="time">{{ comment.created_at | fromNow }}</p>
      <p class="content">{{ comment.body }}</p>
    </div>
    <svg class="icon lg more"><use xlink:href="#icon-more" /></svg>
  </li>
</template>

<script>
export default {
  name: 'ArticleCommentItem',
  props: {
    comment: { type: Object, default: () => {} },
    pinned: { type: Boolean, default: false },
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
      margin-bottom: 8px;
      cursor: pointer;
    }

    .time {
      margin-bottom: 8px;
      color: @text-info-color;
      font-weight: bold;
    }
  }

  .more {
    flex: none;
    margin-top: 8px;
    cursor: pointer;
  }
}
</style>
