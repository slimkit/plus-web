<template>
  <div class="p-group-manage-reports">
    <nav class="nav-wrap">
      <nuxt-link :to="{query: {type: 'all'}}" :class="{'exact-active': type === 'all'}">全部</nuxt-link>
      <nuxt-link :to="{query: {type: 'unhandled'}}" :class="{'exact-active': type === 'unhandled'}">未处理</nuxt-link>
      <nuxt-link :to="{query: {type: 'accept'}}" :class="{'exact-active': type === 'accept'}">已处理</nuxt-link>
      <nuxt-link :to="{query: {type: 'reject'}}" :class="{'exact-active': type === 'reject'}">已驳回</nuxt-link>

      <IDatePicker
        v-model="date"
        class="date-picker"
        type="daterange"
        placement="bottom-end"
        placeholder="根据日期过滤"
        style="width: 200px"
      />
    </nav>

    <main>
      <Loadmore
        ref="loader"
        :show-bottom="!!list.length"
        @refresh="onRefresh"
        @loadmore="onLoadmore"
      >
        <table class="table" cellspacing="0">
          <thead>
            <tr>
              <th>举报时间</th>
              <th>举报人</th>
              <th>举报内容</th>
              <th>举报来源</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in list" :key="item.id">
              <td class="time">{{ item.created_at | fromNow({full: true}) }}</td>
              <td>{{ item.user.name }}</td>
              <td class="content">{{ item.content }}</td>
              <td class="resource text-cut">
                <nuxt-link v-if="item.type === 'post'" :to="`/group/${item.group_id}/post/${item.resource.id}`">帖子：{{ item.resource.body }}</nuxt-link>
              </td>
              <td>
                <template v-if="item.status === 0">
                  <a class="primary-color" @click="onAccept(item)">通过</a>
                  <a class="error-color" @click="onReject()">驳回</a>
                </template>
                <span v-else-if="item.status === 1">已处理</span>
                <span v-else-if="item.status === 2">被驳回</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!loading && !list.length" v-empty:content />
      </Loadmore>
    </main>
  </div>
</template>

<script>
import { limit, getLastField } from '@/utils'

const auditMap = {
  2: '被驳回',
}

export default {
  name: 'GroupManageReports',
  filters: {
    audit (status) {
      return auditMap[status]
    },
  },
  data () {
    return {
      all: [],
      unhandled: [],
      accept: [],
      reject: [],
      date: [null, null],

      loading: false,
    }
  },
  computed: {
    type () {
      return this.$route.query.type || 'all'
    },
    list: {
      get () {
        return this.$data[this.type]
      },
      set (val) {
        this.$data[this.type] = val
      },
    },
    params () {
      const params = { limit, group_id: this.$parent.group.id }
      const typeMap = { all: undefined, unhandled: 0, accept: 1, reject: 2 }
      params.status = typeMap[this.type]
      if (this.date) {
        params.start = ~~(new Date(this.date[0]) / 1000)
        params.end = ~~(new Date(this.date[1]) / 1000)
      }
      return params
    },
  },
  watch: {
    type () { this.loader.beforeRefresh() },
    date (newVal, oldVal) {
      if (newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1]) {
        this.loader.beforeRefresh()
      }
    },
  },
  methods: {
    async onRefresh () {
      this.loading = true
      this.list = await this.$axios.$get('/plus-group/reports', { params: this.params })
      this.loader.afterRefresh(this.list.length < limit)
      this.loading = false
    },
    async onLoadmore () {
      const params = { ...this.params, after: getLastField(this.list) }
      const list = await this.$axios.$get('/plus-group/reports', { params })
      this.list.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
    async onAccept (report) {
      await this.$axios.$patch(`/plus-group/reports/${report.id}/accept`)
      this.$Message.success('处理成功')
      this.loader.beforeRefresh()
    },
    async onReject (report) {
      await this.$axios.$patch(`/plus-group/reports/${report.id}/reject`)
      this.$Message.success('处理成功')
      this.loader.beforeRefresh()
    },
  },
}
</script>

<style lang="less" scoped>
.p-group-manage-reports {
  .nav-wrap {
    display: flex;
    align-items: flex-start;

    .date-picker {
      margin-left: auto;
    }

    a {
      color: @disabled-color;
      &.exact-active {
        color: @text-color;
      }
    }
  }

  .table {
    width: 100%;
    td {
      text-align: center;
      &.time {
        width: 10em;
      }
      &.content {
        color: @warning-color;
      }
      &.resource {
        max-width: 6em;
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
