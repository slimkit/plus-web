<template>
  <div class="p-rank-feed">
    <RankList
      key="today"
      title="今日动态排行榜"
      :list="today"
      extra="点赞量"
      @next="fetchToday"
    />
    <RankList
      key="week"
      title="一周动态排行榜"
      :list="week"
      extra="点赞量"
      @next="fetchWeek"
    />
    <RankList
      key="month"
      title="本月动态排行榜"
      :list="month"
      extra="点赞量"
      @next="fetchMonth"
    />
  </div>
</template>

<script>
import RankList from '@/components/rank/RankList.vue'

const limit = 10

export default {
  name: 'RankUser',
  components: {
    RankList,
  },
  data () {
    return {
      originToday: [],
      originWeek: [],
      originMonth: [],
    }
  },
  computed: {
    today () {
      return this.originToday.map(item => ({
        user: item,
        extra: item.extra.count,
      }))
    },
    week () {
      return this.originWeek.map(item => ({
        user: item,
        extra: item.extra.count,
      }))
    },
    month () {
      return this.originMonth.map(item => ({
        user: item,
        extra: item.extra.count,
      }))
    },
  },
  async asyncData ({ $axios }) {
    const params = { limit: limit * 2 } // 首屏加载 2 页
    let [originToday, originWeek, originMonth] = await Promise.all([
      $axios.$get('/feeds/ranks', { params: { ...params, type: 'day' } }),
      $axios.$get('/feeds/ranks', { params: { ...params, type: 'week' } }),
      $axios.$get('/feeds/ranks', { params: { ...params, type: 'month' } }),
    ])
    return { originToday, originWeek, originMonth }
  },
  methods: {
    async fetchToday (page) {
      const params = { limit, offset: limit * (page + 1) } // 预加载 1 页
      const data = await this.$axios.$get('/feeds/ranks', { params: { ...params, type: 'day' } })
      this.originToday.push(...data)
    },
    async fetchWeek (page) {
      const params = { limit, offset: limit * (page + 1) } // 预加载 1 页
      const data = await this.$axios.$get('/feeds/ranks', { params: { ...params, type: 'week' } })
      this.originWeek.push(...data)
    },
    async fetchMonth (page) {
      const params = { limit, offset: limit * (page + 1) } // 预加载 1 页
      const data = await this.$axios.$get('/feeds/ranks', { params: { ...params, type: 'month' } })
      this.originMonth.push(...data)
    },
  },
}
</script>
