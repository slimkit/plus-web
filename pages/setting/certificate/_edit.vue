<template>
  <div class="p-setting-certificate-edit">
    <nav class="nav-wrap">
      <template v-if="cert.certification_name">
        <span>{{ typeMap[cert.certification_name] || '个人认证' }}</span>
      </template>
      <template v-else>
        <nuxt-link :to="{query: {type: 'user'}}" :class="{'exact-active': type === 'user'}">个人认证</nuxt-link>
        <nuxt-link :to="{query: {type: 'org'}}" :class="{'exact-active': type === 'org'}">机构认证</nuxt-link>
      </template>
    </nav>

    <div class="content-wrap">
      <Form
        ref="form"
        :model="form"
        :label-width="100"
        :rules="rules"
        @submit.native.prevent="onSubmit"
      >
        <FormItem
          v-for="item in Object.keys(labels)"
          :key="item"
          :prop="item"
          :label="labels[item].label"
        >
          <Input v-model="form[item]" :maxlength="item === 'phone' ? 11 : null" />
        </FormItem>

        <FormItem
          key="file"
          prop="file"
          label="认证资料"
        >
          <figure
            v-for="(id, index) in form.files"
            v-if="!isOrg || index === 0"
            :key="`${index}-${id}`"
            class="upload-placeholder"
          >
            <AsyncFile
              type="image-wrap"
              :file="{id}"
              :max-width="232"
              :max-height="163"
              @click.native="$refs[`uploader${index}`].select()"
            />

            <figcaption>
              <svg class="icon xl"><use xlink:href="#icon-ico_upload" /></svg>
              <template v-if="isOrg">上传机构营业执照</template>
              <template v-else-if="index === 0">上传身份证正面照片</template>
              <template v-else>上传身份证反面照片</template>
            </figcaption>
          </figure>

          <Uploader
            ref="uploader0"
            :value="files[0]"
            type="file"
            @finish="image => $set(form.files, 0, image.value)"
          />
          <Uploader
            v-if="!isOrg"
            ref="uploader1"
            :value="files[1]"
            type="file"
            @finish="image => $set(form.files, 1, image.value)"
          />
        </FormItem>

        <Button
          type="primary"
          html-type="submit"
          :loading="loading"
          :disabled="disabled"
        >
          保存
        </Button>
      </Form>
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
        org_name: '',
        org_address: '',
        name: '',
        phone: '',
        number: '',
        desc: '',
        files: [undefined, undefined],
      },
      originForm: {},
      loading: false,
      rules: {
        name: [{ required: true, message: '必填项' }],
        number: [{ required: true, message: '必填项' }],
        phone: [
          { required: true, message: '必填项', trigger: 'blur' },
          { type: 'string', pattern: /^1[35789]\d{9}$/, message: '手机号码不合法', trigger: 'blur' },
        ],
        desc: [{ required: true, message: '必填项' }],
        org_name: [{ required: true, message: '必填项' }],
        org_address: [{ required: true, message: '必填项' }],
        file: [{ required: true, message: '必填项' }],
      },
    }
  },
  computed: {
    type () {
      return this.$route.query.type || 'user'
    },
    isEdit () {
      return this.$route.params.edit === 'edit'
    },
    cert () {
      const { certification } = this.logged
      return certification || {}
    },
    isOrg () {
      if (this.cert.certification_name) return this.cert.certification_name === 'org'
      return this.type === 'org'
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
  fetch ({ params, query, store, redirect }) {
    const { logged } = store.state.user
    const cert = logged.certification
    if (!cert && params.edit !== 'apply') return redirect('/setting/certificate/apply')
  },
  created () {
    this.initData()
  },
  methods: {
    async initData () {
      let form = {}
      if (this.isEdit) {
        form = _.pick(this.cert.data, [...Object.keys(this.labels), 'files'])
        this.form = form
      } else {
        this.form.files = new Array(this.isOrg ? 1 : 2).fill()
        form = this.form
      }
      this.originForm = _.cloneDeep(form)
    },
    async onSubmit () {
      this.loading = true
      await (this.isEdit ? this.onSave() : this.onApply())
        .catch(() => {
          this.loading = false
        })
      this.$Message.success('提交成功，请等待审核')
      await this.$store.dispatch('user/getCurrentUser')
      this.$router.replace('/setting/certificate')
    },
    onApply () {
      return this.$axios.$post('/user/certification', { ...this.form, type: this.type })
    },
    onSave () {
      return this.$axios.$patch('/user/certification', this.changedForm)
    },
  },
}
</script>

<style lang="less" scoped>
.p-setting-certificate-edit {
  .nav-wrap {
    .exact-active {
      color: @primary-color;
    }
  }

  .content-wrap {
    padding: 28px 0;
  }

  .upload-placeholder {
    position: relative;
    display: inline-block;
    width: 232px;
    height: 163px;
    margin-right: 8px;
    cursor: pointer;

    figcaption {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px dashed @border-color-base;
      color: @text-info-color;
      font-size: @font-size-large;
      font-weight: bold;

      .icon.xl {
        font-size: 150%;
      }
    }

    .image-wrap {
      position: relative;
      background-color: transparent;
      z-index: 1;
    }
  }
}
</style>
