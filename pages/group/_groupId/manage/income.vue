<template>
  <div class="p-group-manage-income">
    <nav class="nav-wrap">
      <nuxt-link
        replace
        :class="{'exact-active': type === 'all'}"
        :to="{query: {type: 'all'}}"
      >
        圈子财务
      </nuxt-link>
      <nuxt-link
        replace
        :class="{'exact-active': type === 'pinned'}"
        :to="{query: {type: 'pinned'}}"
      >
        置顶收益
      </nuxt-link>
      <nuxt-link
        replace
        :class="{'exact-active': type === 'join'}"
        :to="{query: {type: 'join'}}"
      >
        成员费
      </nuxt-link>
    </nav>

    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <main>
        <template v-if="type === 'all'">
          <data class="balance">{{ balance }}</data>
          <p class="gray">账户余额（积分）</p>
        </template>
        <template v-else-if="type === 'join'">
          <data class="balance">{{ group.join_income_count }}</data>
          <p class="gray">成员费（积分）</p>
        </template>
        <template v-else>
          <data class="balance">{{ group.excellen_posts_count }}</data>
          <p class="gray">置顶收益（积分）</p>
        </template>

        <div class="header">
          <h3>交易记录</h3>
          <IDatePicker
            v-model="date"
            class="date-picker"
            type="daterange"
            placement="bottom-end"
            placeholder="根据日期过滤"
            style="width: 200px"
          />
        </div>

        <table class="table" cellspacing="0">
          <thead>
            <tr>
              <th>交易时间</th>
              <th>交易事项</th>
              <th>交易金额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ item.created_at | fromNow }}</td>
              <td>{{ item.subject }}</td>
              <td class="income">+{{ item.amount }}</td>
            </tr>
          </tbody>
        </table>
      </main>
    </Loadmore>
  </div>
</template>

<script>
import { limit, getLastField } from '@/utils'

export default {
  name: 'GroupManageIncome',
  data () {
    return {
      date: [],
      list: [],
    }
  },
  computed: {
    group () {
      return this.$parent.group
    },
    balance () {
      return this.group.join_income_count + this.group.excellen_posts_count
    },
    type () {
      return this.$route.query.type || 'all'
    },
  },
  watch: {
    date () {
      this.loader.beforeRefresh()
    },
    type () {
      this.date = []
      this.loader.beforeRefresh()
    },
  },
  methods: {
    async onRefresh () {
      const params = { start: this.date[0], end: this.date[1], limit, type: this.type }
      const list = await this.$axios.$get(`/plus-group/groups/${this.group.id}/incomes`, { params })
      this.list = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { start: this.date[0], end: this.date[1], limit, type: this.type, after: getLastField(this.list) }
      const list = await this.$axios.$get(`/plus-group/groups/${this.group.id}/incomes`, { params })
      this.list.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
  },
}
</script>

<style lang="less" scoped>
.p-group-manage-income {
  .balance {
    display: block;
    margin-top: 16px;
    font-size: 42px;
    color: @warning-color;
  }

  .gray {
    color: @disabled-color;
  }

  .header {
    display: flex;
    justify-content: space-between;
    margin: 16px 0;
  }

  .table {
    width: 100%;

    td {
      text-align: center;
      &.income {
        color: @warning-color;
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
