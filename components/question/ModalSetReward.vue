<template>
  <Modal
    v-model="show"
    class="c-question-modal-set-reward"
    title="公开悬赏"
    width="300"
    :loading="loading"
    :transfer="false"
    @on-ok="beforeSubmit"
  >
    <p>选择公开悬赏金额</p>
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
      placeholder="自定义金额，必须为整数"
    />
  </Modal>
</template>

<script>
export default {
  name: 'QuestionModalSetReward',
  props: {
    questionId: { type: Number, required: true },
  },
  data () {
    return {
      show: false,
      selected: null,
      custom: null,
      loading: true,
    }
  },
  computed: {
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
      this.$root.$emit('password:close')
      this.show = false
      this.custom = null
      this.selected = null
    },
    beforeSubmit () {
      if (!this.amount) {
        this.resetLoading()
        this.$Message.error('请选择金额')
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
      this.$axios.$patch(`/currency-questions/${this.questionId}/amount`, { amount: this.amount, password })
        .then(() => {
          this.$emit('success', this.amount)
          this.close()
          this.$Message.success('设置问题悬赏成功')
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
.c-question-modal-set-reward {}
</style>
