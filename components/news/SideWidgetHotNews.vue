<template>
  <SideWidget title="近期热点" :loading="loading">
    <nav class="type-switcher">
      <a :class="{'active': type === 'week'}" @click="type = 'week'">一周</a>
      <a :class="{'active': type === 'month'}" @click="type = 'month'">月份</a>
      <a :class="{'active': type === 'quarter'}" @click="type = 'quarter'">季度</a>
    </nav>
    <ul v-if="news.length" class="hot-list">
      <li
        v-for="(newsItem, index) in news.slice(0, 9)"
        :key="newsItem.id"
        :class="{top3: index < 3}"
      >
        <nuxt-link class="news-wrap" :to="`/news/${newsItem.id}`">
          {{ newsItem.name }}
        </nuxt-link>
      </li>
    </ul>
    <div v-else v-empty:content />
  </SideWidget>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SideWidget from '@/components/common/SideWidget.vue'

export default {
  name: 'SideWidgetHotNews',
  components: {
    SideWidget,
  },
  data () {
    return {
      type: 'week',

      loading: true,
    }
  },
  computed: {
    ...mapState('news', {
      hotNews: 'hot',
    }),
    news () {
      return this.hotNews[this.type] || []
    },
  },
  async mounted () {
    await this.getHotNews()
    this.loading = false
  },
  methods: {
    ...mapActions('news', {
      getHotNews: 'getHotNews',
    }),
  },
}
</script>

<style lang="less" scoped>
.type-switcher {
  display: flex;
  justify-content: space-around;
  margin: 0 -12px;
  .border(bottom);

  > a {
    padding: 0 12px 12px;
    margin-bottom: -1px;

    &.active {
      color: @primary-color;
      border-bottom: 1px solid @primary-color;
    }
  }
}

.hot-list {
  counter-reset: hot;

  li {
    position: relative;
    margin: 24px 0;
    margin-left: 32px;

    &::before {
      counter-increment: hot;
      content: counter(hot);
      position: absolute;
      top: 50%;
      left: -26px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      margin-top: -8px;
      border-radius: @border-radius-small;
      background-color: @text-info-color;
      font-size: 80%;
      color: #fff;
    }

    &.top3::before {
      background-color: @primary-color;
    }
  }
}

.v-empty-content {
  height: 240px;
  transform: scale(.7);
}
</style>
