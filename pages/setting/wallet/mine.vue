<template>
  <div class="p-setting-wallet-mine">
    <div class="wallet-wrap">
      <div>
        <data class="wallet">{{ (balance || 0).toLocaleString('en-US') }}</data>
        <p>账户余额（元）</p>
      </div>
      <IButton
        class="recharge-btn"
        type="primary"
        size="large"
      >
        充值
      </IButton>
    </div>

    <hr>

    <footer>
      <h4>使用规则</h4>
      <p class="text-pre">{{ config.rule }}</p>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'SettingWalletMine',
  computed: {
    config () {
      return this.boot.wallet
    },
    balance () {
      return this.logged.new_wallet.balance / 100
    },
  },
}
</script>

<style lang="less" scoped>
.p-setting-wallet-mine {
  .wallet-wrap {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px 0;
  }

  .wallet {
    color: @warning-color;
    font-size: 42px;
  }

  .recharge-btn {
    margin-top: 8px;
  }
}
</style>
