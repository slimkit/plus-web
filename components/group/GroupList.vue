<template>
  <ul class="c-group-list">
    <GroupListItem
      v-for="group in groups"
      :key="group.id"
      :group="group"
      @update="onUpdate"
    />
  </ul>
</template>

<script>
import _ from 'lodash'
import GroupListItem from './GroupListItem.vue'

export default {
  name: 'GroupList',
  components: {
    GroupListItem,
  },
  props: {
    groups: { type: Array, default: () => [] },
  },
  methods: {
    async onUpdate (groupId) {
      const group = await this.$axios.$get(`/plus-group/groups/${groupId}`)
      const index = _.indexOf(this.groups, _.find(this.groups, { id: groupId }))
      this.groups.splice(index, 1, group)
      this.$emit('update:groups', this.groups)
    },
  },
}
</script>

<style lang="less" scoped>
.c-group-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
}
</style>
