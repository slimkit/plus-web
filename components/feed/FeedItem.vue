<template>
  <section class="c-feed-item">
    <div class="author-info">
      <div class="user-info">
        <Avatar :user="feed.user" />
        <span class="username">{{ feed.user.name }}</span>
      </div>
      <div
        class="post-info"
        @mouseenter="hoverTime = true"
        @mouseleave="hoverTime = false"
      >
        {{ hoverTime ? '查看详情' : feed.created_at | fromNow }}
      </div>
    </div>
    <div class="feed-content">
      {{ feed.feed_content }}
    </div>
    <footer class="feed-meta">
      <div class="left">
        <span class="meta">
          <svg class="icon lg">
            <use xlink:href="#icon-like" />
          </svg>
          <span>{{ feed.like_count }}</span>
        </span>
        <span class="meta">
          <svg class="icon lg">
            <use xlink:href="#icon-comment" />
          </svg>
          <span>{{ feed.feed_comment_count }}</span>
        </span>
        <span class="meta">
          <svg class="icon lg">
            <use xlink:href="#icon-chakan" />
          </svg>
          <span>{{ feed.feed_view_count }}</span>
        </span>
      </div>
      <div class="right">
        <svg class="icon lg more"><use xlink:href="#icon-more" /></svg>
      </div>
    </footer>
  </section>
</template>

<script>
export default {
  name: 'FeedItem',
  props: {
    feed: { type: Object, required: true },
  },
}
</script>

<style lang="less" scoped>
.c-feed-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  border-bottom: 6px solid @background-color-base;

  &:last-child {
    border-bottom: none;
  }

  .author-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;

    .user-info {
      display: flex;
      align-items: center;

      .username {
        margin-left: 1em;
      }
    }

    .post-info {
      color: @text-info-color;
      font-size: @font-size-small;
      font-weight: bold;
    }
  }

  .feed-content {
    margin: 16px 0;
  }

  .feed-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;

    .meta {
      display: inline-flex;
      align-items: center;
      margin-right: 2em;
      font-size: @font-size-small;
      color: @text-info-color;

      > span {
        margin-left: 0.3em;
        font-size: 120%;
      }
    }

    .more {
      color: @disabled-color;
    }
  }
}
</style>
