<template>
  <li class="c-article-comment-item">
    <Avatar class="avatar" :user="user" />
    <div class="detail">
      <nuxt-link :to="`/user/${user.id}`">
        <h6 class="username">{{ user.name }}</h6>
      </nuxt-link>
      <p class="time">{{ comment.created_at | fromNow }}</p>
      <p class="content">
        <template v-if="comment.reply_user">
          回复 <nuxt-link class="reply" :to="`/user/${comment.reply.id}`">{{ comment.reply.name }}</nuxt-link>:&nbsp;
        </template>
        <span v-html="convertAtHTML(comment.body)" />
      </p>
      <div class="options">
        <a v-if="!isMine" @click="onReply(user)">回复</a>
      </div>
    </div>
    <div class="right">
      <span v-if="pinned" class="pinned">置顶</span>
      <IPoptip v-model="showMore" placement="bottom">
        <svg class="icon lg more"><use xlink:href="#icon-more" /></svg>

        <template v-slot:content>
          <ul class="options" @click="showMore = false">
            <template v-if="isOwner || isMine">
              <li v-if="showPinned && !pinned" @click="onPinned"><svg class="icon"><use xlink:href="#icon-pinned2" /></svg> {{ isOwner ? '评论置顶' : '申请置顶' }}</li>
              <li @click="onDelete"><svg class="icon"><use xlink:href="#icon-delete" /></svg> 删除评论</li>
            </template>
            <li v-if="!isMine" @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
          </ul>
        </template>
      </IPoptip>
    </div>
  </li>
</template>

<script>
import { convertAtHTML } from '@/utils/text'

export default {
  name: 'ArticleCommentItem',
  props: {
    type: { type: String, required: true },
    comment: { type: Object, default: () => {} },
  },
  data () {
    return {
      showMore: false,
    }
  },
  computed: {
    isOwner () {
      return this.logged && this.comment.target_user === this.logged.id
    },
    user () {
      return this.comment.user || {}
    },
    isMine () {
      return this.logged && this.user.id === this.logged.id
    },
    showPinned () {
      return !['answer', 'question'].includes(this.type)
    },
    pinned () {
      return this.comment.pinned
    },
  },
  methods: {
    convertAtHTML,
    onReply (user) {
      this.$emit('reply', user)
    },
    onPinned () {
      const commentId = this.comment.id
      this.$root.$emit('pinned', {
        type: `${this.type}Comment`,
        params: { feedId: this.comment.commentable_id, commentId },
        isOwner: this.isOwner,
        callback: () => {
          this.$emit('pinned', commentId)
        },
      })
    },
    onDelete () {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除这条评论？',
        loading: true,
        onOk: () => {
          this.$emit('delete', this.comment, () => {
            this.$Modal.remove()
          })
        },
      })
    },
    onReport () {
      this.$root.$emit('report', {
        type: 'comment',
        id: this.comment.id,
      })
    },
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
      cursor: pointer;
    }

    .content {
      .reply {
        color: @primary-color;
      }
    }

    .time {
      margin-bottom: 8px;
      color: @text-info-color;
    }

    .options {
      margin-top: 8px;
      visibility: hidden;

      > a {
        color: @primary-color;
      }
    }
  }

  .right {
    flex: none;
    display: flex;
    align-items: center;
    margin-top: 8px;

    .more {
      cursor: pointer;
    }

    .pinned {
      color: @success-color;
      margin-right: 1em;
    }
  }

  &:hover {
    .options {
      visibility: visible;
    }
  }
}
</style>
