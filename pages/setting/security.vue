<template>
  <div class="p-setting-security">
    <nav class="nav-wrap">
      <span>修改密码</span>
    </nav>

    <div class="container-wrap">
      <IForm
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="120"
        @submit.native.prevent="onSubmit"
      >
        <!-- 隐藏输入框，用于浏览器保存表单 -->
        <input
          type="hidden"
          name="account"
          :value="logged.name"
        >
        <IFormItem prop="oldPassword" label="原密码">
          <IInput
            v-model="form.oldPassword"
            type="password"
            size="large"
          />
        </IFormItem>
        <IFormItem prop="newPassword" label="设置新密码">
          <IInput
            v-model="form.newPassword"
            type="password"
            size="large"
          />
        </IFormItem>
        <IFormItem prop="confirmPassword" label="确认新密码">
          <IInput
            v-model="form.confirmPassword"
            type="password"
            size="large"
          />
        </IFormItem>
        <IButton html-type="submit">保存</IButton>
      </IForm>
    </div>
  </div>
</template>

<script>
function checkPasswordConfirm (rule, value, callback) {
  if (value === this.form.newPassword) return callback()
  callback(new Error('新密码与原密码不一致，请确认'))
}

export default {
  name: 'SettingSecurity',
  head: {
    title: '修改密码',
  },
  data: function () {
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      rules: {
        oldPassword: [
          { required: true, trigger: 'blur', message: '请输入原密码' },
          { type: 'string', min: 6, max: 16, trigger: 'blur', message: '密码必须在 6-16 位之间' },
        ],
        newPassword: [
          { required: true, trigger: 'blur', message: '请输入新密码' },
          { type: 'string', min: 6, max: 16, trigger: 'blur', message: '密码必须在 6-16 位之间' },
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', message: '请确认新密码' },
          { type: 'string', min: 6, max: 16, trigger: 'blur', message: '密码必须在 6-16 位之间' },
          { validator: checkPasswordConfirm.bind(this), trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
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

      const form = {
        old_password: this.form.oldPassword,
        password: this.form.newPassword,
        password_confirmation: this.form.confirmPassword,
      }
      await this.$axios.$put('/user/password', form)
        .then(() => {
          this.$Message.success('修改密码成功')
          this.$refs.form.resetFields()
        })
        // 非常规格式抛错，单独处理
        .catch(({ response }) => {
          let { message } = response.data
          if (!message) message = Object.values(response.data).pop()[0]
          this.$Message.error(message || '出错了')
        })
    },
  },
}
</script>

<style lang="less" scoped>
.p-setting-security {
  .container-wrap {
    padding: 48px 0;
  }
}
</style>
