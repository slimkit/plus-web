<template>
  <div class="p-group-manage-members">
    <nav class="nav-wrap">
      <nuxt-link :to="{query: {type: 'all'}}" :class="{'exact-active': type === 'all'}">全部成员</nuxt-link>
      <nuxt-link :to="{query: {type: 'audit'}}" :class="{'exact-active': type === 'audit'}">待审核</nuxt-link>
      <nuxt-link :to="{query: {type: 'blacklist'}}" :class="{'exact-active': type === 'blacklist'}">黑名单</nuxt-link>
    </nav>

    <main>
      <template v-if="type === 'all'">
        <GroupMembers :group-id="group.id" :members="initMembers" />
      </template>
      <template v-else>
        <Loadmore
          ref="loader"
          @refresh="onRefresh"
          @loadmore="onLoadmore"
        >
          <GroupMemberList :members="list" />
        </Loadmore>
      </template>
    </main>
  </div>
</template>

<script>
import _ from 'lodash'
import { limit, getLastField } from '@/utils'
import GroupMembers from '@/components/group/GroupMembers.vue'
import GroupMemberList from '@/components/group/GroupMemberList.vue'

export default {
  name: 'GroupManageMembers',
  components: {
    GroupMembers,
    GroupMemberList,
  },
  data () {
    return {
      initMembers: {},
      auditMembers: [],
      blackMembers: [],
    }
  },
  computed: {
    group () {
      return this.$parent.group
    },
    type () {
      const { type } = this.$route.query
      return type || 'all'
    },
    list: {
      get () {
        switch (this.type) {
          case 'audit':
            return this.auditMembers
          case 'blacklist':
            return this.blackMembers
        }
        return []
      },
      set (val) {
        switch (this.type) {
          case 'audit':
            this.auditMembers = val
            break
          case 'blacklist':
            this.blackMembers = val
            break
        }
      },
    },
  },
  watch: {
    type () {
      this.loader.beforeRefresh()
    },
  },
  mounted () {
    this.fetchManager()
  },
  methods: {
    async fetchManager () {
      const params = { limit: 100, type: 'manager' }
      const members = await this.$axios.$get(`/plus-group/groups/${this.group.id}/members`, { params })
      this.initMembers = _.groupBy(members, 'role')
    },
    async onRefresh () {
      const params = { limit, type: this.type }
      const members = await this.$axios.$get(`/plus-group/groups/${this.group.id}/members`, { params })
      this.list = members
      this.loader.afterRefresh(members.length < limit)
    },
    async onLoadmore () {
      const params = { limit, type: this.type, after: getLastField() }
      const members = await this.$axios.$get(`/plus-group/groups/${this.group.id}/members`, { params })
      this.list.push(...members)
      this.loader.afterLoadmore(members.length < limit)
    },
  },
}
</script>

<style lang="less" scoped>
.p-group-manage-members {

  .nav-wrap {
    a {
      color: @disabled-color;
      &.exact-active {
        color: @text-color;
      }
    }
  }

  main {
    margin-top: 30px;
    min-height: 50vh;
  }
}
</style>
