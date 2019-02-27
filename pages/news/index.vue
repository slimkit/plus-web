<template>
  <div class="p-news-index">
    <!-- <NewsListTop /> -->
    <main class="news-container">
      <nav class="news-cates-items">
        <nuxt-link :to="{query: {cate: 0}}" :class="{'exact-active': cateId === 0}">推荐</nuxt-link>
        <nuxt-link
          v-for="cate in categories"
          :key="cate.id"
          :to="{query: {cate: cate.id}}"
          :class="{'exact-active': cateId === cate.id}"
        >
          {{ cate.name }}
        </nuxt-link>
      </nav>

      <Loadmore
        ref="loader"
        @refresh="onRefresh"
        @loadmore="onLoadmore"
      >
        <NewsList class="news-list" :news="news" />
      </Loadmore>
    </main>

    <aside class="news-right-container">
      <SideWidget :title="热门资讯">
        <ul>
          <li v-for="item in hot" :key="item.id">
            {{ item.name }}
          </li>
        </ul>
      </SideWidget>
    </aside>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { limit, getLastField } from '@/utils'
// import NewsListTop from '@/components/news/NewsListTop.vue'
import NewsList from '@/components/news/NewsList.vue'
import SideWidget from '@/components/common/SideWidget.vue'

export default {
  name: 'NewsHome',
  components: {
    // NewsListTop,
    NewsList,
    SideWidget,
  },
  data () {
    return {
      news: [],
      hotType: 'month',
    }
  },
  computed: {
    ...mapState('news', {
      hotNews: 'hot',
    }),
    ...mapGetters('news', {
      categories: 'categories',
    }),
    cateId () {
      return Number(this.$route.query.cate) || 0
    },
    params () {
      return this.cateId ? { cate_id: this.cateId } : { recommend: 1 }
    },
    hot () {
      return this.hotNews[this.hotType] || []
    },
  },
  watch: {
    cateId () {
      this.loader.beforeRefresh()
    },
  },
  mounted () {
    this.getNewsCategories()
  },
  methods: {
    ...mapActions('news', {
      getNewsCategories: 'getNewsCategories',
    }),
    async onRefresh () {
      this.news = await this.$axios.$get('/news', { params: this.params })
      this.loader.afterRefresh(this.news.length < limit)
    },
    async onLoadmore () {
      const params = { ...this.params, after: getLastField(this.news) }
      const news = await this.$axios.$get('/news', { params })
      this.news.push(...news)
      this.loader.afterLoadmore(news.length < limit)
    },
  },
}
</script>

<style lang="less" scoped>
.p-news-index {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .news-cates-items {
    display: flex;
    background-color: #fff;

    > a {
      padding: 8px 1em;
      color: @disabled-color;

      &.exact-active,
      &:hover {
        color: @primary-color;
      }
    }
  }

  .news-container {
    flex: auto;
    background-color: #fff;
    padding: 30px;
  }

  .news-right-container {
    position: sticky;
    top: 0;
    display: flex;
    flex: none;
    width: @sidebar-width;
    background-color: #fff;
  }
}

</style>
