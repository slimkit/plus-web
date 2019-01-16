<template>
  <div class="c-user-card">
    <Avatar :user="user" />
    <div class="user-info">
      <h3 class="username">
        <nuxt-link :to="`/user/${user.id}`">{{ user.name }}</nuxt-link>
        <button
          class="ts-btn sm"
          :class="{disabled: user.follower}"
          @click="onFollow"
        >
          {{ followStatus }}
        </button>
      </h3>
      <p class="text-cut-2">{{ user.bio | placeholder('bio') }}</p>
      <div class="follow-info">
        <nuxt-link :to="`/user/${user.id}/fans`">粉丝 <span class="primary">{{ user.extra.followers_count }}</span></nuxt-link>
        <nuxt-link :to="`/user/${user.id}/following`">关注 <span class="primary">{{ user.extra.followings_count }}</span></nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getFollowStatus } from '@/utils'

export default {
  name: 'UserCard',
  props: {
    user: { type: Object, required: true },
  },
  data () {
    return {
      followLock: false,
    }
  },
  computed: {
    followStatus () {
      return getFollowStatus(this.user.follower, this.user.following).label
    },
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
  },
}
</script>

<style lang="less" scoped>
.c-user-card {
  display: flex;
  padding: 30px 20px;
  .border();
  transition: border-color .2s;

  &:hover {
    border-color: @primary-color;
  }

  .c-avatar {
    flex: none;
    margin-right: 20px;
  }

  .user-info {
    flex: auto;

    .username {
      display: flex;
      justify-content: space-between;
      font-weight: normal;
    }

    > p {
      height: 3em;
      margin: 16px 0;
      color: @disabled-color;
      font-size: @font-size-small;
    }
  }

  .follow-info {
    > a {
      margin-left: 12px;
      padding-left: 12px;
      .border(left);

      &:first-child {
        margin-left: 0;
        padding-left: 0;
        border-left: 0;
      }

      > span {
        color: @primary-color;
      }
    }
  }
}
</style>
