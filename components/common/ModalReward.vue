<template>
  <Modal
    v-model="show"
    class="c-modal-reward"
    title="打赏"
    width="300"
    :loading="loading"
    :transfer="false"
    @on-ok="beforeSubmit"
  >
    <p>选择打赏金额</p>
    <RadioGroup
      v-model="selected"
      class="select-wrap"
      type="button"
    >
      <Radio
        v-for="item in recommendItems"
        :key="item"
        :label="item"
      />
    </RadioGroup>

    <InputNumber
      ref="custom"
      v-model="custom"
      class="custom-wrap"
      :min="0"
      placeholder="自定义打赏金额，必须为整数"
    />
  </Modal>
</template>

<script>
import { noop } from '@/utils'

const apiMap = {
  user: id => `/user/${id}/new-rewards`,
  feed: id => `/feeds/${id}/new-rewards`,
  news: id => `/news/${id}/new-rewards`,
  post: id => `/plus-group/group-posts/${id}/new-rewards`,
  answer: id => `/question-answers/${id}/new-rewards`,
}

export default {
  name: 'ModalReward',
  data () {
    return {
      show: false,
      selected: null,
      custom: null,
      loading: true,

      type: null,
      id: null,
      callback: noop,
    }
  },
  computed: {
    enable () {
      const { status = false } = this.boot.site.reward || {}
      return status
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
  created () {
    this.$root.$on('reward', options => {
      this.type = options.type
      this.id = options.id
      this.callback = options.callback || noop
      this.open()
    })
  },
  destoryed () {
    this.$root.$off('reward')
  },
  mounted () {
    this.selected = this.recommendItems[0] || null
  },
  methods: {
    open () {
      this.show = true
    },
    close () {
      this.$root.$emit('password:close')
      this.show = false
      this.custom = null
      this.selected = null
    },
    beforeSubmit () {
      if (!this.amount) {
        this.resetLoading()
        this.$Message.error('请选择打赏金额')
        this.$refs.custom.focus()
        return
      }

      // 密码校验
      this.validatePassword()
    },
    validatePassword () {
      this.$root.$emit('password', password => {
        if (password === false) return this.resetLoading()
        this.onSubmit(password)
      })
    },
    onSubmit (password) {
      const api = apiMap[this.type](this.id)
      this.$axios.$post(api, { amount: this.amount, password })
        .then(() => {
          this.close()
          this.$Message.success('打赏成功')
          this.callback(this.amount)
        })
        .catch(({ response }) => {
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
.c-modal-reward {

  .select-wrap {
    display: block;
    margin-top: 8px;
  }

  .custom-wrap {
    display: block;
    margin-top: 8px;
    width: 15em;
  }
}
</style>
