<template>
  <div class="p-setting-profile">
    <nav class="nav-wrap">
      <span>基本资料</span>
    </nav>

    <div class="container-wrap">
      <IForm
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="50"
        @submit.native.prevent="onSubmit"
      >
        <div class="avatar-wrap">
          <Avatar
            :user="user"
            size="xl"
            :link="false"
          />
          <IButton :loading="avatarUploadingLock" @click="$refs.cropper.open()">更换头像</IButton>
          <ImageCropper
            ref="cropper"
            title="更换头像"
            :circle="true"
            :fixed="true"
            :preview="true"
            @after-crop="onAfterCrop"
          />
          <Uploader
            ref="uploader"
            :preview-size="{width: 320}"
            accept="image/*"
            @finish="afterAvatarUpload"
          />
        </div>
        <IFormItem prop="name" label="昵称">
          <IInput
            v-model="form.name"
            type="text"
            size="large"
          />
        </IFormItem>
        <IFormItem prop="bio" label="简介">
          <IInput
            v-model="form.bio"
            type="text"
            size="large"
            :maxlength="50"
          />
        </IFormItem>
        <IFormItem prop="sex" label="性别">
          <IRadioGroup v-model="form.sex">
            <IRadio :label="1">男</IRadio>
            <IRadio :label="2">女</IRadio>
            <IRadio :label="0">不方便透露</IRadio>
          </IRadioGroup>
        </IFormItem>
        <IFormItem prop="location" label="地区">
          <IAutoComplete
            v-model="form.location"
            :data="searchLocation"
            size="large"
            @on-search="onSearchLocation"
          />
        </IFormItem>
        <IButton
          class="submit-button"
          type="primary"
          html-type="submit"
          :disabled="disabled"
          :loading="submitLock"
        >
          保存
        </IButton>
      </IForm>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import ImageCropper from '@/components/common/ImageCropper.vue'
import { parseSearchTree } from '@/utils/location'

export default {
  name: 'SettingProfile',
  components: {
    ImageCropper,
  },
  data: function () {
    return {
      form: {
        name: '',
        bio: '',
        location: '',
        sex: 0,
        avatar: null,
      },
      submitLock: false,
      avatarPreview: '',
      searchLocation: [],
      avatarUploadingLock: false,
      rules: {
        name: [ { required: true, trigger: 'blur' } ],
        bio: [ { required: true, trigger: 'blur' } ],
        sex: [ { required: true } ],
      },
    }
  },
  computed: {
    user () {
      const user = _.cloneDeep(this.logged)
      if (this.avatarPreview) user.avatar = { url: this.avatarPreview }
      return user
    },
    originForm () {
      return {
        ..._.pick(this.logged, ['name', 'bio', 'location', 'sex']),
        avatar: null,
      }
    },
    changedForm () {
      const form = {}
      for (const key in this.originForm) {
        if (this.originForm[key] !== this.form[key]) {
          form[key] = this.form[key]
        }
      }
      return form
    },
    disabled () {
      if (!this.form.bio) return true
      return !Object.keys(this.changedForm).length
    },
  },
  created () {
    this.resetData()
  },
  methods: {
    resetData () {
      this.form.name = this.logged.name
      this.form.bio = this.logged.bio
      this.form.sex = this.logged.sex
      this.form.location = this.logged.location
      this.avatarPreview = ''
      this.avatarUploadingLock = false
    },
    onAfterCrop (blob, fileName) {
      this.$refs.uploader.uploadBlob(blob, fileName)
    },
    afterAvatarUpload (image) {
      this.avatarUploadingLock = false
      if (image.error) return this.$Message.error(image.error)
      this.avatarPreview = image.preview
      this.form.avatar = image.value
    },
    onSearchLocation: _.debounce(async function (keyword) {
      this.searchLocation = []
      if (!keyword) return
      const params = { name: keyword }
      const result = await this.$axios.$get('/locations/search', { params })
      this.searchLocation = result.map(item => parseSearchTree(item.tree))
    }, 450),
    async onSubmit () {
      this.submitLock = true
      await this.$axios.$patch('/user', this.changedForm)
        .finally(() => {
          this.submitLock = false
        })
      this.$Message.success('更新个人资料成功')
      await this.$store.dispatch('user/getCurrentUser')
      this.resetData()
    },
  },
}
</script>

<style lang="less" scoped>
.p-setting-profile {
  .container-wrap {
    padding: 28px 0;
  }

  .avatar-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 36px;

    .ivu-btn {
      margin-left: 24px;
      background-color: @border-color-base;
      font-size: @font-size-large;
    }
  }

  .submit-button {
    width: 7em;
    margin-top: 32px;
    font-size: @font-size-base;
    font-weight: bold;
  }
}
</style>
