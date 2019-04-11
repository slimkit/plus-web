<template>
  <div class="p-news-index">
    <div class="banner">
      <AdvertiseBanner type="news" />
    </div>

    <div class="main-wrap">
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
          <NewsList
            class="news-list"
            :news="news"
            :category-id="cateId"
          />
        </Loadmore>
      </main>

      <aside class="news-right-container">
        <SideWidget key="publish">
          <div class="publish-wrap">
            <IButton
              type="primary"
              :long="true"
              shape="circle"
              size="large"
              to="/news/create"
            >
              <svg class="icon"><use xlink:href="#icon-publish" /></svg>
              投稿
            </IButton>
          </div>
        </SideWidget>

        <SideWidgetHotNews key="hot-news" />

        <AdvertiseRightSide type="news" />
      </aside>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions, mapState } from 'vuex'
import { limit, getLastField } from '@/utils'
import SideWidget from '@/components/common/SideWidget.vue'
import SideWidgetHotNews from '@/components/news/SideWidgetHotNews.vue'
import NewsList from '@/components/news/NewsList.vue'
import AdvertiseBanner from '@/components/advertise/AdvertiseBanner.vue'
import AdvertiseRightSide from '@/components/advertise/AdvertiseRightSide.vue'

export default {
  name: 'NewsHome',
  head () {
    return {
      title: `资讯`,
    }
  },
  components: {
    SideWidget,
    SideWidgetHotNews,
    NewsList,
    AdvertiseBanner,
    AdvertiseRightSide,
  },
  data () {
    return {
      allNews: {},
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
    news: {
      get () {
        if (this.cateId) return this.allNews[this.cateId] || []
        return this.newsMixinAdvertise
      },
      set (list) {
        this.$set(this.allNews, this.cateId, list)
      },
    },
    newsMixinAdvertise () {
      const chunks = _.chunk(this.allNews[0], limit)
      let i = 0
      for (; i < chunks.length; i++) {
        chunks[i].push(this.newsAdvertiseList[i])
      }
      const list = _.flatten(chunks)
      if (i < this.newsAdvertiseList.length) list.push(...this.newsAdvertiseList.slice(i))
      return list
    },
    newsAdvertiseList () {
      const space = 'pc:news:list'
      return this.$store.getters['advertise/getListBySpace'](space)
        .map(item => {
          item.itemType = 'advertise'
          return item
        })
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
      const list = await this.$axios.$get('/news', { params: this.params })
      this.news = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { ...this.params, after: getLastField(this.news) }
      const list = await this.$axios.$get('/news', { params })
      this.news.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
  },
}
</script>

<style lang="less" scoped>
.p-news-index {

  .main-wrap {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .news-container {
    flex: auto;
    padding: 30px;
    margin-right: 30px;
    background-color: #fff;

    .news-cates-items {
      display: flex;
      margin-bottom: 16px;
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
  }

  .news-right-container {
    position: sticky;
    top: 30px;
    flex: none;
    width: @sidebar-width;

    .publish-wrap {
      padding: 30px;
      margin-bottom: 30px;
      background-color: #fff;

      a {
        color: #fff;
      }
    }
  }
}

</style>
