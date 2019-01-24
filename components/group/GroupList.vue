<template>
  <ul class="c-group-list">
    <GroupListItem
      v-for="group in groups"
      :key="group.id"
      :group="group"
    />
  </ul>
</template>

<script>
import GroupListItem from './GroupListItem.vue'

export default {
  name: 'GroupList',
  components: {
    GroupListItem,
  },
  props: {
    groups: { type: Array, default: () => [] },
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
