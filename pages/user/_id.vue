<template>
  <div class="p-user-index">
    <header class="header">
      <figure class="cover" :style="{backgroundImage: `url(${userBackground})`}">
        <figcaption class="info-wrap">
          <Avatar
            class="avatar"
            :user="user"
            size="xl"
            :link="false"
          />
          <div class="user-info">
            <h1 class="username"> {{ user.name }} </h1>
            <p>{{ bio }}</p>
            <ul class="tags">
              <li
                v-for="tag in tags"
                :key="tag.id"
                class="tag-item"
              >
                {{ tag.name }}
              </li>
            </ul>
            <p v-if="user.verified">{{ user.verified.description }}</p>
          </div>
        </figcaption>
      </figure>
      <nav class="sub-navigation">
        <nuxt-link :to="`/user/${user.id}/feed`">主页</nuxt-link>
        <nuxt-link :to="`/user/${user.id}/group`">圈子</nuxt-link>
        <nuxt-link :to="`/user/${user.id}/question`">问答</nuxt-link>
        <nuxt-link :to="`/user/${user.id}/news`">资讯</nuxt-link>
      </nav>
    </header>

    <div class="main-wrap">
      <main class="user-container">
        <nuxt-child />
      </main>

      <div class="right-container">
        <SideWidget
          v-if="recommendUsers.length"
          key="recommend-user"
          :users="recommendUsers"
          type="user"
          title="推荐用户"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UserHome from './index.vue'

export default {
  extends: UserHome,
  data () {
    return {
      user: {},
      tags: [],
    }
  },
  async asyncData ({ route, params, store, redirect, $axios }) {
    // 如果user id 是已登录用户 重定向到个人主页
    const userId = Number(params.id)
    const { logged = {} } = store.state.user
    if (userId === logged.id) return redirect('/user')

    // 首页重定向
    if (route.name === 'user-id') return redirect(301, `/user/${userId}/feed`)

    const [user, tags] = await Promise.all([
      $axios.$get(`/users/${userId}`),
      $axios.$get(`/users/${userId}/tags`),
    ])
    return {
      user,
      tags,
    }
  },
}
</script>
