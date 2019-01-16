<template>
  <div class="p-people-index">
    <main class="people-container">
      <nav class="nav-wrap">
        <nuxt-link :to="{query: {type: 'hot'}}" :class="{'exact-active': type === 'hot'}">热门</nuxt-link>
        <nuxt-link :to="{query: {type: 'new'}}" :class="{'exact-active': type === 'new'}">最新</nuxt-link>
        <nuxt-link :to="{query: {type: 'recommend'}}" :class="{'exact-active': type === 'recommend'}">推荐</nuxt-link>
      </nav>

      <Loadmore
        ref="loader"
        @refresh="onRefresh"
        @loadmore="onLoadmore"
      >
        <ul class="user-list">
          <li v-for="userItem in list" :key="userItem.id">
            <UserCard :user="userItem" />
          </li>
        </ul>
      </Loadmore>
    </main>
    <aside class="right-container">
      <SideWidget title="热门用户">
        <ul class="hot-users">
          <li v-for="userItem in hot.slice(0, 5)" :key="userItem.id">
            <Avatar :user="userItem" />
            <div class="user-info">
              <h3><nuxt-link :to="`/user/${userItem.id}`">{{ userItem.name }}</nuxt-link></h3>
              <p class="text-cut-2">{{ userItem.bio }}</p>
            </div>
          </li>
        </ul>
      </SideWidget>
    </aside>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SideWidget from '@/components/common/SideWidget.vue'
import UserCard from '@/components/user/UserCard.vue'

export default {
  name: 'PeopleHome',
  components: {
    SideWidget,
    UserCard,
  },
  computed: {
    ...mapState('user', {
      hot: 'hot',
      new: 'new',
      recommend: 'recommend',
    }),
    type () {
      return this.$route.query.type || 'hot'
    },
    list () {
      return this[this.type]
    },
  },
  watch: {
    type () {
      this.loader.beforeRefresh()
    },
  },
  mounted () {
    if (this.type !== 'hot') this.fetchHotUsers()
  },
  methods: {
    ...mapActions('user', {
      fetchNewUsers: 'fetchNewUsers',
      fetchHotUsers: 'fetchHotUsers',
      fetchRecommendUsers: 'fetchRecommendUsers',
    }),
    async onRefresh () {
      const noMore = await this.fetchData()
      this.loader.afterRefresh(noMore)
    },
    async onLoadmore () {
      const offset = this.list.length
      const noMore = await this.fetchData(offset)
      this.loader.afterLoadmore(noMore)
    },
    async fetchData (offset) {
      switch (this.type) {
        case 'hot':
          return this.fetchHotUsers(offset)
        case 'new':
          return this.fetchNewUsers(offset)
        case 'recommend':
          return this.fetchRecommendUsers(offset)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.p-people-index {
  display: flex;

  .people-container {
    flex: auto;
    margin-right: 30px;
    padding: 20px 40px;
    background-color: #fff;

    .nav-wrap {
      height: 80px;
      margin-bottom: 30px;
      .border(bottom);
      font-size: @font-size-large;

      > a {
        display: inline-flex;
        align-items: center;
        height: 100%;
        margin-right: 24px;
      }

      .exact-active {
        border-bottom: 1px solid @primary-color;
        color: @primary-color;
      }
    }

    .user-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 30px
    }
  }

  .right-container {
    flex: none;
    width: @sidebar-width;

    .hot-users {
      margin: -16px;

      > li {
        display: flex;
        padding: 24px;
        .border(bottom);

        &:last-child {
          border-bottom: none;
        }

        .c-avatar {
          margin-right: 16px;
          width: 58px;
          height: 58px;
        }

        .user-info {
          p {
            height: 3em;
            margin-top: 8px;
            color: @disabled-color;
          }
        }
      }
    }
  }
}
</style>
