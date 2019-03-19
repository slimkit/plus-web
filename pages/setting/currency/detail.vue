<template>
  <div class="p-setting-currency-detail">
    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <table class="table" cellspacing="0">
        <thead>
          <tr>
            <th>时间</th>
            <th>途径</th>
            <th>状态</th>
            <th>数量</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{ item.created_at | fromNow }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.state === 1 ? '成功' : '失败' }}</td>
            <td :class="item.type === 1 ? 'income' : 'pay'">{{ item.type === 1 ? '+': '-' }}{{ item.amount }}积分</td>
          </tr>
        </tbody>
      </table>
    </Loadmore>
  </div>
</template>

<script>
import { limit, getLastField } from '@/utils'

export default {
  name: 'SettingCurrencyIndex',
  data () {
    return {
      list: [],
    }
  },
  methods: {
    async onRefresh () {
      const params = { limit }
      const list = await this.$axios.$get('/currency/orders', { params })
      this.list = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { limit, after: getLastField(this.list) }
      const list = await this.$axios.$get('/currency/orders', { params })
      this.list.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
  },
}
</script>

<style lang="less" scoped>
.p-setting-currency-detail {
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
      &.pay {
        color: @error-color;
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
