<template>
  <div class="p-rank-news">
    <RankList
      key="week"
      title="一周资讯排行榜"
      :list="week"
      extra="浏览量"
      @next="fetchWeek"
    />
    <RankList
      key="month"
      title="本月资讯排行榜"
      :list="month"
      extra="浏览量"
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
      originWeek: [],
      originMonth: [],
    }
  },
  computed: {
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
    let [originWeek, originMonth] = await Promise.all([
      $axios.$get('/news/ranks', { params: { ...params, type: 'week' } }),
      $axios.$get('/news/ranks', { params: { ...params, type: 'month' } }),
    ])
    return { originWeek, originMonth }
  },
  methods: {
    async fetchWeek (page) {
      const params = { limit, offset: limit * (page + 1) } // 预加载 1 页
      const data = await this.$axios.$get('/news/ranks', { params: { ...params, type: 'week' } })
      this.originWeek.push(...data)
    },
    async fetchMonth (page) {
      const params = { limit, offset: limit * (page + 1) } // 预加载 1 页
      const data = await this.$axios.$get('/news/ranks', { params: { ...params, type: 'month' } })
      this.originMonth.push(...data)
    },
  },
}
</script>
