<template>
  <div class="p-setting-currency-mine">
    <div class="currency-wrap">
      <div>
        <data class="currency">{{ (logged.currency.sum || 0).toLocaleString('en-US') }}</data>
        <p>当前积分</p>
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
      <h4>积分规则</h4>
      <p class="text-pre">{{ config.rule }}</p>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'SettingCurrencyMine',
  computed: {
    config () {
      return this.boot.currency
    },
  },
}
</script>

<style lang="less" scoped>
.p-setting-currency-mine {
  .currency-wrap {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px 0;
  }

  .currency {
    color: @warning-color;
    font-size: 42px;
  }

  .recharge-btn {
    margin-top: 8px;
  }
}
</style>
