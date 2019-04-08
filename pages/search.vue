<template>
  <div class="p-search">
    <main class="main-container">
      <nav class="search-nav">
        <nuxt-link
          v-for="item in searchTips"
          :key="item.to"
          :to="`${item.to}?keyword=${keyword}`"
          exact-active-class="exact-active"
          replace
        >
          {{ item.label }}
        </nuxt-link>
      </nav>

      <div class="search-container">
        <nuxt-child />
      </div>
    </main>

    <aside class="side-container">
      <SideWidgetRecommendUsers />
    </aside>
  </div>
</template>

<script>
import SideWidgetRecommendUsers from '@/components/user/SideWidgetRecommendUsers.vue'

const searchTips = [
  { label: '动态', to: `/search/feed` },
  { label: '话题', to: `/search/topic` },
  { label: '资讯', to: `/search/news` },
  { label: '问题', to: `/search/question` },
  { label: '专题', to: `/search/question-topic` },
  { label: '圈子', to: `/search/group` },
  { label: '用户', to: `/search/user` },
]

export default {
  name: 'SearchIndex',
  components: {
    SideWidgetRecommendUsers,
  },
  data () {
    return {
      searchTips,
    }
  },
  computed: {
    keyword () {
      return this.$route.query.keyword
    },
  },
}
</script>

<style lang="less" scoped>
.p-search {
  display: flex;
  align-items: flex-start;

  .main-container {
    flex: auto;
    margin-right: 30px;
    background-color: #fff;
    padding: 30px;

    .search-nav {
      padding-bottom: 24px;
      .border(bottom);

      > a {
        padding: 12px 8px;
        margin-right: 24px;
        color: @disabled-color;
        transition: color @transition-time;

        &.exact-active {
          color: @text-color;
        }

        &:hover {
          color: @primary-color;
        }
      }
    }

    .search-container {
      padding-top: 30px;
    }
  }

  .side-container {
    position: sticky;
    top: 30px;
    flex: none;
    width: @sidebar-width;
  }
}
</style>
