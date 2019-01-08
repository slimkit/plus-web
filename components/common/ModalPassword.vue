<template>
  <IModal
    v-model="show"
    class="c-modal-password"
    title="输入密码"
    width="300"
    :footer-hide="true"
    :transfer="false"
    @on-cancel="close"
  >
    <div class="password-confirm-wrap">
      <IInput
        ref="password"
        v-model="password"
        class="password-input"
        type="password"
        placeholder="请输入登录密码"
        @on-enter="onSubmit"
      />
      <IButton
        type="primary"
        class="password-button"
        :disabled="password.length < 6 || password.length > 16"
        :loading="loading"
        @click="onSubmit"
      >
        确认
      </IButton>
    </div>
    <div class="forgot">
      <nuxt-link to="/auth/find">忘记密码?</nuxt-link>
    </div>
  </IModal>
</template>

<script>
import { noop } from '@/utils'

export default {
  name: 'ModalPassword',
  data: function () {
    return {
      show: false,
      loading: false,
      password: '',
      callback: noop,
    }
  },
  computed: {
    needVerifyPassword () {
      return this.boot['pay-validate-user-password'] || false
    },
  },
  created () {
    this.$root.$on('password', callback => {
      this.callback = callback || noop
      this.open()
    })
    this.$root.$on('password:close', () => {
      this.close()
    })
  },
  destroyed () {
    this.$root.$off('password')
    this.$root.$off('password:close')
  },
  methods: {
    open () {
      if (!this.needVerifyPassword) return this.callback()
      this.loading = false
      this.show = true
      this.password = ''
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    close () {
      this.show = false
      this.callback(false)
    },
    onSubmit () {
      this.loading = true
      this.callback(this.password)
    },
  },
}
</script>

<style lang="less" scoped>
.c-modal-password {
  .password-confirm-wrap {
    display: flex;

    .password-input {
      flex: auto;
      display: inline-block;

      /deep/ .ivu-input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: none;
      }
    }

    .password-button {
      flex: none;
      display: inline-block;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  .forgot {
    margin-top: 8px;
    text-align: right;
  }
}
</style>
