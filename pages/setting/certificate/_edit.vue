<template>
  <div class="p-setting-certificate-edit">
    <nav class="nav-wrap">
      <span>{{ typeMap[cert.certification_name] || '个人认证' }}</span>
      <!-- TODO: 机构认证 -->
    </nav>

    <div class="content-wrap">
      <IForm
        ref="form"
        v-model="form"
        :label-width="80"
        :rules="rules"
        @submit.native.prevent="onSubmit"
      >
        <IFormItem
          v-for="item in Object.keys(labels)"
          :key="item"
          :prop="item"
          :label="labels[item].label"
        >
          <IInput v-model="form[item]" />
        </IFormItem>

        <IFormItem
          key="file"
          prop="file"
          label="认证资料"
        >
          <AsyncFile
            v-for="(id, index) in form.files"
            :key="`${index}-${id}`"
            class="upload-placeholder"
            type="image-wrap"
            :file="{id}"
            :max-width="232"
            :max-height="163"
            @click.native="$refs[`uploader${index}`].select()"
          />

          <Uploader
            ref="uploader0"
            :value="files[0]"
            type="file"
            @finish="image => $set(form.files, 0, image.value)"
          />
          <Uploader
            ref="uploader1"
            :value="files[1]"
            type="file"
            @finish="image => $set(form.files, 1, image.value)"
          />
        </IFormItem>

        <IButton
          type="primary"
          html-type="submit"
          :loading="loading"
          :disabled="disabled"
        >
          保存
        </IButton>
      </IForm>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

const typeMap = {
  user: '个人认证',
  org: '机构认证',
}

const orgLabels = {
  org_name: { label: '机构名称' },
  org_address: { label: '机构地址' },
  name: { label: '负责人' },
  phone: { label: '负责人电话' },
  number: { label: '营业执照号' },
  desc: { label: '认证描述' },
}

const userLabels = {
  name: { label: '真实姓名' },
  number: { label: '身份证号' },
  phone: { label: '联系方式' },
  desc: { label: '认证描述' },
}

export default {
  name: 'SettingCertificateEdit',
  validate ({ params }) {
    return ['edit', 'apply'].includes(params.edit)
  },
  data () {
    return {
      typeMap,
      form: {
        name: '',
        phone: '',
        number: '',
        desc: '',
        files: [0, 0],
      },
      originForm: {},
      loading: false,
      rules: {
        name: [{ required: true }],
        number: [{ required: true }],
        phone: [{ required: true }],
        desc: [{ required: true }],
        org_name: [{ required: true }],
        org_address: [{ required: true }],
        file: [{ required: true }],
      },
    }
  },
  computed: {
    isEdit () {
      return this.$route.params.edit === 'edit'
    },
    cert () {
      const { certification } = this.logged
      return certification || {}
    },
    isOrg () {
      return this.cert.certification_name === 'org'
    },
    labels () {
      return this.isOrg ? orgLabels : userLabels
    },
    files () {
      const files = this.form.files || []
      return files.map(id => ({ value: id }))
    },
    changedForm () {
      const form = {}
      for (const key in this.originForm) {
        if (!_.isEqual(this.originForm[key], this.form[key])) {
          form[key] = this.form[key]
        }
      }
      return form
    },
    disabled () {
      return !Object.keys(this.changedForm).length
    },
  },
  fetch ({ store, redirect }) {
    const { logged } = store.state.user
    const cert = logged.certification
    if (!cert) return redirect('/setting/certificate/apply')
  },
  created () {
    this.isEdit && this.initData()
  },
  methods: {
    async initData () {
      const form = _.pick(this.cert.data, [...Object.keys(this.labels), 'files'])
      this.originForm = _.cloneDeep(form)
      this.form = form
    },
    async onSubmit () {
      this.loading = true
      await (this.isEdit ? this.onSave() : this.onApply())
        .finally(() => {
          this.loading = false
        })
      this.$Message.success('提交成功，请等待审核')
      this.initData()
      this.$router.back()
    },
    onApply () {
      return this.$axios.$post('/user/certification', this.form)
    },
    onSave () {
      return this.$axios.$patch('/user/certification', this.changedForm)
    },
  },
}
</script>

<style lang="less" scoped>
.p-setting-certificate-edit {
  .content-wrap {
    padding: 28px 0;
  }

  .upload-placeholder {
    display: inline-block;
    width: 232px;
    height: 163px;
    margin-right: 8px;
    cursor: pointer;
  }
}
</style>
