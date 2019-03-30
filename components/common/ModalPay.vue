<template>
  <IModal
    v-model="show"
    class="c-modal-pay"
    :title="title"
    width="400"
    :loading="loading"
    :transfer="false"
    @on-ok="beforeSubmit"
  >
    <div class="content">
      {{ content }}
    </div>
  </IModal>
</template>

<script>
import { noop } from '@/utils'

export default {
  name: 'ModalReward',
  data () {
    return {
      title: '支付积分',
      content: '',
      api: '',
      amount: 0,
      params: {},
      callback: noop,

      show: false,
      loading: true,
    }
  },
  created () {
    this.$root.$on('pay', options => {
      if (options.title) this.title = options.title
      if (options.content) this.content = options.content
      if (options.api) this.api = options.api
      if (options.amount) this.amount = options.amount
      if (options.params) this.params = options.params
      if (options.callback) this.callback = options.callback
      this.open()
    })
  },
  destoryed () {
    this.$root.$off('pay')
  },
  methods: {
    open () {
      this.show = true
    },
    close () {
      this.$root.$emit('password:close')
      this.show = false
    },
    beforeSubmit () {
      // 密码校验
      this.validatePassword()
    },
    validatePassword () {
      this.$root.$emit('password', password => {
        if (password === false) return this.resetLoading()
        this.onSubmit(password)
      })
    },
    async onSubmit (password) {
      const data = { ...this.params, password }
      const res = await this.$axios.$post(this.api, data)
      this.$Message.success('支付成功')
      this.close()
      this.callback(res, this.amount)
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

<style lang="less" scoped>
.c-modal-pay {
  .content {
    padding: 24px;
    text-align: center;
  }
}
</style>
