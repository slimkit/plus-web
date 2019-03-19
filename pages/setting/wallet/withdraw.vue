<template>
  <div class="p-setting-wallet-withdraw">
    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <table class="table" cellspacing="0">
        <thead>
          <tr>
            <th>时间</th>
            <th>详情</th>
            <th>数量</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{ item.created_at | fromNow({full: true}) }}</td>
            <td>{{ item.type | accountType }}</td>
            <td class="income">{{ item.value }}</td>
            <td>{{ item.status | status }}</td>
          </tr>
        </tbody>
      </table>
    </Loadmore>
  </div>
</template>

<script>
import { limit, getLastField } from '@/utils'

export default {
  name: 'SettingWalletWithdraw',
  filters: {
    accountType (type) {
      switch (type) {
        case 'alipay':
          return '支付宝账户提现'
        case 'wechat':
          return '微信账户提现'
      }
    },
    status (status) {
      switch (status) {
        case 0:
          return '待审核'
        case 1:
          return '通过'
        case 2:
          return '拒绝'
      }
    },
  },
  data () {
    return {
      list: [],
    }
  },
  methods: {
    async onRefresh () {
      const params = { limit }
      const list = await this.$axios.$get('/plus-pay/cashes', { params })
      this.list = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { limit, after: getLastField(this.list) }
      const list = await this.$axios.$get('/plus-pay/cashes', { params })
      this.list.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
  },
}
</script>

<style lang="less" scoped>
.p-setting-wallet-withdraw {
  main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px 0;
  }

  .table {
    width: 100%;

    td {
      text-align: center;
      &.income {
        color: @warning-color;
      }
      &.pending {
        color: @disabled-color;
      }

      > a {
        color: @primary-color;
      }
    }
    tr {
      height: 40px;
    }

    thead {
      background-color: @border-color-base;
    }

    tbody {
      tr:nth-child(even) {
        background-color: tint(@border-color-base, 80%);
      }
    }

  }
}
</style>
