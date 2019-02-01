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
        <GroupMemberList key="administrators" :members="administrators" />
      </section>
      <section v-if="normals.length" class="group">
        <h3>一般成员</h3>
        <GroupMemberList key="normals" :members="normals" />
      </section>
    </Loadmore>
  </div>
</template>

<script>
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
  },
  data () {
    return {
      normals: [],
    }
  },
  computed: {
    founder () {
      const founders = this.members.founder || []
      return founders[0]
    },
    administrators () {
      return this.members.administrator || []
    },
  },
  mounted () {
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
  },
}
</script>

<style lang="less" scoped>
.c-group-members {
}
</style>
