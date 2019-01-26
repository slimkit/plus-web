<template>
  <article class="p-group-post-detail">
    <div class="article">
      <header class="article-header">
        <Avatar :user="user" />
        <div class="author-info">
          <h3>{{ user.name }}</h3>
          <p class="time">
            发布时间 {{ post.created_at | fromNow }}
            浏览量 {{ post.views_count }}
          </p>
        </div>
        <IPoptip
          v-model="showMore"
          placement="bottom"
          class="more"
        >
          <svg class="icon lg"><use xlink:href="#icon-more" /></svg>

          <ul
            slot="content"
            class="options"
            @click="showMore = false"
          >
            <li @click="onRepostable"><svg class="icon"><use xlink:href="#icon-share" /></svg> 转发</li>
            <li @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
          </ul>
        </IPoptip>
      </header>

      <hr>

      <main class="article-content">
        <h1>{{ post.title }}</h1>
        <div v-if="images.length" class="image-wrap">
          <template v-for="(image, index) in images">
            <AsyncFile
              v-if="!index"
              :key="image.file"
              type="image"
              :file="image"
            />
          </template>
        </div>
        <div class="markdown-body" v-html="renderedBody" />
      </main>

      <!-- <footer class="article-footer">
        <ArticleLike
          :like-count="feed.like_count"
          :liked="feed.has_like"
          :collected="feed.has_collect"
          @like="onLike"
          @collect="onCollect"
        />

        <ArticleReward
          type="feed"
          :article="feed.id"
          :count="rewardCount"
          :amount="rewardAmount"
          :rewards="rewards"
          @fetch="fetchRewards"
          @reward="onReward"
        />

        <hr>

        <ArticleComment
          ref="comment"
          type="feed"
          :count="feed.feed_comment_count"
          :comments="comments"
          @fetch="fetchComments"
          @comment="onComment"
          @comment:delete="onCommentDelete"
        />
      </footer> -->
    </div>

    <aside class="widgets">
      <SideWidget class="author-widget">
        <div class="user">
          <Avatar :user="group" />
          <div class="info">
            <h3>{{ group.name }}</h3>
            <p class="bio text-cut-2">{{ group.summary || '暂无简介' }}</p>
          </div>
        </div>
        <div class="meta">
          <div class="meta-item">成员 <span>{{ group.users_count || 0 }}</span></div>
          <div class="meta-item">帖子 <span>{{ group.posts_count || 0 }}</span></div>
        </div>
      </SideWidget>

      <SideWidget
        :users="recommendUsers"
        type="user"
        title="推荐用户"
        :loading="!recommendUsers.length"
      />
    </aside>
  </article>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import markdown from '@/utils/markdown'
import SideWidget from '@/components/common/SideWidget.vue'

export default {
  name: 'GroupPostDetail',
  components: {
    SideWidget,
  },
  data () {
    return {
      post: {},

      showMore: false,
    }
  },
  computed: {
    ...mapState('user', {
      recommendUsers: 'recommend',
    }),
    user () {
      return this.post.user
    },
    group () {
      return this.post.group
    },
    images () {
      return this.post.images || []
    },
    renderedBody () {
      return markdown(this.post.body)
    },
  },
  async asyncData ({ params, $axios }) {
    const { groupId, postId } = params
    const post = await $axios.$get(`/plus-group/groups/${groupId}/posts/${postId}`)
    return { post }
  },
  mounted () {
    this.fetchRecommendUsers()
  },
  methods: {
    ...mapActions('user', {
      fetchRecommendUsers: 'fetchRecommendUsers',
    }),
    onRepostable () {},
    onReport () {},
  },
}
</script>

<style lang="less" scoped>
.p-group-post-detail {
  display: flex;
  flex-direction: row;

  .article {
    flex: auto;
    background-color: #fff;
    margin-right: 30px;
    padding: 30px;
  }

  .article-header {
    display: flex;
    align-items: center;

    .author-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 16px;

      .time {
        margin-top: 4px;
        color: @disabled-color;
      }
    }

    .more {
      margin-left: auto;
      cursor: pointer;
    }
  }

  .article-content {
    margin-bottom: 30px;

    .image-wrap {
      display: flex;
      justify-content: center;
      background-color: @background-color-base;
      margin-bottom: 24px;
    }

    .markdown-body {
      margin-top: 16px;
    }
  }

  .widgets {
    flex: none;
    width: @sidebar-width;

    .author-widget {
      display: flex;
      flex-direction: column;

      .user {
        display: flex;
        padding: 16px;

        .info {
          display: flex;
          flex-direction: column;
          margin-left: 16px;

          .bio {
            color: @disabled-color;
            margin-top: 8px;
          }
        }
      }

      .meta {
        display: flex;
        height: 49px;
        justify-content: space-between;
        align-items: center;
        .border(top);

        .meta-item {
          flex: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          .border(right);

          &:last-child {
            border-right: 0;
          }

          > span {
            font-size: 140%;
            color: @title-color;
            margin-left: 4px;
          }
        }
      }
    }
  }
}
</style>
