<template>
  <div class="p-rank-user">
    <RankList
      key="fans"
      title="粉丝排行榜"
      :list="fans"
      extra="粉丝数"
      @next="fetchFans"
    />

    <RankList
      key="balance"
      title="财富达人排行榜"
      :list="balance"
      @next="fetchBalance"
    />

    <RankList
      key="checkin"
      title="社区签到排行榜"
      :list="checkin"
      extra="累计签到"
      @next="fetchCheckin"
    />

    <RankList
      key="experts"
      title="社区专家排行榜"
      :list="experts"
      @next="fetchExperts"
    />

    <RankList
      key="qa-likes"
      title="问答达人排行榜"
      :list="likes"
      extra="回答点赞量"
      @next="fetchLikes"
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
      originFans: [],
      originBalance: [],
      originCheckin: [],
      originExperts: [],
      originLikes: [],
    }
  },
  computed: {
    fans () {
      return this.originFans.map(item => ({
        user: item,
        extra: item.extra.followers_count,
      }))
    },
    balance () {
      return this.originBalance.map(item => ({
        user: item,
      }))
    },
    checkin () {
      return this.originCheckin.map(item => ({
        user: item,
        extra: item.extra.checkin_count,
      }))
    },
    experts () {
      return this.originExperts.map(item => ({
        user: item,
      }))
    },
    likes () {
      return this.originLikes.map(item => ({
        user: item,
        extra: item.extra.count,
      }))
    },
  },
  async asyncData ({ $axios }) {
    const params = { limit: limit * 2 } // 首屏加载 2 页
    let [originFans, originBalance, originCheckin, originExperts, originLikes] = await Promise.all([
      $axios.$get('/ranks/followers', { params }),
      $axios.$get('/ranks/balance', { params }),
      $axios.$get('/checkin-ranks', { params }),
      $axios.$get('/question-ranks/experts', { params }),
      $axios.$get('/question-ranks/likes', { params }),
    ])
    return { originFans, originBalance, originCheckin, originExperts, originLikes }
  },
  methods: {
    async fetchFans (page) {
      const params = { limit, offset: limit * (page + 1) } // 预加载 1 页
      const fans = await this.$axios.$get('/ranks/followers', { params })
      this.originFans.push(...fans)
    },
    async fetchBalance (page) {
      const params = { limit, offset: limit * (page + 1) } // 预加载 1 页
      const balance = await this.$axios.$get('/ranks/balance', { params })
      this.originBalance.push(...balance)
    },
    async fetchCheckin (page) {
      const params = { limit, offset: limit * (page + 1) } // 预加载 1 页
      const checkin = await this.$axios.$get('/checkin-ranks', { params })
      this.originCheckin.push(...checkin)
    },
    async fetchExperts (page) {
      const params = { limit, offset: limit * (page + 1) } // 预加载 1 页
      const experts = await this.$axios.$get('/question-ranks/experts', { params })
      this.originExperts.push(...experts)
    },
    async fetchLikes (page) {
      const params = { limit, offset: limit * (page + 1) } // 预加载 1 页
      const likes = await this.$axios.$get('/question-ranks/likes', { params })
      this.originLikes.push(...likes)
    },
  },
}
</script>
