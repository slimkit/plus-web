<template>
  <div class="p-setting-currency">
    <nav class="nav-wrap">
      <nuxt-link :class="{'exact-active': page === 'mine'}" to="/setting/currency/mine">我的积分</nuxt-link>
      <nuxt-link :class="{'exact-active': page === 'detail'}" to="/setting/currency/detail">积分明细</nuxt-link>
      <nuxt-link :class="{'exact-active': page === 'withdraw'}" to="/setting/currency/withdraw">提取记录</nuxt-link>
    </nav>

    <main>
      <nuxt-child />
    </main>
  </div>
</template>

<script>

export default {
  name: 'SettingCurrency',
  computed: {
    page () {
      const match = /^\/setting\/currency\/(\w+)$/.exec(this.$route.path)
      return match && match[1]
    },
  },
  fetch ({ route, redirect }) {
    if (route.name === 'setting-currency') return redirect('/setting/currency/mine')
  },
}
</script>

<style lang="less" scoped>
.p-setting-currency {
  main {
    padding: 24px 0;
  }
}
</style>
