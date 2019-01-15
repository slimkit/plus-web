<template>
  <div class="p-user-index">
    <header class="header">
      <figure class="cover">
        <div class="image" :style="{backgroundImage: `url(${userBackground})`}" />
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
        <nuxt-link :to="`/user/${user.id}/feed`">TA 的主页</nuxt-link>
        <nuxt-link :to="`/user/${user.id}/group`">TA 的圈子</nuxt-link>
        <nuxt-link :to="`/user/${user.id}/news`">TA 的文章</nuxt-link>
        <nuxt-link :to="`/user/${user.id}/question`">TA 的问答</nuxt-link>

        <div class="actions">
          <button class="button" @click="onFollow">{{ followStatus }}</button>
          <button class="button"><svg class="icon"><use xlink:href="#icon-messaged" /></svg> 聊天</button>
          <IPoptip v-model="showMore" placement="bottom">
            <button class="button more"><svg class="icon lg"><use xlink:href="#icon-more" /></svg></button>

            <ul
              slot="content"
              class="options"
              @click="showMore = false"
            >
              <li @click="onReward"><svg class="icon"><use xlink:href="#icon-money" /></svg> 打赏</li>
              <li @click="onReport"><svg class="icon"><use xlink:href="#icon-report" /></svg> 举报</li>
            </ul>
          </IPoptip>
        </div>
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
import { getFollowStatus } from '@/utils'
import UserHome from './index.vue'

export default {
  extends: UserHome,
  data () {
    return {
      visitUser: {},
      tags: [],
      showMore: false,
      followLock: false,
    }
  },
  computed: {
    user () {
      return this.visitUser
    },
    followStatus () {
      return getFollowStatus(this.user.follower, this.user.following).label
    },
  },
  async asyncData ({ route, params, store, redirect, $axios }) {
    // 如果user id 是已登录用户 重定向到个人主页
    const userId = Number(params.id)
    const { logged = {} } = store.state.user
    if (userId === logged.id) return redirect('/user')

    // 首页重定向
    if (route.name === 'user-id') return redirect(301, `/user/${userId}/feed`)

    const [visitUser, tags] = await Promise.all([
      $axios.$get(`/users/${userId}`),
      $axios.$get(`/users/${userId}/tags`),
    ])
    return {
      visitUser,
      tags,
    }
  },
  methods: {
    async onFollow () {
      if (this.followLock) return
      this.followLock = true
      try {
        if (this.user.follower) {
          // 取消关注
          await this.$axios.$delete(`/user/followings/${this.user.id}`)
          this.$Message.success('取消关注')
        } else {
          // 关注
          await this.$axios.$put(`/user/followings/${this.user.id}`)
          this.$Message.success('关注成功！')
        }
        this.user.follower = !this.user.follower
      } catch (error) {}
      this.followLock = false
    },
    onReward () {
      this.$root.$emit('reward', {
        type: 'user',
        id: this.user.id,
      })
    },
    onReport () {
      this.$root.$emit('report', {
        type: 'user',
        id: this.user.id,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.p-user-index {
  .actions {
    display: inline-flex;
    align-items: center;
    margin-left: auto;

    .button {
      background-color: #fff;
      border: 1px solid @primary-color;
      color: @primary-color;
      border-radius: 40px;
      padding: 0 16px;
      font-size: @font-size-small;
      margin-left: 8px;
      height: 32px;

      &.more {
        width: 32px;
        padding: 0;
      }
    }
  }
}
</style>
