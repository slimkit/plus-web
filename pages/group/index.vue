<template>
  <div class="p-group-index">
    <main class="group-container">
      <nav class="nav-wrap">
        <nuxt-link
          v-for="item in typeMap"
          :key="item.name"
          replace
          :class="{'exact-active': type === item.name}"
          :to="item.to"
        >
          {{ item.label }}
        </nuxt-link>
      </nav>

      <nav v-if="type === 'all'" class="category-wrap">
        <nuxt-link
          v-for="cate in categories"
          :key="`cate-${cate.id}`"
          replace
          :to="{query: {type: cate.id}}"
        >
          {{ cate.name }}
        </nuxt-link>
      </nav>
      <Loadmore
        ref="loader"
        class="loader"
        @refresh="onRefresh"
        @loadmore="onLoadmore"
      >
        <GroupList :groups="groups" />
      </Loadmore>
    </main>

    <aside class="side-wrap">
      <SideWidget key="craete">
        <div class="create-wrap">
          <nuxt-link class="btn-primary" to="/group/create">
            <svg class="icon"><use xlink:href="#icon-label" /></svg>
            创建圈子
          </nuxt-link>
          <nuxt-link class="btn-primary" to="/group/post/create">
            <svg class="icon"><use xlink:href="#icon-writing" /></svg>
            发帖
          </nuxt-link>
        </div>
      </SideWidget>

      <SideWidget key="group-count" :loading="!groupCount">
        <div class="group-recommend">
          <p>共有 <big>{{ groupCount }}</big> 个兴趣圈子，等待你的加入</p>
        </div>
      </SideWidget>

      <SideWidgetGroupRecommend key="hot-groups" />
    </aside>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { limit } from '@/utils'
import GroupList from '@/components/group/GroupList.vue'
import SideWidget from '@/components/common/SideWidget.vue'
import SideWidgetGroupRecommend from '@/components/group/SideWidgetGroupRecommend.vue'

const typeMap = [
  { name: 'all', label: '全部圈子', to: { query: { type: 'all' } } },
  { name: 'nearby', label: '附近圈子', to: { query: { type: 'nearby' } } },
  { name: 'joined', label: '我加入的', to: { query: { type: 'joined' } } },
]

export default {
  name: 'GroupIndex',
  components: {
    GroupList,
    SideWidget,
    SideWidgetGroupRecommend,
  },
  data () {
    return {
      typeMap,
      cateGroups: [],
    }
  },
  computed: {
    ...mapState('group', {
      groupCount: 'count',
      categories: 'category',
      all: 'all',
      nearby: 'nearby',
      joined: 'joined',
    }),
    type () {
      const { type = 'all' } = this.$route.query
      return String(type).match(/^\d+$/) ? 'all' : type
    },
    cateId () {
      const { type } = this.$route.query
      return Number(type)
    },
    groups () {
      if (this.type !== 'all') return this[this.type]
      return this.cateId ? this.cateGroups : this.all
    },
  },
  watch: {
    type (val) {
      if (val === 'joined' && !this.checkAuth()) return
      this.cateGroups = []
      this.loader.beforeRefresh()
    },
    cateId (val) {
      this.cateGroups = []
      this.loader.beforeRefresh()
    },
  },
  mounted () {
    this.loadFromStorage()
    this.getGroupsCount()
    this.getGroupCategories()
  },
  methods: {
    ...mapMutations('group', {
      loadFromStorage: 'LOAD_FROM_STORAGE',
    }),
    ...mapActions('group', {
      getGroupsCount: 'getGroupsCount',
      getGroupCategories: 'getGroupCategories',
      getAllGroups: 'getAllGroups',
      getNearbyGroups: 'getNearbyGroups',
      getJoinedGroups: 'getJoinedGroups',
    }),
    async onRefresh () {
      let noMore = true
      if (this.type === 'all') {
        if (this.cateId) {
          noMore = await this.getGroupByCate()
        } else {
          noMore = await this.getAllGroups()
        }
      } else if (this.type === 'nearby') {
        noMore = await this.getNearbyGroups()
      } else if (this.type === 'joined') {
        noMore = await this.getJoinedGroups()
      }
      this.loader.afterRefresh(noMore)
    },
    async onLoadmore () {
      let noMore = true
      const params = { offset: this.groups.length }
      if (this.type === 'all') {
        if (this.cateId) {
          noMore = await this.getGroupByCate(params)
        } else {
          noMore = await this.getAllGroups(params)
        }
      } else if (this.type === 'nearby') {
        noMore = await this.getNearbyGroups(params)
      } else if (this.type === 'joined') {
        noMore = await this.getJoinedGroups(params)
      }
      this.loader.afterLoadmore(noMore)
    },
    async getGroupByCate (params = {}) {
      const groups = await this.$axios.$get(`/plus-group/categories/${this.cateId}/groups`, { params })
      if (!params.offset) {
        this.cateGroups = groups
      } else {
        this.cateGroups.push(...groups)
      }
      return groups.length < limit
    },
  },
}
</script>

<style lang="less" scoped>
.p-group-index{
  display: flex;

  .group-container {
    flex: auto;
    margin-right: 30px;
    background-color: #fff;
    padding: 30px;

    .nav-wrap {
      display: flex;
      align-items: center;
      height: 40px;
      color: @disabled-color;
      .border(bottom);

      > a {
        margin-right: 2em;

        &.exact-active {
          color: @text-color;
        }
      }

    }

    .category-wrap {
      display: flex;
      margin: 16px 0 32px;

      > a {
        display: inline-block;
        padding: 6px 12px;
        margin-right: 8px;
        border-radius: 50px;
        background-color: @background-color-base;

        &.exact-active {
          background-color: @primary-color;
          color: #fff;
        }
      }
    }

    .loader {
      margin-top: 30px;
    }

  }

  .side-wrap {
    flex: none;
    width: @sidebar-width;

    .create-wrap {
      display: flex;
      flex-direction: column;
      padding: 16px;

      .btn-primary {
        padding: 12px;
        border-radius: 50px;
        background-color: @primary-color;
        color: #fff;
        margin-bottom: 16px;
        text-align: center;

        &:last-child{
          margin-bottom: 0;
        }
      }
    }

    .group-recommend {
      padding: 16px;

      p {
        margin: 12px 0;

        big {
          color: @warning-color;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
