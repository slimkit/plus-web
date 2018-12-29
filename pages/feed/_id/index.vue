<template>
  <article class="p-feed-detail">
    <div class="article">
      <header class="article-header">
        <Avatar :user="user" />
        <div class="author-info">
          <h3>{{ user.name }}</h3>
          <p class="bio">{{ feed.created_at | fromNow }}</p>
        </div>
        <svg class="icon more">
          <use xlink:hrer="#icon-more" />
        </svg>
      </header>
      <main class="article-content">
        <div class="feed-content">
          {{ feed.feed_content }}
        </div>
      </main>
      <footer class="article-footer" />
    </div>
    <aside class="widgets">
      <SideWidget class="author-widget">
        <div class="user">
          <Avatar :user="user" />
          <div class="info">
            <h3>{{ user.name }}</h3>
            <p class="bio">{{ user.bio || '暂无简介' }}</p>
          </div>
        </div>
        <div class="meta">
          <div class="meta-item">粉丝 <span>0</span></div>
          <div class="meta-item">关注 <span>0</span></div>
        </div>
      </SideWidget>

      <SideWidget
        v-if="recommendUsers.length"
        :users="recommendUsers"
        type="user"
        title="推荐用户"
      />
    </aside>
  </article>
</template>

<script>
import { mapState } from 'vuex'
import SideWidget from '@/components/common/SideWidget.vue'

export default {
  name: 'FeedDetail',
  components: {
    SideWidget,
  },
  head: {
    title: '动态详情',
  },
  validate ({ params, query }) {
    return /^\d+$/.test(params.id)
  },
  data: function () {
    return {
      feed: {},
    }
  },
  computed: {
    ...mapState('user', {
      recommendUsers: 'recommend',
    }),
    user () {
      return this.feed.user || {}
    },
  },
  async asyncData ({ $axios, params }) {
    const feed = await $axios.$get(`/feeds/${params.id}`)
    return { feed }
  },
  async fetch ({ store, params }) {
    await store.dispatch('user/fetchRecommendUsers')
  },
}
</script>

<style lang="less" scoped>
.p-feed-detail {
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
    padding-bottom: 16px;
    .border(bottom);

    .author-info {
      margin-left: 16px;

      .bio {
        color: @disabled-color;
      }
    }
  }

  .article-content {
    .border(bottom);

    .feed-content {
      padding: 30px;
    }
  }

  .widgets {
    flex: none;
    width: 235px;

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
        margin: 0 -12px -12px;
        border-top: 1px solid @border-color-split;

        .meta-item {
          flex: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          border-right: 1px solid @border-color-split;

          &:last-child {
            border-right: 0;
          }

          > span {
            font-size: 120%;
            color: @title-color;
            margin-left: 4px;
          }
        }
      }
    }
  }
}
</style>
