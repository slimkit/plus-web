<template>
  <div class="p-search-group">
    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <GroupList v-if="list.length" :groups="list" />

      <div v-else-if="!searchLock" v-empty:search />
    </Loadmore>
  </div>
</template>

<script>
import { limit } from '@/utils'
import GroupList from '@/components/group/GroupList.vue'

export default {
  name: 'SearchGroup',
  components: {
    GroupList,
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
      const params = { keyword: this.keyword, limit }
      this.searchLock = true
      const list = await this.$axios.$get('/plus-group/groups', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list = list
      this.loader.afterRefresh(list.length < limit)
    },
    async onLoadmore () {
      const params = { keyword: this.keyword, limit, offset: this.list.length }
      this.searchLock = true
      const list = await this.$axios.$get('/plus-group/groups', { params })
        .finally(() => {
          this.searchLock = false
        })
      this.list.push(...list)
      this.loader.afterLoadmore(list.length < limit)
    },
  },
}
</script>
