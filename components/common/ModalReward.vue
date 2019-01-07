<template>
  <!-- 注意不要使用 .c-modal-reward 选择器，因为 iview modal 内部的元素会被放置在组件外部，导致选择器失效 -->
  <div class="c-modal-reward">
    <IModal
      v-model="show"
      title="打赏"
      class-name="modal-reward"
      width="300"
      :loading="loading"
      @on-ok="beforeSubmit"
    >
      <p>选择打赏金额</p>
      <IRadioGroup
        v-model="selected"
        class="select-wrap"
        type="button"
      >
        <IRadio
          v-for="item in recommendItems"
          :key="item"
          :label="item"
        />
      </IRadioGroup>

      <IInputNumber
        ref="custom"
        v-model="custom"
        class="custom-wrap"
        :min="0"
        placeholder="自定义打赏金额，必须为整数"
      />
    </IModal>

    <IModal
      v-model="showPassword"
      title="输入密码"
      class-name="modal-reward"
      width="300"
      :footer-hide="true"
      @on-cancel="resetLoading"
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
          :loading="passwordLoading"
          @click="onSubmit"
        >
          确认
        </IButton>
      </div>
      <div class="forgot">
        <nuxt-link to="/auth/find">忘记密码?</nuxt-link>
      </div>
    </IModal>
  </div>
</template>

<script>
export default {
  name: 'ModalReward',
  data () {
    return {
      show: false,
      selected: null,
      custom: null,
      showPassword: false,
      password: '',
      passwordLoading: false,
      loading: true,
    }
  },
  computed: {
    enable () {
      const { status = false } = this.boot.site.reward || {}
      return status
    },
    needVerifyPassword () {
      return this.boot['pay-validate-user-password'] || false
    },
    recommendItems () {
      const { amounts = '' } = this.boot.site.reward || {}
      return amounts.split(',').map(item => Number(item))
    },
    amount () {
      return this.custom || this.selected
    },
  },
  watch: {
    custom () {
      this.selected = null
    },
    selected () {
      this.custom = null
    },
  },
  mounted () {
    this.selected = this.recommendItems[0] || null
  },
  methods: {
    open () {
      this.show = true
    },
    close () {
      this.show = false
      this.showPassword = false
      this.custom = null
      this.selected = null
      this.passwordLoading = false
    },
    beforeSubmit () {
      if (!this.amount) {
        this.resetLoading()
        this.$Message.error('请选择打赏金额')
        this.$refs.custom.focus()
        return
      }

      // 密码校验
      if (this.needVerifyPassword) {
        this.openPassword()
        return
      }

      this.onSubmit()
    },
    onSubmit () {
      this.passwordLoading = true
      this.$emit('reward', this.amount, this.password, (error) => {
        if (error) {
          this.$Message.error(error)
          this.openPassword()
          return
        }
        this.close()
      })
    },
    openPassword () {
      if (!this.needVerifyPassword) return
      this.password = ''
      this.passwordLoading = false
      this.showPassword = true
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    resetLoading () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
  },
}
</script>

<style lang="less">
.modal-reward {

  .select-wrap {
    display: block;
    margin-top: 8px;
  }

  .custom-wrap {
    display: block;
    margin-top: 8px;
    width: 15em;
  }

  .password-confirm-wrap {
    display: flex;

    .password-input {
      flex: auto;
      display: inline-block;

      input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
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
