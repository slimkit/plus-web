<template>
  <div class="p-feed-index">
    <FeedLeftNavigation class="left-navigation" current="feed" />
    <main class="feed-container">
      <div v-if="logged" class="post-container">
        <PostText />
      </div>

      <nav class="sort-items">
        <template v-for="(item, name) in typeMap">
          <a
            v-if="!item.requireAuth || logged"
            :key="name"
            class="sort-item"
            :class="{active: type === name}"
            @click="type = name"
          >
            {{ item.label }}
          </a>
        </template>
      </nav>
      <Loadmore
        ref="loadmore"
        @refresh="onRefresh"
        @loadmore="onLoadmore"
      >
        <FeedList
          class="feed-list"
          :feeds="feeds"
          :pinneds="type === 'hot' ? pinneds : []"
        />
      </Loadmore>
    </main>
    <div class="right-container">
      <SideWidget
        v-if="recommendUsers.length"
        :users="recommendUsers"
        type="user"
        title="推荐用户"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import FeedLeftNavigation from '@/components/feed/FeedLeftNavigation.vue'
import FeedList from '@/components/feed/FeedList.vue'
import SideWidget from '@/components/common/SideWidget.vue'
import PostText from '@/components/common/PostText.vue'

const defaultType = 'new'
const typeMap = {
  new: { label: '最新' },
  hot: { label: '热门' },
  follow: { label: '关注的', requireAuth: true },
}

export default {
  name: 'FeedHome',
  head () {
    return {
      title: '动态',
    }
  },
  components: {
    FeedLeftNavigation,
    FeedList,
    SideWidget,
    PostText,
  },
  data () {
    return {
      typeMap,
    }
  },
  computed: {
    ...mapState('user', {
      recommendUsers: 'recommend',
    }),
    ...mapState('feed', {
      new: 'new',
      hot: 'hot',
      follow: 'follow',
      pinneds: 'pinned',
    }),
    type: {
      get () {
        const { type } = this.$route.query
        if (
          !Object.keys(typeMap).includes(type) ||
          (typeMap[type].requireAuth && !this.logged)
        ) return defaultType
        return type
      },
      set (val) {
        this.$router.push({ ...this.$route, query: { type: val } })
      },
    },
    feeds () {
      return this[this.type]
    },
  },
  watch: {
    type () {
      this.$refs.loadmore.afterRefresh()
      this.$refs.loadmore.beforeRefresh()
    },
  },
  mounted () {
    this.$store.dispatch('user/fetchRecommendUsers')
  },
  methods: {
    ...mapActions('feed', {
      getFeedList: 'getFeedList',
    }),
    async onRefresh () {
      let params = { type: this.type }
      const noMore = await this.getFeedList(params)
      this.$refs.loadmore.afterRefresh(noMore)
    },
    async onLoadmore () {
      let params = { type: this.type }
      const last = [...this.feeds].pop() || {}
      if (this.type === 'hot') {
        params.hot = last.hot
      } else {
        params.after = last.id
      }
      const noMore = await this.getFeedList(params)
      this.$refs.loadmore.afterLoadmore(noMore)
    },
  },
}
</script>

<style lang="less" scoped>
.p-feed-index {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .left-navigation {
    position: sticky;
    top: 0;
    flex: none;
    width: 140px;
  }

  .feed-container {
    flex: auto;
    min-width: 0px;
    margin: 0 30px;

    > div,
    > nav {
      padding: 30px;
      background-color: #fff;
    }

    .post-container {
      margin-bottom: 30px;
    }

    .sort-items {
      padding-bottom: 0;

      .sort-item {
        margin-right: 20px;
        font-size: @font-size-large;
        color: @disabled-color;

        &.active {
          color: @text-color;
        }
      }
    }

    .c-loadmore {
      padding-top: 0;
    }

    .feed-list {
      margin-top: 30px;
    }
  }

  .right-container {
    flex: none;
    width: 235px;
  }
}
</style>
