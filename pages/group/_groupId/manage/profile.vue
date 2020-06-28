<template>
  <div class="p-setting-profile">
    <nav class="nav-wrap">
      <span>圈子资料</span>
    </nav>

    <div class="container-wrap">
      <Form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="80"
        @submit.native.prevent="onSubmit"
      >
        <div class="avatar-wrap">
          <Avatar
            :user="group"
            size="xl"
            :link="false"
            :square="true"
          />
          <Button :loading="avatarUploadingLock" @click="$refs.cropper.open()">更换圈子头像</Button>
          <mageCropper
            ref="cropper"
            title="更换圈子头像"
            :preview="true"
            :fixed="true"
            :width="320"
            :height="320"
            output-type="png"
            @after-crop="onAfterCrop"
          />
          <Uploader
            ref="uploader"
            :preview-size="{width: 320}"
            accept="image/*"
            @finish="afterAvatarUpload"
          />
        </div>

        <FormItem prop="name" label="圈子名称">
          <Input
            v-model="form.name"
            type="text"
            size="large"
          />
        </FormItem>

        <FormItem prop="summary" label="圈子简介">
          <Input
            v-model="form.summary"
            type="textarea"
            :rows="3"
            size="large"
            :maxlength="255"
            placeholder="最多255字"
          />
        </FormItem>

        <FormItem prop="category" label="圈子分类">
          <Select v-model="form.category_id">
            <Option
              v-for="cate in categories"
              :key="cate.id"
              :label="cate.name"
              :value="cate.id"
            />
          </Select>
        </FormItem>

        <FormItem
          class="tag"
          label="圈子标签"
          prop="tags"
          required
        >
          <Poptip
            :transfer="false"
            class="tag-selector"
            title="选择圈子标签"
            always
          >
            <div class="selected-wrap ivu-input">
              <TagList
                :tags="selectedTags"
                :selected="true"
                size="sm"
                closeable
                @remove="onTagRemove"
              />
            </div>

            <template v-slot:content>
              <div class="tags-wrap">
                <section v-for="tagCate in tags" :key="`cate-${tagCate.id}`">
                  <h4>{{ tagCate.name }}</h4>
                  <TagList
                    :tags="tagCate.tags"
                    size="sm"
                    :selected-tags="selectedTags"
                    @append="onTagAppend"
                    @remove="onTagRemove"
                  />
                </section>
              </div>
            </template>
          </Poptip>
        </FormItem>

        <FormItem label="订阅模式" prop="needPaid">
          <RadioGroup v-model="needPaid">
            <Radio :disabled="group.mode === 'paid'" :label="0">免费</Radio>
            <Radio :label="1">付费</Radio>
          </RadioGroup>
          <p v-if="group.mode === 'paid'" class="disabled">付费圈子不能改为免费圈子</p>
        </FormItem>

        <FormItem
          v-show="needPaid"
          label="入圈金额"
          prop="amount"
          required
        >
          <InputNumber
            v-model="form.money"
            :min="1"
            :max="99999999"
          />
          积分
        </FormItem>

        <FormItem v-show="!needPaid" label="是否公开">
          <RadioGroup v-model="isPublic">
            <Radio :label="1">公开圈子</Radio>
            <Radio :label="0">私密圈子</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="location" label="圈子位置">
          <AutoComplete
            v-model="form.location"
            :data="searchLocation"
            size="large"
            @on-search="onSearchLocation"
          />
        </FormItem>

        <FormItem prop="notice" label="圈子公告">
          <Input
            v-model="form.notice"
            type="textarea"
            placeholder="编辑自己的圈子公告或规则（选填）"
          />
        </FormItem>

        <FormItem prop="permission" label="发帖权限">
          <RadioGroup v-model="form.permissions">
            <Radio label="administrator">仅圈主</Radio>
            <Radio label="administrator,founder">圈主和管理员</Radio>
            <Radio label="member,administrator,founder">所有成员</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem prop="share" label="分享设置">
          <RadioGroup v-model="form.allow_feed">
            <Radio :label="1">帖子可分享至动态</Radio>
            <Radio :label="0">帖子不可分享至动态</Radio>
          </RadioGroup>
        </FormItem>

        <Button
          class="submit-button"
          type="primary"
          html-type="submit"
          :disabled="disabled"
          :loading="submitLock"
        >
          保存
        </Button>
      </Form>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import { parseSearchTree } from '@/utils/location'
import ImageCropper from '@/components/common/ImageCropper.vue'
import TagList from '@/components/tag/TagList.vue'

export default {
  name: 'SettingProfile',
  components: {
    ImageCropper,
    TagList,
  },
  data: function () {
    return {
      form: {
        // avatar: null,
        name: '',
        summary: '',
        location: '',
        notice: '',
        category_id: null,
        money: 0,
        allow_feed: 0,
        permissions: 'member,administrator,founder',
      },
      selectedTags: [],
      needPaid: 0,
      isPublic: 1,
      geo: {
        location: '',
        latitude: '',
        longitude: '',
        geo_hash: '',
      },

      submitLock: false,
      avatarPreview: '',
      searchLocation: [],
      avatarUploadingLock: false,
      rules: {
        name: [ { required: true, trigger: 'blur' } ],
        summary: [ { required: true, trigger: 'blur' } ],
        category: [ { required: true, trigger: 'blur' } ],
      },
    }
  },
  computed: {
    ...mapState('group', {
      categories: 'category',
    }),
    ...mapState({
      tags: 'tags',
    }),
    group () {
      const group = this.$parent.group
      if (this.avatarPreview) {
        group.avatar.url = this.avatarPreview
      }
      return group
    },
    mode () {
      if (this.needPaid) return 'paid'
      if (this.isPublic) return 'public'
      return 'private'
    },
    originForm () {
      return {
        ..._.pick(this.group, ['name', 'location', 'summary', 'notice', 'permissions', 'category_id', 'allow_feed', 'mode', 'money']),
        tags: this.group.tags.map(t => t.id).sort().join(','),
      }
    },
    changedForm () {
      const form = {}
      for (const key in this.form) {
        if (!_.isEqual(this.originForm[key], this.form[key])) {
          form[key] = this.form[key]
        }
        if (this.mode !== this.originForm.mode) form.mode = this.mode
      }
      return form
    },
    disabled () {
      return !Object.keys(this.changedForm).length
    },
  },
  watch: {
    needPaid (newVal, oldVal) {
      if (oldVal === 1 && newVal === 0) {
        this.needPaid = 1
        this.$Message.error('收费圈子不能改成公开和私有圈子')
      }
    },
  },
  created () {
    this.resetData()
    this.getGroupCategories()
    this.getTags()
  },
  methods: {
    ...mapActions('group', {
      getGroupCategories: 'getGroupCategories',
    }),
    ...mapActions({
      getTags: 'getTags',
    }),
    resetData () {
      this.form.name = this.group.name
      this.form.summary = this.group.summary
      this.form.notice = this.group.notice
      this.form.location = this.group.location
      this.form.category_id = this.group.category_id
      this.form.permissions = this.group.permissions
      this.form.allow_feed = this.group.allow_feed
      this.form.money = this.group.money
      this.selectedTags = this.group.tags || []
      switch (this.group.mode) {
        case 'public':
          this.needPaid = 0
          this.isPublic = 1
          break
        case 'private':
          this.needPaid = 0
          this.isPublic = 0
          break
        case 'paid':
          this.needPaid = 1
          this.form.money = this.group.money
      }
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
      this.modifyAvatar(image.file)
    },
    async modifyAvatar (blob) {
      const form = new FormData()
      form.append('avatar', blob)
      await this.$axios.$post(`/plus-group/groups/${this.group.id}`, form)
      this.$Message.success('圈子头像修改成功')
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
      await this.$axios.$post(`/plus-group/groups/${this.group.id}`, this.changedForm)
        .finally(() => {
          this.submitLock = false
        })
      this.$Message.success('修改圈子资料成功')
      await this.$store.dispatch('group/getGroupDetail', this.group.id)
      this.resetData()
    },
    onTagAppend (tag) {
      this.selectedTags.push(tag)
    },
    onTagRemove (tag) {
      this.selectedTags = _.filter(this.selectedTags, t => t.id !== tag.id)
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

  .disabled {
    color: @text-info-color;
  }

  .submit-button {
    width: 7em;
    margin-top: 32px;
    font-size: @font-size-base;
    font-weight: bold;
  }

  .tag-selector {
    width: 100%;

    /deep/ .ivu-poptip-popper {
      left: 0 !important;
      width: 100%;
    }

    .selected-wrap {
      height: auto;
      min-height: 37px;
      padding: 8px 8px 0;
    }

    .tags-wrap {
      padding: 8px;

      section {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      h4 {
        margin-bottom: 4px;
        color: @disabled-color;
      }

      ul {
        display: flex;
        flex-wrap: wrap;

        > li {
          margin-right: 1em;
        }
      }
    }
  }
}
</style>
