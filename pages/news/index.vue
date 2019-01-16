<template>
  <div class="p-news-index">
    <!-- <NewsListTop /> -->
    <main class="news-container">
      <nav class="news-cates-items">
        <a
          class="news-cates-item"
          :class="{active: cateId === 0}"
          @click="cateId = 0"
        >
          推荐
        </a>
        <a
          v-for="item in cates"
          :key="item.id"
          class="news-cates-item"
          :class="{active: cateId === item.id}"
          @click="cateId = item.id"
        >
          {{ item.name }}
        </a>
      </nav>
      <NewsList
        class="news-list"
        :news="news"
      />
    </main>
    <div class="news-right-container" />
  </div>
</template>
<script>
// import NewsListTop from '@/components/news/NewsListTop.vue'
import NewsList from '@/components/news/NewsList.vue'

export default {
  name: 'NewsHome',
  components: {
    // NewsListTop,
    NewsList,
  },
  data () {
    return {
      news: [],
      cates: [],
    }
  },
  computed: {
    cateId: {
      get () {
        return this.$route.query.cateId
      },
      set (val) {
        this.$router.push({ ...this.$route, query: { cateId: val } })
      },
    },
  },
  watch: {
    cateId () {
      this.fetchNews()
    },
    recommend () {
      this.fetchNews()
    },
  },
  async asyncData ({ $axios, query }) {
    const { cateId } = query
    const params = cateId ? { cate_id: cateId } : { recommend: 1 }
    const news = await $axios.$get('/news', { params })
    const cates = await $axios.$get('/news/cates')
    return {
      news: news,
      cates: [...cates['my_cates'], ...cates['more_cates']],
    }
  },
  methods: {
    async fetchNews () {
      const params = this.cateId ? { cate_id: this.cateId } : { recommend: 1 }
      const news = await this.$axios.$get('/news', { params })
      this.$data.news = news
    },
  },
}
</script>
<style lang="less" scoped>
.p-news-index {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

  .news-cates-items {
    display: flex;
    background-color: #fff;
    margin-bottom: 20px
  }
    .news-cates-item {
      padding: 20px 20px;
      color: @disabled-color;
      &.active {
        color: @primary-color;
      }
    }

  .news-container {
    width: 750px;
  }

  .news-right-container {
    position: sticky;
    top: 0;
    flex: none;
    width: @sidebar-width;
  }
</style>
