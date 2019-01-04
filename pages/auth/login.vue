<template>
  <div class="p-auth-login">
    <IForm
      ref="form"
      class="form"
      :model="form"
      :rules="validator"
    >
      <IFormItem prop="account">
        <IInput
          v-model="form.account"
          type="text"
          placeholder="输入手机号/邮箱/昵称"
          autocomplete="on"
        />
      </IFormItem>
      <IFormItem prop="password">
        <IInput
          v-model="form.password"
          type="password"
          placeholder="输入密码"
          :maxlength="16"
          @on-enter="onSubmit"
        />
      </IFormItem>
      <div class="others">
        <span class="use-code" title="验证码登录">验证码登录</span>
        <nuxt-link to="/auth/find">忘记密码</nuxt-link>
      </div>
      <IButton
        size="large"
        type="primary"
        @click="onSubmit"
      >
        登录
      </IButton>
      <div class="footage">
        <span>没有账号？<nuxt-link class="active" to="/auth/register">注册</nuxt-link></span>
        <span class="right">三方登录：</span>
        <svg class="icon socialite-button" :style="{color: '#f97d72'}"><use xlink:href="#icon-weibo" /></svg>
        <svg class="icon socialite-button" :style="{color: '#54c58c'}"><use xlink:href="#icon-weixin" /></svg>
        <svg class="icon socialite-button" :style="{color: '#5fbddf'}"><use xlink:href="#icon-qq" /></svg>
      </div>
    </IForm>
    <div class="welcome">
      <h1 class="title">欢迎来到ThinkSNS+</h1>
      <img class="qrcode" src="https://www.pgyer.com/app/qrcode/thinksns-plus">
      <p class="placeholder">扫描二维码体验APP</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

const validator = {
  account: [
    { required: true, message: '输入手机号/邮箱/昵称', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { type: 'string', min: 6, max: 16, message: '密码的长度要求在6-16位之间', trigger: 'blur' },
  ],
}

export default {
  name: 'AuthLogin',
  layout: 'auth',
  middleware: ['forGuest'],
  head: {
    title: '登录',
  },
  data () {
    return {
      form: {
        account: '木头',
        password: '123456',
      },
      validator,
    }
  },
  methods: {
    ...mapActions('auth', {
      getAccessToken: 'getAccessToken',
    }),
    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (!valid) return reject('[validate] 字段校验失败!')
          resolve()
        })
      })
    },
    async onSubmit () {
      await this.validateForm()
      await this.getAccessToken(this.form)
      const { redirect } = this.$route.query
      if (redirect) this.$router.replace(redirect)
      else this.$router.back()
    },
  },
}
</script>

<style lang="less" scoped>
.p-auth-login {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  width: 640px;
  background-color: #fff;

  .form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: auto;
    padding: 50px;
    color: @text-info-color;

    a {
      color: @text-info-color;

      &.active {
        color: @primary-color;
      }
    }

    > * {
      margin-bottom: 24px;
    }

    /deep/ .ivu-input { // scoped 穿透
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      background-color: @background-color-base;
      font-size: @font-size-base;
    }

    .others {
      display: flex;
      justify-content: space-between;

      .use-code {
        cursor: pointer;
      }
    }

    .footage {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .right {
        margin-left: auto;
      }
    }

    .socialite-button {
      box-sizing: content-box;
      margin-left: 2px;
      padding: 2px;
      .border();
      border-radius: 100%;
      cursor: pointer;
    }
  }

  .welcome {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: none;
    width: 240px;
    min-height: 360px;
    background: linear-gradient(120deg, #5f52ad, #5dd1e1);
    color: #fff;

    .title {
      margin-bottom: 36px;
      font-size: @font-size-base * 1.5;
      font-weight: normal;
    }

    .qrcode {
      width: 120px;
      height: 120px;
    }

    .placeholder {
      margin-top: 36px;
    }
  }
}
</style>
