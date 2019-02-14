<template>
  <div class="p-group-manage-reports">
    <nav class="nav-wrap">
      <nuxt-link :to="{query: {type: 'all'}}" :class="{'exact-active': type === 'all'}">全部</nuxt-link>
      <nuxt-link :to="{query: {type: 'unhandled'}}" :class="{'exact-active': type === 'unhandled'}">未处理</nuxt-link>
      <nuxt-link :to="{query: {type: 'accept'}}" :class="{'exact-active': type === 'accept'}">已处理</nuxt-link>
      <nuxt-link :to="{query: {type: 'reject'}}" :class="{'exact-active': type === 'reject'}">已驳回</nuxt-link>
    </nav>

    <main>
      <Loadmore
        ref="loader"
        :show-bottom="list.length"
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
              <td>{{ item.created_at }}</td>
              <td>{{ item.user.name }}</td>
              <td class="content">{{ item.content }}</td>
              <td class="resource" @click="viewResource(item)">
                {{ item.type }}: {{ item.resource.body }}
              </td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="!list.length" v-empty:content />
      </Loadmore>
    </main>
  </div>
</template>

<script>
import { limit } from '@/utils'

export default {
  name: 'GroupManageReports',
  data () {
    return {
      all: [],
      unhandled: [],
      accept: [],
      reject: [],

      startAt: null,
      endAt: null,
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
      return params
    },
  },
  watch: {
    type () {
      this.loader.beforeRefresh()
    },
  },
  methods: {
    async onRefresh () {
      this.list = await this.$axios.$get('/plus-group/reports', { params: this.params })
      this.loader.afterRefresh(this.list.length < limit)
    },
    async onLoadmore () {},
  },
}
</script>

<style lang="less" scoped>
.p-group-manage-reports {
  .nav-wrap {
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
      &.content {
        color: @warning-color;
      }
      &.resource {
        color: @primary-color;
        cursor: pointer;
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
