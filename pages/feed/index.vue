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
      <FeedList
        class="feed-list"
        :feeds="feeds"
        :pinneds="pinneds"
      />
    </main>
    <div class="right-container">
      <SideWidget v-if="recommendUsers.length" title="推荐用户">
        <ul class="user-list">
          <li
            v-for="user in recommendUsers"
            :key="user.id"
            class="user-item"
          >
            <Avatar :user="user" />
            <span class="username text-cut">{{ user.name }}</span>
          </li>
        </ul>
      </SideWidget>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
      new: [],
      hot: [],
      pinneds: [],
    }
  },
  computed: {
    ...mapState('user', {
      recommendUsers: 'recommend',
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
      this.fetchFeeds()
    },
  },
  async asyncData ({ $axios, query }) {
    const { type = defaultType } = query
    const { feeds, pinned } = await $axios.$get('/feeds', { params: { type } })
    return {
      [type]: feeds,
      pinneds: pinned,
    }
  },
  async fetch ({ store, params }) {
    await store.dispatch('user/fetchRecommendUsers')
  },
  methods: {
    async fetchFeeds () {
      const params = { type: this.type }
      const { feeds, pinned } = await this.$axios.$get('/feeds', { params })
      this.$data[this.type] = feeds
      this.pinneds = pinned
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

    .user-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .user-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 30%;
        margin: 8px 0;

        .username {
          margin-top: 8px;
          font-size: @font-size-small;
          text-align: center;
          max-width: 5em;
        }
      }
    }
  }
}
</style>
