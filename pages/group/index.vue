<template>
  <div class="p-group-index">
    <main class="group-container">
      <nav class="nav-wrap">
        <nuxt-link :class="{active: type === 'all'}" :to="{query: {type: 'all'}}">全部圈子</nuxt-link>
        <nuxt-link :class="{active: type === 'nearby'}" :to="{query: {type: 'nearby'}}">附近圈子</nuxt-link>
        <nuxt-link
          v-if="logged"
          :class="{active: type === 'joined'}"
          :to="{query: {type: 'joined'}}"
        >
          我加入的
        </nuxt-link>
      </nav>

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
import SideWidget from '@/components/common/SideWidget.vue'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'GroupIndex',
  components: {
    SideWidget,
  },
  data () {
    return {
      groups: [],
    }
  },
  computed: {
    ...mapState('group', {
      groupCount: 'count',
      categories: 'category',
      recommend: 'recommend',
    }),
    type () {
      return this.$route.query.type || 'all'
    },
  },
  beforeMount () {
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
    }),
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
