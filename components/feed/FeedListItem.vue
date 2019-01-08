<template>
  <section class="c-feed-list-item">
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
      <template v-for="(image, index) in images">
        <AsyncFile
          v-if="!index"
          :key="image.file"
          type="image"
          :file="image"
        />
      </template>
    </div>
    <div
      v-else
      class="feed-content"
      @click="viewDetail"
    >
      {{ feed.feed_content }}
    </div>
    <footer class="feed-meta">
      <div class="meta-wrap">
        <div class="left">
          <span
            class="meta"
            :class="{liked: feed.has_like}"
            @click="onLike"
          >
            <svg class="icon lg">
              <use :xlink:href="feed.has_like ? '#icon-likered' : '#icon-like'" />
            </svg>
            <span>{{ feed.like_count }}</span>
          </span>
          <span class="meta" @click="showComments = !showComments">
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
          <IPoptip
            v-model="showMore"
            class="more"
            placement="bottom"
          >
            <svg class="icon lg"><use xlink:href="#icon-more" /></svg>

            <ul
              slot="content"
              class="options"
              @click="showMore = false"
            >
              <li v-if="isMine" @click="onPinned"><svg class="icon"><use xlink:href="#icon-pinned2" /></svg> 申请置顶</li>
              <li v-if="!isMine" @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
            </ul>
          </IPoptip>
        </div>
      </div>
      <Collapse>
        <FeedListItemCommentList
          v-if="showComments"
          :feed-id="feed.id"
          :count.sync="feed.feed_comment_count"
          :comments.sync="feed.comments"
          :is-owner="isMine"
        />
      </Collapse>
    </footer>
  </section>
</template>

<script>
import FeedListItemCommentList from './FeedListItemCommentList.vue'

export default {
  name: 'FeedListItem',
  components: {
    FeedListItemCommentList,
  },
  props: {
    feed: { type: Object, required: true },
  },
  data () {
    return {
      hoverTime: false,
      showMore: false,
      showComments: false,
    }
  },
  computed: {
    isMine () {
      return this.logged && this.feed.user.id === this.logged.id
    },
    images () {
      return this.feed.images || []
    },
  },
  methods: {
    viewDetail () {
      this.$router.push(`/feed/${this.feed.id}`)
    },
    async onLike () {
      if (!this.feed.has_like) {
        await this.$axios.$post(`/feeds/${this.feed.id}/like`)
        this.feed.has_like = true
        this.feed.like_count += 1
        this.$Message.success('点赞成功')
      } else {
        await this.$axios.$delete(`/feeds/${this.feed.id}/unlike`)
        this.feed.has_like = false
        this.feed.like_count -= 1
      }
    },
    onReport () {
      this.$root.$emit('report', {
        type: 'feed',
        id: this.feed.id,
      })
    },
    onPinned () {
      this.$root.$emit('pinned', {
        type: 'feed',
        params: { feedId: this.feed.id },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.c-feed-list-item {
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
    .meta-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 48px;

      .meta {
        display: inline-flex;
        align-items: center;
        margin-right: 2em;
        font-size: @font-size-small;
        color: @text-info-color;
        cursor: pointer;

        > span {
          margin-left: 0.3em;
          font-size: 120%;
        }

        &.liked {
          color: @error-color;
        }
      }

      .more {
        color: @disabled-color;
        cursor: pointer;
      }
    }
  }
}
</style>
