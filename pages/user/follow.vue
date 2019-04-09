<template>
  <div class="p-user-follow">
    <main class="follow-container">
      <nav class="nav-wrap">
        <nuxt-link
          replace
          :to="{query: {type: 'fans'}}"
          :class="{'exact-active': type === 'fans'}"
        >
          粉丝
        </nuxt-link>
        <nuxt-link
          replace
          :to="{query: {type: 'following'}}"
          :class="{'exact-active': type === 'following'}"
        >
          关注
        </nuxt-link>
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
    <div class="right-container">
      <SideWidget title="热门用户">
        <ul class="hot-users">
          <li v-for="userItem in hotUsers.slice(0, 5)" :key="userItem.id">
            <Avatar :user="userItem" />
            <div class="user-info">
              <h3><nuxt-link :to="`/user/${userItem.id}`">{{ userItem.name }}</nuxt-link></h3>
              <p class="text-cut-2">{{ userItem.bio }}</p>
            </div>
          </li>
        </ul>
      </SideWidget>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { limit } from '@/utils'
import SideWidget from '@/components/common/SideWidget.vue'
import UserCard from '@/components/user/UserCard.vue'

export default {
  name: 'UserFollow',
  components: {
    SideWidget,
    UserCard,
  },
  data: function () {
    return {
      fans: [],
      following: [],
    }
  },
  computed: {
    ...mapState('user', {
      hotUsers: 'hot',
    }),
    type () {
      return this.$route.query.type || 'fans'
    },
    list () {
      return this.$data[this.type] || []
    },
    userId () {
      return this.logged.id
    },
  },
  watch: {
    type () {
      this.loader.beforeRefresh()
    },
  },
  mounted () {
    this.fetchHotUsers()
  },
  methods: {
    ...mapActions('user', {
      fetchHotUsers: 'fetchHotUsers',
    }),
    async onRefresh () {
      const params = { limit }
      const users = await this.fetchData(params)
      this.$data[this.type] = users
      this.loader.afterRefresh(users.length < limit)
    },
    async onLoadmore () {
      const offset = this.$data[this.type].length
      const params = { limit, offset }
      const users = await this.fetchData(params)
      this.$data[this.type].push(...users)
      this.loader.afterLoadmore(users.length < limit)
    },
    async fetchData (params) {
      if (this.type === 'fans') {
        return this.$axios.$get(`/users/${this.userId}/followers`, { params })
      } else {
        return this.$axios.$get(`/users/${this.userId}/followings`, { params })
      }
    },
  },
}
</script>

<style lang="less">
.p-user-follow {
  display: flex;

  .follow-container {
    flex: auto;
    background-color: #fff;
    padding: 20px 40px;
    margin-right: 30px;

    .nav-wrap {
      height: 80px;
      margin-bottom: -1px;
      .border(bottom);
      font-size: @font-size-large;

      > a {
        display: inline-flex;
        align-items: center;
        height: 100%;
        margin-right: 24px;
        border-bottom: 1px solid transparent;
      }

      .exact-active {
        border-color: @primary-color;
        color: @primary-color;
      }
    }

    .user-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 30px;
      margin-top: 30px;
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
