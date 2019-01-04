<template>
  <div class="p-feed-index">
    <FeedLeftNavigation class="left-navigation" current="feed" />
    <main class="feed-container">
      <nav class="sort-items">
        <a
          v-for="item in typeMap"
          :key="item.name"
          class="sort-item"
          :class="{active: type === item.name}"
          @click="type = item.name"
        >
          {{ item.label }}
        </a>
      </nav>
      <Loadmore
        ref="loadmore"
        @refresh="onRefresh"
        @loadmore="onLoadmore"
      >
        <FeedList
          class="feed-list"
          :feeds="feeds"
          :pinneds="pinneds"
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

const defaultType = 'new'
const typeMap = [
  { name: 'new', label: '最新' },
  { name: 'hot', label: '热门' },
]

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
  },
  data () {
    return {
      typeMap,
      new: this.$store.state.feed.new || [],
      hot: [],
    }
  },
  computed: {
    ...mapState('user', {
      recommendUsers: 'recommend',
    }),
    ...mapState('feed', {
      pinneds: 'pinned',
    }),
    type: {
      get () {
        return this.$route.query.type || defaultType
      },
      set (val) {
        this.$router.push({ ...this.$route, query: { type: val } })
      },
    },
    feeds () {
      return this.$data[this.type]
    },
  },
  watch: {
    type () {
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
      const feeds = await this.getFeedList(params)
      this.$data[this.type] = feeds
      this.$refs.loadmore.afterRefresh(feeds.length < 15)
    },
    async onLoadmore () {
      let params = { type: this.type }
      const last = [...this.feeds].pop() || {}
      if (this.type === 'hot') {
        params.hot = last.hot
      } else {
        params.after = last.id
      }
      const feeds = await this.getFeedList(params)
      this.$data[this.type] = [...this.$data[this.type], ...feeds]
      this.$refs.loadmore.afterLoadmore(feeds.length < 15)
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
    padding: 22px 40px;
    margin: 0 30px;
    background-color: #fff;

    .sort-items {
      margin-bottom: 16px;

      .sort-item {
        margin-right: 20px;
        font-size: @font-size-large;
        color: @disabled-color;

        &.active {
          color: @text-color;
        }
      }
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
