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
          :key="cate.id"
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
      <SideWidget>
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

      <SideWidget>
        <div class="group-recommend">
          <p>共有 <big>{{ groupCount }}</big> 个兴趣圈子，等待你的加入</p>
        </div>

        <ISpin v-if="!groupCount" fix />
      </SideWidget>

      <SideWidget title="热门圈子">
        <ul class="hot-list">
          <li
            v-for="(group, index) in recommend"
            :key="group.id"
            :class="{top3: index < 3}"
          >
            <h2>{{ group.name }}</h2>
            <p>帖子 5 成员 3</p>
          </li>
        </ul>

        <ISpin v-if="!recommend.length" fix />
      </SideWidget>
    </aside>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { limit } from '@/utils'
import GroupList from '@/components/group/GroupList.vue'
import SideWidget from '@/components/common/SideWidget.vue'

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
      recommend: 'recommend',
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
      return this.cateGroups
    },
  },
  watch: {
    type (val) {
      this.cateGroups = []
      this.loader.beforeRefresh()
    },
    cateId (val) {
      this.cateGroups = []
      this.loader.beforeRefresh()
    },
  },
  created () {
    this.loadFromStorage()
    this.getGroupCount()
    this.getGroupCategories()
    this.getRecommendGroups({ limit: 5 })
  },
  methods: {
    ...mapMutations('group', {
      loadFromStorage: 'LOAD_FROM_STORAGE',
    }),
    ...mapActions('group', {
      getGroupCount: 'getGroupCount',
      getGroupCategories: 'getGroupCategories',
      getRecommendGroups: 'getRecommendGroups',
      getAllGroups: 'getAllGroups',
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
        // TODO: 获取附近圈子
      } else if (this.type === 'joined') {
        // TODO: 获取我加入的圈子
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
        // TODO: 获取附近圈子
      } else if (this.type === 'joined') {
        // TODO: 获取我加入的圈子
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

    .hot-list {
      counter-reset: hot;

      li {
        position: relative;
        margin: 16px 0;
        margin-left: 32px;

        &::before {
          counter-increment: hot;
          content: counter(hot);
          position: absolute;
          top: 50%;
          left: -26px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          margin-top: -8px;
          border-radius: @border-radius-small;
          background-color: @text-info-color;
          font-size: 80%;
          color: #fff;
        }

        &.top3::before {
          background-color: @primary-color;
        }

        h2 {
          bottom: 12px;
          font-size: @font-size-base;
          font-weight: normal;
        }

        p {
          color: @text-info-color;
          font-size: @font-size-small;
        }
      }
    }
  }
}
</style>
