<template>
  <section class="c-feed-list-item">
    <div class="author-info">
      <div class="user-info">
        <Avatar :user="feed.user" />
        <span class="username">{{ feed.user.name }}</span>
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

    <div class="feed-content" @click="viewDetail">
      <h2 v-if="feed.title" class="title">{{ feed.title }}</h2>
      <p>{{ feed.feed_content }}</p>
    </div>

    <FeedListItemImageLayout
      v-if="images.length"
      class="feed-content"
      :images="images"
      @click="onImageView"
    />

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
import FeedListItem from '@/components/feed/FeedListItem.vue'

export default {
  name: 'GrouppostListItem',
  extends: FeedListItem, // 继承动态列表卡片
  computed: {
    collected () {
      return this.feed.collected || false
    },
  },
  methods: {
    onReport () {
      this.$root.$emit('report', {
        type: 'post',
        id: this.feed.id,
      })
    },
    async onCollect () {
      if (!this.collected) {
        await this.$axios.$post(`/plus-group/group-posts/${this.feed.id}/collections`)
        this.$Message.success('收藏成功')
      } else {
        await this.$axios.$delete(`/plus-group/group-posts/${this.feed.id}/uncollect`)
        this.$Message.success('取消收藏')
      }
      this.feed.collected = !this.feed.collected
    },
  },
}
</script>
