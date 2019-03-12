<template>
  <section class="c-feed-list-item post">
    <div class="author-info">
      <div class="user-info">
        <Avatar :user="postUser" />
        <span class="username">{{ postUser.name }}</span>
      </div>
      <span v-if="pinned" class="pinned">置顶</span>
      <span v-if="feed.excellent_at" class="excellent">精华</span>
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
      @more="viewDetail"
    />

    <footer class="feed-meta">
      <div class="meta-wrap">
        <div class="left">
          <span
            class="meta"
            :class="{ liked }"
            @click="onLike"
          >
            <svg class="icon lg">
              <use :xlink:href="liked ? '#icon-likered' : '#icon-like'" />
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

            <template v-slot:content>
              <ul class="options" @click="showMore = false">
                <li @click="onRepost"><svg class="icon"><use xlink:href="#icon-share" /></svg> 转发</li>
                <li :class="{active: collected}" @click="onCollect"><svg class="icon"><use xlink:href="#icon-collect" /></svg> {{ collected ? '已收藏' : '收藏' }}</li>
                <template v-if="isMine">
                  <li @click="onPinned"><svg class="icon"><use xlink:href="#icon-pinned2" /></svg> 申请置顶</li>
                  <li @click="onDelete"><svg class="icon"><use xlink:href="#icon-delete" /></svg> 删除</li>
                </template>
                <template v-else>
                  <li @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
                </template>
              </ul>
            </template>
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
    liked () {
      return this.feed.has_like
    },
  },
  methods: {
    viewDetail () {
      this.$router.push(`/group/${this.feed.group_id}/post/${this.feed.id}`)
    },
    onReport () {
      this.$root.$emit('report', {
        type: 'post',
        id: this.feed.id,
      })
    },
    onRepost () {
      this.$root.$emit('repost', {
        type: 'group-posts',
        source: this.feed,
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

<style lang="less" scoped>
.c-feed-list-item.post {
  .excellent {
    margin-right: 1em;
    padding: 0px 3px;
    border-radius: 2px;
    background-color: @error-color;
    color: #fff;
    font-size: @font-size-small;
    font-weight: bold;
  }
}
</style>
