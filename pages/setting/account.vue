<template>
  <!-- eslint-disable vue/max-attributes-per-line -->
  <div class="p-setting-account">
    <nav class="nav-wrap">
      <span>账号管理</span>
    </nav>

    <main class="account-container">
      <ISpin v-if="loading" fix />

      <ul class="list">
        <li>
          <span class="label">绑定手机</span>
          <IButton v-if="!isBindPhone" type="primary" title="点击绑定" @click="bindAccount('phone')">去绑定</IButton>
          <IButton v-else class="disabled" title="点击解除绑定" @click="unbindAccount('phone')">已绑定</IButton>
        </li>
        <li>
          <span class="label">绑定邮箱</span>
          <IButton v-if="!isBindEmail" type="primary" title="点击绑定" @click="bindAccount('email')">去绑定</IButton>
          <IButton v-else class="disabled" title="点击解除绑定" @click="unbindAccount('email')">已绑定</IButton>
        </li>
        <li>
          <span class="label">绑定 QQ</span>
          <IButton v-if="!isBindQQ" type="primary" title="点击绑定" @click="bindSocial('qq')">去绑定</IButton>
          <IButton v-else class="disabled" title="点击解除绑定" @click="unbindSocial('qq')">已绑定</IButton>
        </li>
        <li>
          <span class="label">绑定微信</span>
          <IButton v-if="!isBindWechat" type="primary" title="点击绑定" @click="bindSocial('wechat')">去绑定</IButton>
          <IButton v-else class="disabled" title="点击解除绑定" @click="unbindSocial('wechat')">已绑定</IButton>
        </li>
        <li>
          <span class="label">绑定微博</span>
          <IButton v-if="!isBindWeibo" type="primary" title="点击绑定" @click="bindSocial('weibo')">去绑定</IButton>
          <IButton v-else class="disabled" title="点击解除绑定" @click="unbindSocial('weibo')">已绑定</IButton>
        </li>
      </ul>

      <IModal
        v-model="showModal"
        :title="isBind ? '绑定账号' : '解绑账号'"
        :transfer="false"
        :mask-closable="false"
        :footer-hide="true"
        @on-ok="onSubmitBind"
      >
        <IForm v-if="showModal" ref="form" label-position="top" :model="formModel" :rules="formRules">
          <IFormItem :label="bindType === 'phone' ? '手机号' : '邮箱'" :prop="bindType">
            <IInput
              v-model="account"
              :type="bindType === 'phone' ? 'tel' : 'text'"
              :maxlength="bindType === 'phone' ? 11 : 60"
              :disabled="!isBind"
              @on-enter="sendCode"
            >
              <template v-slot:append>
                <IButton
                  type="primary"
                  :disabled="!!countdown"
                  :loading="sendLock"
                  @click="sendCode"
                >
                  {{ countdown ? `${countdown}s 后重试` : '获取验证码' }}
                </IButton>
              </template>
            </IInput>
          </IFormItem>
          <IFormItem label="验证码" prop="code">
            <IInput
              ref="code"
              v-model="code"
              type="text"
              :maxlength="6"
              class="code-input"
              @on-enter="isBind ? onSubmitBind() : $refs.password.focus()"
            />
          </IFormItem>
          <IFormItem v-if="!isBind" label="登录密码" prop="password">
            <IInput
              ref="password"
              v-model="password"
              type="password"
              :maxlength="16"
              class="code-input"
              @on-enter="onSubmitBind"
            />
          </IFormItem>

          <IButton type="primary" :loading="submitLock" :disabled="!account || !code" @click="onSubmitBind">提交</IButton>
        </IForm>
      </IModal>
    </main>
  </div>
</template>

<script>
export default {
  name: 'SettingAccount',
  head () {
    return {
      title: '账号管理',
    }
  },
  data () {
    return {
      isBind: true,
      bindType: 'phone',
      account: '',
      code: '',
      password: '',

      isBindQQ: false,
      isBindWechat: false,
      isBindWeibo: false,

      loading: true,
      showModal: false,
      sendLock: false,
      countdown: 0,
      submitLock: false,
    }
  },
  computed: {
    isBindPhone () {
      return !!(this.logged || {}).phone
    },
    isBindEmail () {
      return !!(this.logged || {}).email
    },

    formModel () {
      return {
        code: this.code,
        [this.bindType]: this.account,
        password: this.password,
      }
    },
    formRules () {
      const validator = {
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { type: 'string', min: 4, max: 66, message: '验证码要求在 4 ~ 6 位之间', trigger: 'blur' },
        ],
      }
      if (this.bindType === 'phone') {
        validator.phone = [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { type: 'regexp', pattern: /^1[345789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
        ]
      }
      if (this.bindType === 'email') {
        validator.email = [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
        ]
      }
      if (!this.isBind) {
        validator.password = [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { type: 'string', min: 6, max: 16, message: '登录密码要求在 6 ~ 16 位之间', trigger: 'blur' },
        ]
      }
      return validator
    },
  },
  mounted () {
    this.fetchSocialStatus()
  },
  methods: {
    async fetchSocialStatus () {
      const list = await this.$axios.$get('/user/socialite')
      this.loading = false
      this.isBindQQ = list.includes('qq')
      this.isBindWeibo = list.includes('weibo')
      this.isBindWechat = list.includes('wechat')
    },
    bindAccount (type) {
      this.isBind = true
      this.bindType = type
      this.showModal = true
    },
    unbindAccount (type) {
      if (type === 'phone') {
        if (!this.isBindEmail) return this.$Message.error('解除绑定手机之前必须先绑定邮箱')
      } else if (type === 'email') {
        if (!this.isBindPhone) return this.$Message.error('解除绑定邮箱之前必须先绑定手机')
      }
      this.isBind = false
      this.bindType = type
      this.showModal = true
      this.account = this.logged[type]
    },
    async sendCode () {
      await new Promise((resolve, reject) => {
        this.$refs.form.validateField(this.bindType, valid => !valid ? resolve() : reject())
      })
      const form = {
        [this.bindType]: this.account,
      }
      const url = this.isBind ? '/verifycodes/register' : '/verifycodes'
      this.sendLock = true
      try {
        await this.$axios.$post(url, form)
        this.$refs.code.focus()
        this.countdown = 60
        let timer = setInterval(() => {
          this.countdown--
          if (this.countdown <= 0) {
            clearInterval(timer)
            timer = null
          }
        }, 1000)
      } catch (error) {}
      this.sendLock = false
    },
    async onSubmitBind () {
      await new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => valid ? resolve() : reject())
      })
      const form = {
        verifiable_code: this.code,
        [this.bindType]: this.account,
      }
      this.submitLock = true
      try {
        if (this.isBind) {
          await this.$axios.$put('/user', form)
          this.logged[this.bindType] = this.account
          this.$Message.success('绑定成功')
        } else {
          const params = {
            password: this.password,
            verifiable_code: this.code,
          }
          await this.$axios.$delete(`/user/${this.bindType}`, { params })
          this.logged[this.bindType] = null
          this.$Message.success('解绑成功')
        }
        this.showModal = false
      } catch (error) {}
      this.submitLock = false
    },

    bindSocial (type) {
      this.$Message.error('接口未实现')
    },
    unbindSocial (type) {
      this.$Message.error('接口未实现')
    },
  },
}
</script>

<style lang="less" scoped>
.p-setting-account {
  .account-container {
    position: relative;
    width: 100%;
    max-width: 320px;
  }

  .list {
    display: flex;
    flex-direction: column;
    margin-top: 24px;

    > li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .disabled {
        cursor: pointer;
      }
    }
  }

  /deep/ .code-input {
    width: 16em;
  }
}
</style>
