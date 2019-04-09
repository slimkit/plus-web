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
  </div>
</template>

<script>
import UserFollow from '../follow.vue'

export default {
  name: 'UserFollow',
  extends: UserFollow,
  head () {
    return {
      title: `${this.$parent.user.name}${this.type === 'fans' ? '的粉丝' : '关注的人'}`,
    }
  },
  computed: {
    userId () {
      return this.$route.params.id
    },
  },
}
</script>
