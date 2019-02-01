<template>
  <section class="c-feed-list-item">
    <div class="author-info">
      <div class="user-info">
        <Avatar :user="postUser" />
        <span class="username">{{ postUser.name }}</span>
      </div>
      <span v-if="pinned" class="pinned">置顶</span>
      <div
        class="post-info"
        @click="viewDetail"
        @mouseenter="hoverTime = true"
        @mouseleave="hoverTime = false"
      >
        {{ hoverTime ? '查看详情' : feed.created_at | fromNow }}
      </div>
    </div>

    <FeedListItemImageLayout
      v-if="images.length"
      class="feed-content"
      :images="images"
      @click="onImageView"
      @more="viewDetail"
    />
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
              <li :class="{active: collected}" @click="onCollect"><svg class="icon"><use xlink:href="#icon-collect" /></svg> {{ collected ? '已收藏' : '收藏' }}</li>
              <template v-if="isMine">
                <li @click="onPinned"><svg class="icon"><use xlink:href="#icon-pinned2" /></svg> 申请置顶</li>
                <li @click="onDelete"><svg class="icon"><use xlink:href="#icon-delete" /></svg> 删除</li>
              </template>
              <template v-else>
                <li @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
              </template>
            </ul>
          </IPoptip>
        </div>
      </div>
      <Collapse>
        <ArticleListCommentList
          v-if="showComments"
          :type="type"
          :article="articleId"
          :count.sync="commentCount"
          :comments.sync="comments"
          :is-owner="isMine"
        />
      </Collapse>
    </footer>
  </section>
</template>

<script>
import { getFileUrl } from '@/utils/file'
import FeedListItemImageLayout from './FeedListItemImageLayout.vue'
import ArticleListCommentList from '@/components/common/ArticleListCommentList.vue'

export default {
  name: 'FeedListItem',
  components: {
    FeedListItemImageLayout,
    ArticleListCommentList,
  },
  props: {
    feed: { type: Object, required: true },
  },
  data () {
    return {
      type: 'feed',
      hoverTime: false,
      showMore: false,
      showComments: false,
    }
  },
  computed: {
    articleId () {
      return this.feed.id
    },
    postUser () {
      return this.feed.user || {}
    },
    isMine () {
      return this.logged && this.postUser.id === this.logged.id
    },
    images () {
      return this.feed.images || []
    },
    pinned () {
      return this.feed.pinned || false
    },
    collected () {
      return this.feed.has_collect || false
    },
    comments: {
      get () {
        return this.feed.comments || []
      },
      set (val) {
        this.feed.comments = val
      },
    },
    commentCount: {
      get () {
        return this.feed.feed_comment_count || 0
      },
      set (val) {
        this.feed.feed_comment_count = val
      },
    },
  },
  methods: {
    viewDetail () {
      this.$router.push(`/feed/${this.feed.id}`)
    },
    onImageView (image, index) {
      // TODO: 点击展开幻灯片预览
      const originalUrl = getFileUrl(image.file)
      window.open(originalUrl)
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
    async onCollect () {
      if (!this.collected) {
        await this.$axios.$post(`/feeds/${this.feed.id}/collections`)
        this.$Message.success('收藏成功')
      } else {
        await this.$axios.$delete(`/feeds/${this.feed.id}/uncollect`)
        this.$Message.success('取消收藏')
      }
      this.feed.has_collect = !this.feed.has_collect
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
    onDelete () {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除这条信息？',
        loading: true,
        onOk: async () => {
          await this.$axios.$delete(`/feeds/${this.feed.id}/currency`)
          this.$emit('delete', this.feed.id)
          this.$Message.success('删除成功')
          this.$Modal.remove()
        },
      })
    },
  },
}
</script>

<style lang="less">
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
    justify-content: flex-start;
    align-items: center;
    height: 80px;

    .user-info {
      display: flex;
      align-items: center;
      margin-right: auto;

      .username {
        margin-left: 1em;
      }
    }

    .pinned {
      margin-right: 1em;
      color: @success-color;
      font-size: @font-size-small;
    }

    .post-info {
      color: @text-info-color;
      font-size: @font-size-small;
      font-weight: bold;
      cursor: pointer;
    }
  }

  .feed-content {
    cursor: pointer;
    margin-bottom: 16px;

    /* for group post layout */
    .title {
      margin-bottom: 16px;
      color: @primary-color;
      font-size: @font-size-large;
    }

    .image {
      max-width: 100%;
      max-height: 400px;
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
