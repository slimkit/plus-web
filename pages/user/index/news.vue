<template>
  <div class="p-user-news">
    <nav class="cate-wrap">
      <nuxt-link
        replace
        :to="{query: {type: 'publish'}}"
        :class="{'exact-active': type === 'publish'}"
      >
        已发布
      </nuxt-link>
      <nuxt-link
        replace
        :to="{query: {type: 'audit'}}"
        :class="{'exact-active': type === 'audit'}"
      >
        投稿中
      </nuxt-link>
      <nuxt-link
        replace
        :to="{query: {type: 'reject'}}"
        :class="{'exact-active': type === 'reject'}"
      >
        被驳回
      </nuxt-link>
    </nav>

    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <NewsList :news="news" />
    </Loadmore>
  </div>
</template>

<script>
import { limit, getLastField } from '@/utils'
import NewsList from '@/components/news/NewsList.vue'

const typeMap = {
  publish: 0,
  audit: 1,
  reject: 3,
}

export default {
  name: 'UserNews',
  components: {
    NewsList,
  },
  data () {
    return {
      publish: [],
      audit: [],
      reject: [],
    }
  },
  computed: {
    type () {
      return this.$route.query.type || 'publish'
    },
    news: {
      get () {
        return this.$data[this.type] || []
      },
      set (val) {
        this.$data[this.type] = val
      },
    },
  },
  watch: {
    type () {
      this.loader.beforeRefresh()
    },
  },
  methods: {
    async onRefresh () {
      const params = { limit, type: typeMap[this.type] }
      this.news = await this.$axios.$get('/user/news/contributes', { params })
      this.loader.afterRefresh(this.news.length < limit)
    },
    async onLoadmore () {
      const params = { limit, type: typeMap[this.type], after: getLastField(this.news) }
      const news = await this.$axios.$get('/user/news/contributes', { params })
      this.news.push(...news)
      this.loader.afterLoadmore(news.length < limit)
    },
  },
}
</script>

<style lang="less" scoped>
.p-user-news {
  .cate-wrap {
    margin-bottom: 16px;

    > a {
      margin-right: 16px;

      &.exact-active {
        color: @primary-color;
      }
    }
  }
}
</style>
