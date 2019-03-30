<template>
  <div class="c-avatar" :class="[size, {square}]">
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
      <i
        class="verify"
        :style="verify"
        :class="verifyType"
      />
    </template>
  </div>
</template>

<script>

// 暂时统一设置为 150 以高效利用缓存
const sizeMap = {
  xs: 150,
  sm: 150,
  def: 150,
  lg: 150,
  xl: 150,
}

export default {
  name: 'Avatar',
  props: {
    user: { type: Object, default: () => {} },
    size: { type: String, default: 'def', validator: val => ['def', 'sm', 'lg', 'xl', 'xs'].includes(val) },
    anonymity: { type: [Boolean, Number], default: false },
    link: { type: Boolean, default: true },
    square: { type: Boolean, default: false },
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
      let src = this.src
      if (!src) return null
      const size = sizeMap[this.size]
      src += `?role=w_${size},h_${size}`
      return {
        backgroundImage: `url("${src}")`,
      }
    },
    verify () {
      const { verified = null } = this.user
      if (!verified) return false
      if (verified.icon) return { backgroundImage: `url(${verified.icon})` }
      if (verified.type) return {}
      return false
    },
    verifyType () {
      if (!this.verify) return
      return this.user.verified.type
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
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    overflow: hidden;
    border-radius: 100px;
    background: @avatar-bg center / cover no-repeat;
  }

  &.square {
    .user-avatar {
      border-radius: 0;
    }
  }

  .verify {
    position: absolute;
    bottom: -1px;
    right: -1px;
    display: block;
    background: transparent center / cover no-repeat;

    &.user {
      background-image: url(~assets/images/cert_user.png);
    }
    &.org {
      background-image: url(~assets/images/cert_org.png);
    }
  }

  &.def {
    width: @avatar-size-base;
    height: @avatar-size-base;
    font-size: @avatar-font-size-base;
    .verify {
      width: @avatar-size-base / 2.5;
      height: @avatar-size-base / 2.5;
    }
  }

  &.sm {
    width: @avatar-size-sm;
    height: @avatar-size-sm;
    font-size: @avatar-font-size-sm;
    .verify {
      width: @avatar-size-sm / 2.3;
      height: @avatar-size-sm / 2.3;
    }
  }

  &.xs {
    width: @avatar-size-sm / 1.4;
    height: @avatar-size-sm / 1.4;
    font-size: @avatar-font-size-sm / 1.4;
    .verify {
      width: @avatar-size-sm / 3;
      height: @avatar-size-sm / 3;
    }
  }

  &.lg {
    width: @avatar-size-lg;
    height: @avatar-size-lg;
    font-size: @avatar-font-size-lg;
    .verify {
      width: @avatar-size-lg / 2.5;
      height: @avatar-size-lg / 2.5;
    }
  }

  &.xl {
    width: @avatar-size-lg * 1.3;
    height: @avatar-size-lg * 1.3;
    font-size: @avatar-font-size-lg * 1.3;
    .verify {
      width: @avatar-size-lg / 2.4;
      height: @avatar-size-lg / 2.4;
    }
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

}
</style>
