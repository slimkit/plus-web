<template>
  <div class="p-user-group">
    <nav class="cate-wrap">
      <span>TA加入的</span>
    </nav>

    <Loadmore
      ref="loader"
      @refresh="onRefresh"
    >
      <GroupList :groups="groups" />
    </Loadmore>
  </div>
</template>

<script>
import GroupList from '@/components/group/GroupList.vue'

export default {
  name: 'UserGroup',
  components: {
    GroupList,
  },
  data () {
    return {
      groups: [],
    }
  },
  methods: {
    async onRefresh () {
      const params = { type: 'join', user_id: this.$parent.user.id }
      this.groups = await this.$axios.$get('/plus-group/groups/users', { params })
      this.loader.afterRefresh(true)
    },
  },
}
</script>

<style lang="less" scoped>
.p-user-group {
  .cate-wrap {
    display: flex;
    margin-bottom: 16px;
  }
}
</style>
