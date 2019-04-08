<template>
  <div class="p-search-user">
    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <ul v-if="list.length" class="user-list">
        <li v-for="user in list" :key="user.id">
          <UserCard :user="user" />
        </li>
      </ul>

      <div v-else-if="!searchLock" v-empty:search />
    </Loadmore>
  </div>
</template>

<script>
import { limit, getLastField } from '@/utils'
import UserCard from '@/components/user/UserCard.vue'

export default {
  name: 'SearchUser',
  components: {
    UserCard,
  },
  data () {
    return {
      list: [],

      searchLock: false,
    }
  },
  computed: {
    keyword () {
      return this.$parent.keyword
    },
  },
  watch: {
    keyword () {
      this.loader.beforeRefresh()
    },
  },
  methods: {
    async onRefresh () {
      const params = { fetch_by: 'userrname', name: this.keyword, limit }
      this.searchLock = true
      const list = await this.$axios.$get('/users', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { fetch_by: 'userrname', name: this.keyword, limit, since: getLastField(this.list) }
      this.searchLock = true
      const list = await this.$axios.$get('/users', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
  },
}
</script>

<style lang="less" scoped>
.p-search-user {
  .user-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 30px
    }
}
</style>
