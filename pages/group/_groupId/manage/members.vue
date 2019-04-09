<template>
  <div class="p-group-manage-members">
    <nav class="nav-wrap">
      <nuxt-link
        replace
        :to="{query: {type: 'all'}}"
        :class="{'exact-active': type === 'all'}"
      >
        全部成员
      </nuxt-link>
      <nuxt-link
        replace
        :to="{query: {type: 'audit'}}"
        :class="{'exact-active': type === 'audit'}"
      >
        待审核
      </nuxt-link>
      <nuxt-link
        replace
        :to="{query: {type: 'blacklist'}}"
        :class="{'exact-active': type === 'blacklist'}"
      >
        黑名单
      </nuxt-link>
    </nav>

    <main>
      <div v-if="type === 'all'">
        <GroupMembers
          :group-id="group.id"
          :members="initMembers"
          :menu="manageMenu"
          :role="role"
        />
      </div>
      <div v-show="type !== 'all'">
        <div v-show="!loading && !list.length" v-empty:content />
        <Loadmore
          ref="loader"
          :auto-load="false"
          :show-bottom="list.length"
          @refresh="onRefresh"
          @loadmore="onLoadmore"
        >
          <GroupMemberList :members="list" :menu="manageMenu" />
        </Loadmore>
      </div>
    </main>
  </div>
</template>

<script>
import _ from 'lodash'
import { limit, getLastField } from '@/utils'
import GroupMembers from '@/components/group/GroupMembers.vue'
import GroupMemberList from '@/components/group/GroupMemberList.vue'

const typeMap = {
  audit: 'auditMembers',
  blacklist: 'blackMembers',
}

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

      loading: false,
      manageMap: {
        all: [
          { label: '加入黑名单', method: this.addToBlackList },
        ],
        audit: [
          { label: '通过', method: member => this.auditJoinGroup(member, 1) },
          { label: '驳回', method: member => this.auditJoinGroup(member, 2) },
        ],
        blacklist: [
          { label: '移出黑名单', method: this.removeFromBlackList },
        ],
      },
    }
  },
  computed: {
    group () {
      return this.$parent.group
    },
    role () {
      const joined = this.group.joined || {}
      return joined.role || 'member'
    },
    type () {
      const { type } = this.$route.query
      return type || 'all'
    },
    list: {
      get () {
        return this.$data[typeMap[this.type]] || []
      },
      set (val) {
        this.$data[typeMap[this.type]] = val
      },
    },
    manageMenu () {
      return this.manageMap[this.type]
    },
  },
  watch: {
    type (val) {
      if (val !== 'all') this.loader.beforeRefresh()
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
      this.loading = true
      const params = { limit, type: this.type }
      const members = await this.$axios.$get(`/plus-group/groups/${this.group.id}/members`, { params })
      this.list = members
      this.loader.afterRefresh(members.length < limit)
      this.loading = false
    },
    async onLoadmore () {
      const params = { limit, type: this.type, after: getLastField() }
      const members = await this.$axios.$get(`/plus-group/groups/${this.group.id}/members`, { params })
      this.list.push(...members)
      this.loader.afterLoadmore(members.length < limit)
    },
    async removeFromBlackList (member) {
      await this.$axios.$delete(`/plus-group/groups/${this.group.id}/blacklist/${member.id}`)
      this.blackMembers = _.filter(this.blackMembers, m => m.id !== member.id)
      this.$Message.success('操作成功')
    },
    async auditJoinGroup (member, status) {
      await this.$axios.$patch(`/plus-group/currency-groups/${this.group.id}/members/${member.id}/audit`, { status })
      this.auditMembers = _.filter(this.auditMembers, m => m.id !== member.id)
      this.$Message.success('操作成功')
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
