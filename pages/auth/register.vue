<template>
  <div class="p-auth-register">
    <main class="container">
      <nav class="type-nav">
        <nuxt-link :to="{query: {type: 'phone'}}" :class="{'exact-active': type === 'phone'}">手机注册</nuxt-link>
        <nuxt-link :to="{query: {type: 'email'}}" :class="{'exact-active': type === 'email'}">邮箱注册</nuxt-link>
      </nav>

      <IForm
        ref="form"
        class="form"
        :label-width="80"
        label-position="left"
        :model="validator"
        @submit.native.prevent
      >
        <IFormItem prop="account" label="手机号">
          <IInput v-model="phone" placeholder="输入11位手机号码" />
        </IFormItem>

        <IFormItem prop="code" label="验证码">
          <IInput v-model="code" placeholder="输入手机验证码">
            <IButton
              slot="append"
              type="primary"
              :disabled="codeLimit > 0"
              @click="getCode"
            >
              {{ codeLimit ? `${codeLimit}s 后重试` : '获取验证码' }}
            </IButton>
          </IInput>
        </IFormItem>

        <IFormItem prop="username" label="设置昵称">
          <IInput v-model="username" placeholder="2-8个字符" />
        </IFormItem>

        <IFormItem prop="password" label="设置密码">
          <IInput v-model="password" placeholder="6-15个字符，区分大小写" />
        </IFormItem>

        <IFormItem prop="confirmPassword" label="确认密码">
          <IInput v-model="confirmPassword" placeholder="再次输入密码" />
        </IFormItem>

        <IButton type="primary" html-type="submit">注册</IButton>
      </IForm>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AuthRegister',
  data () {
    return {
      codeLimit: 0,

      username: '',
      password: '',
      confirmPassword: '',
      phone: '',
      email: '',
      code: '',
    }
  },
  computed: {
    type () {
      return this.$route.query.type || 'phone'
    },
  },
  methods: {
    getCode () {
      this.codeLimit = 60
      let timer = setInterval(() => {
        this.codeLimit--
        if (this.codeLimit <= 0) clearInterval(timer)
      }, 1000)
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
