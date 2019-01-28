<template>
  <IModal
    v-model="show"
    class="c-modal-pinned"
    :title="title"
    width="300"
    :loading="loading"
    :transfer="false"
    @on-ok="beforeSubmit"
  >
    <p class="label">选择置顶天数</p>
    <IRadioGroup
      v-model="day"
      class="select-wrap"
      type="button"
    >
      <IRadio
        v-for="item in days"
        :key="item"
        :label="item"
      >
        {{ item }}d
      </IRadio>
    </IRadioGroup>

    <template v-if="!isOwner">
      <p class="label">设置置顶金额</p>
      <IInputNumber
        ref="custom"
        v-model="custom"
        class="custom-wrap"
        :min="0"
        placeholder="自定义置顶金额，必须为整数"
      />
      <p class="label">当前平均置顶金额为积分200/天，积分余额为{{ balance }}</p>
      <p class="label">需要支付总金额：</p>
      <p class="amount">{{ amount }}</p>
    </template>
  </IModal>
</template>

<script>
import { noop } from '@/utils'

const apiMap = {
  feed: ({ feedId }) => `/feeds/${feedId}/currency-pinneds`,
  feedComment: ({ feedId, commentId }) => `/feeds/${feedId}/comments/${commentId}/currency-pinneds`,
  post: ({ postId }) => `/plus-group/currency-pinned/posts/${postId}`,
  postComment: ({ commentId }) => `/plus-group/currency-pinned/comments/${commentId}`,
}

export default {
  name: 'ModalPinned',
  data () {
    return {
      show: false,
      custom: null,
      loading: true,

      isOwner: false, // 申请置顶 or 置顶
      day: null,
    }
  },
  computed: {
    title () {
      return this.isOwner ? '置顶' : '申请置顶'
    },
    days () {
      return [1, 5, 10]
    },
    amount () {
      return this.custom * this.day
    },
    balance () {
      return (this.logged && this.logged.currency.sum) || 0
    },
    disabled () {
      return this.amount > 0
    },
  },
  created () {
    this.$root.$on('pinned', options => {
      this.type = options.type
      this.params = options.params
      this.isOwner = options.isOwner || false
      this.callback = options.callback || noop
      this.open()
    })
  },
  destroyed () {
    this.$root.$off('pinned')
  },
  mounted () {
    this.day = this.days[0] || null
  },
  methods: {
    open () {
      this.show = true
    },
    close () {
      this.$root.$emit('password:close')
      this.show = false
      this.custom = null
      this.day = this.days[0] || null
    },
    beforeSubmit () {
      if (!this.isOwner && !this.amount) {
        this.resetLoading()
        this.$Message.error('请选择置顶金额')
        this.$refs.custom.focus()
        return
      }

      this.validatePassword()
    },
    validatePassword () {
      this.$root.$emit('password', password => {
        if (password === false) return this.resetLoading()
        this.onSubmit(password)
      })
    },
    async onSubmit (password) {
      const data = {
        amount: this.amount,
        day: this.day,
        password,
      }
      const api = apiMap[this.type](this.params)
      this.$axios.$post(api, data)
        .then(() => {
          this.close()
          if (this.isOwner) {
            this.$Message.success('置顶成功')
            this.callback()
          } else {
            this.$Message.success('申请置顶成功，请等待审核')
          }
        }).catch(({ response }) => {
          const { message } = response.data || {}
          if (message === '已经申请过') { // 服务器返回消息
            this.close()
            return
          }
          this.validatePassword()
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

<style lang="less" scoped>
.c-modal-pinned {

  .label {
    margin: 8px 0;
    color: @text-info-color;
  }

  .amount {
    font-size: @font-size-base * 1.5;
    color: @primary-color;
  }

  .select-wrap {
    display: block;
  }

  .custom-wrap {
    display: block;
    margin-top: 8px;
    width: 15em;
  }
}
</style>
