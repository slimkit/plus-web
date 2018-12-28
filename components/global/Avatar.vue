<template>
  <div class="c-avatar" :class="size">
    <div v-if="anonymity" class="anonymity">匿</div>
    <template v-else>
      <nuxt-link
        v-if="link"
        :to="`/user/${user.id}`"
        class="user-avatar"
        :class="sex"
        :style="avatarStyle"
      />
      <span
        v-else
        class="user-avatar"
        :class="sex"
        :style="avatarStyle"
      />
      <i class="verify" :style="verify" />
    </template>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    user: { type: Object, default: () => {} },
    size: { type: String, default: 'def', validator: val => ['def', 'sm', 'lg', 'xl'].includes(val) },
    anonymity: { type: Boolean, default: false },
    link: { type: Boolean, default: true },
  },
  computed: {
    src: {
      get () {
        const avatar = this.user.avatar || {}
        return avatar.url || null
      },
      set (val) {
        this.user.avatar.url = val
      },
    },
    avatarStyle () {
      const src = this.src
      return {
        backgroundImage: src ? `url(${src})` : null,
      }
    },
    verify () {
      const { verified = null } = this.user
      if (!verified) return {}
      if (verified.icon) return { backgroundImage: `url(${verified.icon})` }
      else if (verified.type) return { backgroundImage: `url(${require('@/assets/images/vip_icon.svg')})` }
      return {}
    },
    sex () {
      const sexMap = ['secret', 'man', 'woman']
      const sex = Number(this.user.sex)
      return sexMap[sex]
    },
  },
}
</script>

<style lang="less" scoped>
.c-avatar {
  position: relative;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  .user-avatar,
  .anonymity {
    overflow: hidden;
    border-radius: 50%;
    background: @avatar-bg center / cover no-repeat;
  }

  &.def {
    width: 50px;
    height: 50px;
    font-size: 26px;
  }

  .user-avatar {
    display: block;
    width: 100%;
    height: 100%;

    &.secret {
      background-image: url(~assets/images/pic_default_secret.png);
    }
    &.man {
      background-image: url(~assets/images/pic_default_man.png);
    }
    &.woman {
      background-image: url(~assets/images/pic_default_woman.png);
    }
  }

  .verify {
    position: absolute;
    bottom: 0;
    right: 0;
    display: block;
    width: 18px;
    height: 18px;
    background: transparent center / cover no-repeat;
  }
}
</style>
