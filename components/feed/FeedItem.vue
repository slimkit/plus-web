<template>
  <section class="c-feed-item">
    <div class="author-info">
      <div class="user-info">
        <Avatar :user="feed.user" />
        <span class="username">{{ feed.user.name }}</span>
      </div>
      <div
        class="post-info"
        @click="viewDetail"
        @mouseenter="hoverTime = true"
        @mouseleave="hoverTime = false"
      >
        {{ hoverTime ? '查看详情' : feed.created_at | fromNow }}
      </div>
    </div>
    <div v-if="images.length" class="feed-content image-wrap">
      <AsyncFile
        v-for="(image, index) in images"
        v-if="!index"
        :key="image.file"
        type="image"
        :file="image"
      />
    </div>
    <div
      v-else
      class="feed-content"
      @click="viewDetail"
    >
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
        <span class="meta view" @click="viewDetail">
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
  data () {
    return {
      hoverTime: false,
    }
  },
  computed: {
    images () {
      return this.feed.images || []
    },
  },
  methods: {
    viewDetail () {
      this.$router.push(`/feed/${this.feed.id}`)
    },
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
      cursor: pointer;
    }
  }

  .feed-content {
    margin: 16px 0;
    cursor: pointer;

    .image {
      width: 100%;
    }
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

      &.view {
        cursor: pointer;
      }

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
