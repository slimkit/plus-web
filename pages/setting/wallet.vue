<template>
  <div class="p-setting-wallet">
    <nav class="nav-wrap">
      <nuxt-link :class="{'exact-active': page === 'mine'}" to="/setting/wallet/mine">我的钱包</nuxt-link>
      <nuxt-link :class="{'exact-active': page === 'detail'}" to="/setting/wallet/detail">交易明细</nuxt-link>
      <!-- <nuxt-link :class="{'exact-active': page === 'recharge'}" to="/setting/wallet/recharge">充值记录</nuxt-link> -->
      <nuxt-link :class="{'exact-active': page === 'withdraw'}" to="/setting/wallet/withdraw">提取记录</nuxt-link>
    </nav>

    <main>
      <nuxt-child />
    </main>
  </div>
</template>

<script>

export default {
  name: 'SettingWallet',
  head () {
    return {
      title: '我的钱包',
    }
  },
  computed: {
    page () {
      const match = /^\/setting\/currency\/(\w+)$/.exec(this.$route.path)
      return match && match[1]
    },
  },
  fetch ({ route, redirect }) {
    if (route.name === 'setting-wallet') return redirect('/setting/wallet/mine')
  },
}
</script>

<style lang="less" scoped>
.p-setting-wallet {
  main {
    padding: 24px 0;
  }
}
</style>
