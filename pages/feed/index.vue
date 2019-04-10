<template>
  <div class="p-feed-index">
    <FeedLeftNavigation class="left-navigation" current="feed" />
    <main class="feed-container">
      <div v-if="logged" class="post-container">
        <PostFeed @post="onPost" />
      </div>

      <nav class="sort-items">
        <template v-for="(item, name) in typeMap">
          <nuxt-link
            v-if="!item.requireAuth || logged"
            :key="name"
            :to="{query: {type:name}}"
            replace
            class="sort-item"
            :class="{active: type === name}"
          >
            {{ item.label }}
          </nuxt-link>
        </template>
      </nav>
      <Loadmore
        ref="loader"
        @refresh="onRefresh"
        @loadmore="onLoadmore"
      >
        <FeedList
          class="feed-list"
          :feeds="feeds"
          @after-delete="afterDeleteFeed"
        />
      </Loadmore>
    </main>
    <div class="right-container">
      <SideWidget v-if="logged && enableCheckin" key="checkin">
        <CheckIn />
      </SideWidget>

      <SideWidgetRecommendUsers key="recommend-users" />

      <AdvertiseRightSide type="feed" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import SideWidget from '@/components/common/SideWidget.vue'
import SideWidgetRecommendUsers from '@/components/user/SideWidgetRecommendUsers.vue'
import CheckIn from '@/components/feed/CheckIn.vue'
import PostFeed from '@/components/feed/PostFeed.vue'
import FeedLeftNavigation from '@/components/feed/FeedLeftNavigation.vue'
import FeedList from '@/components/feed/FeedList.vue'
import AdvertiseRightSide from '@/components/advertise/AdvertiseRightSide.vue'

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
      title: '首页',
    }
  },
  components: {
    FeedLeftNavigation,
    FeedList,
    SideWidget,
    SideWidgetRecommendUsers,
    CheckIn,
    PostFeed,
    AdvertiseRightSide,
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
    ...mapGetters('feed', {
      new: 'new',
      hot: 'hot',
      follow: 'follow',
    }),
    enableCheckin () {
      const { checkin = {} } = this.boot
      return checkin.switch
    },
    type () {
      const { type } = this.$route.query
      if (
        !Object.keys(typeMap).includes(type) ||
          (typeMap[type].requireAuth && !this.logged)
      ) return defaultType
      return type
    },
    feeds () {
      return this[this.type]
    },
  },
  watch: {
    type () {
      this.loader.afterRefresh()
      this.loader.beforeRefresh()
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
      this.loader.afterRefresh(noMore)
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
      this.loader.afterLoadmore(noMore)
    },
    onPost (id) {
      this.$router.replace({ query: { type: 'new' } })
      this.loader.beforeRefresh()
    },
    afterDeleteFeed (feedId) {
      this.$store.commit('feed/DELETE_FEED', { feedId, type: this.type })
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
    width: @sidebar-width;
  }
}
</style>
