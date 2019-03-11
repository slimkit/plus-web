<template>
  <div class="c-group-members">
    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <section v-if="founder" class="group">
        <h3>圈主</h3>
        <GroupMemberList key="founder" :members="[founder]" />
      </section>
      <section v-if="administrators.length" class="group">
        <h3>管理员</h3>
        <GroupMemberList
          key="administrators"
          :members="administrators"
          :menu="menuForAdmin"
        />
      </section>
      <section v-if="normals.length" class="group">
        <h3>一般成员</h3>
        <GroupMemberList
          key="normals"
          :members="normals"
          :menu="menu"
        />
      </section>
    </Loadmore>
  </div>
</template>

<script>
import _ from 'lodash'
import { limit, getLastField } from '@/utils'
import GroupMemberList from './GroupMemberList.vue'

export default {
  name: 'GroupMembers',
  components: {
    GroupMemberList,
  },
  props: {
    groupId: { type: Number, required: true },
    members: { type: Object, default: () => ({}) },
    role: { type: String, default: 'member' },
  },
  data () {
    return {
      administrators: [],
      normals: [],
    }
  },
  computed: {
    founder () {
      const founders = this.members.founder || []
      return founders[0]
    },
    menu () {
      const menu = [
        { label: '加入黑名单', method: this.addToBlackList },
        { label: '踢出圈子', mehtod: this.kickout },
      ]
      if (this.role === 'founder') {
        menu.unshift({ label: '设为管理员', method: this.addToManager })
        menu.unshift({ label: '转让圈子', method: this.transfer })
      }
      return menu
    },
    menuForAdmin () {
      if (this.role !== 'founder') return []
      return [
        { label: '撤销管理员', method: this.removeFromManager },
        { label: '转让圈子', method: this.transfer },
      ]
    },
  },
  mounted () {
    this.administrators = this.members.administrator || []
    this.normals = this.members.member || []
  },
  methods: {
    async onRefresh () {
      const params = { limit, type: 'member' }
      const normals = await this.$axios.$get(`/plus-group/groups/${this.groupId}/members`, { params })
      this.normals = normals
      this.loader.afterRefresh(normals.length < limit)
    },
    async onLoadmore () {
      const after = getLastField(this.normals)
      const params = { limit, type: 'member', after }
      const normals = await this.$axios.$get(`/plus-group/groups/${this.groupId}/members`, { params })
      this.normals = normals
      this.loader.afterRefresh(normals.length < limit)
    },
    async addToManager (member) {
      await this.$axios.$put(`/plus-group/groups/${this.groupId}/managers/${member.id}`)
      this.administrators.push(member)
      this.normals = _.filter(this.normals, m => m.id !== member.id)
      this.$Message.success('操作成功')
    },
    async removeFromManager (member) {
      await this.$axios.$delete(`/plus-group/groups/${this.groupId}/managers/${member.id}`)
      this.normals.unshift(member)
      this.administrators = _.filter(this.administrators, m => m.id !== member.id)
      this.$Message.success('操作成功')
    },
    async addToBlackList (member) {
      await this.$axios.$put(`/plus-group/groups/${this.groupId}/blacklist/${member.id}`)
      this.normals = _.filter(this.normals, m => m.id !== member.id)
      this.$Message.success('操作成功')
    },
    async kickout (member) {
      await this.$axios.$delete(`/plus-group/groups/${this.groupId}/members/${member.id}`)
      this.normals = _.filter(this.normals, m => m.id !== member.id)
      this.$Message.success('操作成功')
    },
    async transfer (member) {
      this.$modal.confirm({
        title: '提示信息',
        content: '你确定要将圈子转让给该用户吗？',
        onOk: async () => {
          await this.$axios.$patch(`/plus-group/groups/${this.groupId}/owner`, { target: member.user_id })
        },
      })
    },
  },
}
</script>
