<template>
  <div class="p-auth-register">
    <main class="container">
      <nav class="type-nav">
        <nuxt-link :to="{query: {type: 'phone'}}" :class="{'exact-active': type === 'phone'}">手机注册</nuxt-link>
        <nuxt-link :to="{query: {type: 'email'}}" :class="{'exact-active': type === 'email'}">邮箱注册</nuxt-link>
      </nav>

      <Form
        ref="form"
        class="form"
        :label-width="80"
        label-position="left"
        :model="validateForm"
        :rules="validator"
        @submit.native.prevent="onSubmit"
      >
        <FormItem
          v-if="type === 'phone'"
          prop="phone"
          label="手机号"
        >
          <Input
            v-model="phone"
            placeholder="输入11位手机号码"
            :maxlength="11"
          />
        </FormItem>

        <FormItem
          v-else
          prop="email"
          label="邮箱"
        >
          <Input
            v-model="email"
            placeholder="输入邮箱地址"
            type="email"
            :maxlength="80"
          />
        </FormItem>

        <FormItem prop="code" label="验证码">
          <Input
            v-model="code"
            :placeholder="type === 'phone' ? '输入手机验证码' : '输入邮箱验证码'"
            :maxlength="6"
          >
            <Button
              slot="append"
              type="primary"
              :disabled="codeLimit > 0"
              :loading="codeLock"
              @click="getCode"
            >
              {{ codeLimit ? `${codeLimit}s 后重试` : '获取验证码' }}
            </Button>
          </Input>
        </FormItem>

        <FormItem prop="username" label="设置昵称">
          <Input
            v-model="username"
            placeholder="2-8个字符"
            :maxlength="8"
          />
        </FormItem>

        <FormItem prop="password" label="设置密码">
          <Input
            v-model="password"
            placeholder="6-15个字符，区分大小写"
            type="password"
            :maxlength="15"
          />
        </FormItem>

        <FormItem prop="confirmPassword" label="确认密码">
          <Input
            v-model="confirmPassword"
            placeholder="再次输入密码"
            type="password"
            :maxlength="15"
          />
        </FormItem>

        <Button
          type="primary"
          html-type="submit"
          :loading="submitLock"
        >
          注册
        </Button>
      </Form>
    </main>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'AuthRegister',
  middleware: ['forGuest'],
  head () {
    return {
      title: `注册`,
    }
  },
  data () {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      phone: '',
      email: '',
      code: '',

      codeLimit: 0,
      codeLock: false,
      submitLock: false,
      validator: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { type: 'string', pattern: /^1[345789]\d{9}$/, message: '请输入合理的11位手机号', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { type: 'string', min: 4, max: 6, message: '验证码格式错误', trigger: 'blur' },
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { type: 'string', min: 2, max: 8, message: '用户名长度要求2-8位', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, max: 15, message: '密码长度为6-15位', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { type: 'string', min: 6, max: 15, message: '密码长度为6-15位', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    type () {
      return this.$route.query.type || 'phone'
    },
    validateForm () {
      return _.pick(this.$data, Object.keys(this.validator))
    },
    form () {
      const form = {
        name: this.username,
        password: this.password,
        verifiable_type: this.type === 'phone' ? 'sms' : 'mail',
        verifiable_code: this.code,
      }
      if (this.type === 'phone') {
        form.phone = this.phone
      } else {
        form.email = this.email
      }
      return form
    },
  },
  methods: {
    async getCode () {
      this.$refs.form.validateField(this.type, async error => {
        if (error) return
        this.codeLock = true
        const param = this.type === 'phone' ? { phone: this.phone } : { email: this.email }
        await this.$axios.$post('/verifycodes/register', param)
          .finally(() => {
            this.codeLock = false
          })
        this.setCodeLimit()
      })
    },
    setCodeLimit () {
      this.codeLimit = 60
      let timer = setInterval(() => {
        this.codeLimit--
        if (this.codeLimit <= 0) clearInterval(timer)
      }, 1000)
    },
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (!valid) return reject('[validate] 字段校验失败!')
          resolve()
        })
      })
    },
    async onSubmit () {
      await this.validate()
      this.submitLock = true
      const { token } = await this.$axios.$post('/users', this.form)
        .finally(() => {
          this.submitLock = false
        })
      this.$store.commit('auth/SAVE_TOKEN', token)
      this.$Message.success('注册成功, 正在跳转...')
      await this.$store.dispatch('user/getCurrentUser')
      const { redirect } = this.$route.query
      if (redirect) this.$router.replace(decodeURIComponent(redirect))
      else this.$router.back()
    },
  },
}
</script>

<style lang="less" scoped>
.p-auth-register {
  .container {
    margin-top: 40px;
    padding: 60px;
    background-color: #fff;
  }

  .type-nav {
    display: flex;
    height: 60px;
    .border(bottom);
    font-size: @font-size-large;

    > a {
      display: inline-flex;
      align-items: center;
      height: 100%;
      margin-right: 1em;
      color: @disabled-color;
      border-bottom: 1px solid transparent;
      transform: translateY(1px);

      &.exact-active {
        border-bottom-color: @primary-color;
      }

      &.exact-active,
      &:hover {
        color: @text-color;
      }
    }
  }

  .form {
    width: 640px;
    margin-top: 60px;
  }
}
</style>
