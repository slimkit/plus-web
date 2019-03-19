<template>
  <div class="p-setting-currency-withdraw">
    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <table class="table" cellspacing="0">
        <thead>
          <tr>
            <th>时间</th>
            <th>状态</th>
            <th>数量</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{ item.created_at | fromNow({full: true}) }}</td>
            <td :class="{pending: item.state !== 1}">{{ item.state === 1 ? '成功' : '等待' }}</td>
            <td :class="item.state === 1 ? 'income' : 'pending'">-{{ item.amount }}积分</td>
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
      const params = { limit, action: 'cash', type: -1 }
      const list = await this.$axios.$get('/currency/orders', { params })
      this.list = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { limit, action: 'cash', type: -1, after: getLastField(this.list) }
      const list = await this.$axios.$get('/currency/orders', { params })
      this.list.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
  },
}
</script>

<style lang="less" scoped>
.p-setting-currency-withdraw {
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
