<template>
  <div class="p-group-create">
    <h1>创建圈子</h1>
    <hr>

    <IForm
      ref="form"
      :model="validateFields"
      :rules="rule"
      :label-width="80"
      @submit.native.prevent="onSubmit"
    >
      <IFormItem
        prop="avatar"
        label="圈子头像"
        required
      >
        <figure class="avatar-wrap" @click="$refs.cropper.open()">
          <div class="avatar-src" :style="{backgroundImage: `url(${avatar.preview})`}" />

          <ImageCropper
            ref="cropper"
            title="上传圈子头像"
            :preview="true"
            :fixed="true"
            :width="320"
            :height="320"
            output-type="png"
            @after-crop="onAfterCrop"
          />

          <Uploader
            ref="uploader"
            v-model="avatar"
            type="blob"
          />

          <figcaption>
            <svg class="icon xl"><use xlink:href="#icon-ico_upload" /></svg>
            上传圈子头像
          </figcaption>
        </figure>
      </IFormItem>

      <IFormItem label="圈子名称" prop="name">
        <IInput
          v-model="form.name"
          placeholder="最多20个字"
        />
      </IFormItem>

      <IFormItem label="圈子简介" prop="summary">
        <IInput
          v-model="form.summary"
          type="textarea"
          :rows="3"
          placeholder="最多255个字"
        />
      </IFormItem>

      <IFormItem label="圈子分类" prop="category">
        <Select
          v-model.number="category"
          filterable
          class="category-selector"
          :transfer="true"
        >
          <Option
            v-for="cate in categories"
            :key="cate.id"
            :value="cate.id"
            :label="cate.name"
          />
        </Select>
      </IFormItem>

      <IFormItem
        class="tag"
        label="圈子标签"
        prop="tags"
        required
      >
        <TagSelector :selected-tags.sync="selectedTags" placeholder="请选择圈子标签" />
      </IFormItem>

      <IFormItem label="订阅模式" prop="needPaid">
        <IRadioGroup v-model="needPaid">
          <IRadio :label="0">免费</IRadio>
          <IRadio :label="1">付费</IRadio>
        </IRadioGroup>
      </IFormItem>

      <IFormItem
        v-show="needPaid"
        label="入圈金额"
        prop="amount"
        required
      >
        <IInputNumber
          v-model="paidAmount"
          :min="1"
          :max="99999999"
        />
        积分
      </IFormItem>

      <IFormItem v-show="!needPaid" label="是否公开">
        <IRadioGroup v-model="isPublic">
          <IRadio :label="1">公开圈子</IRadio>
          <IRadio :label="0">私密圈子</IRadio>
        </IRadioGroup>
      </IFormItem>

      <IFormItem label="分享设置">
        <IRadioGroup v-model="allowFeed">
          <IRadio :label="0">帖子可分享至动态</IRadio>
          <IRadio :label="1">帖子不可分享至动态</IRadio>
        </IRadioGroup>
      </IFormItem>

      <IFormItem prop="location" label="圈子位置">
        <!-- TODO: 获取经纬度信息 -->
        <IAutoComplete
          v-model="form.location"
          :data="searchLocation"
          size="large"
          placeholder="搜索所在地区"
          @on-search="onSearchLocation"
        />
      </IFormItem>

      <IFormItem label="圈子公告">
        <IInput
          v-model="form.notice"
          type="textarea"
          :rows="3"
          placeholder="编辑自己的圈子公告或规则"
        />
      </IFormItem>

      <IFormItem prop="agree">
        <ICheckbox v-model="agree">
          我已阅读并遵守 <span class="primary-color" @click="showProtocol = true">ThinkSNS+ 圈子创建协议</span>
        </ICheckbox>

        <IModal
          v-model="showProtocol"
          title="ThinkSNS+ 圈子创建协议"
          :footer-hide="true"
        >
          <div class="markdown-body" v-html="markdown(protocol)" />
        </IModal>
      </IFormItem>

      <div class="bottom">
        <p>提交后，我们将在2个工作日内给予反馈，谢谢合作！</p>
        <IButton
          size="large"
          type="primary"
          html-type="submit"
        >
          提 交
        </IButton>
      </div>
    </IForm>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import markdown from '@/utils/markdown.js'
import { parseSearchTree } from '@/utils/location.js'
import ImageCropper from '@/components/common/ImageCropper.vue'
import TagSelector from '@/components/tag/TagSelector.vue'

export default {
  name: 'GroupCreate',
  components: {
    ImageCropper,
    TagSelector,
  },
  data () {
    const rule = {
      avatar: [
        { validator: (rule, value, callback) => {
          if (this.avatar.status === 'error') {
            return callback(new Error(this.avatar.error))
          } else if (this.avatar.status !== 'success') {
            return callback(new Error('请上传圈子头像'))
          }
          callback()
        } },
      ],
      name: [
        { required: true, message: '请填写圈子名称' },
      ],
      summary: [
        { required: true, message: '请填写圈子简介' },
      ],
      category: [
        { required: true, message: '请选择圈子分类' },
      ],
      tags: [
        { validator: (rule, value, callback) => {
          if (!this.selectedTags.length) {
            return callback(new Error('请选择圈子标签'))
          }
          callback()
        },
        trigger: 'change' },
      ],
      amount: [
        { validator: (rule, value, callback) => {
          if (!this.needPaid) return callback() // 免费圈子跳过验证
          if (value <= 0) return callback(new Error('请填写入圈金额'))
          callback()
        } },
      ],
      agree: [
        { validator: (rule, value, callback) => {
          if (!this.agree) return callback(new Error('请勾选圈子创建协议'))
          callback()
        } },
      ],
    }
    return {
      avatar: {},
      category: null,
      tags: [],
      selectedTags: [],
      searchLocation: [],
      allowFeed: 0,
      needPaid: 0,
      isPublic: 1,
      paidAmount: 0,
      geo: {
        location: '',
        latitude: '',
        longitude: '',
        geo_hash: '',
      },
      agree: false,
      form: {
        name: '',
        summary: '',
        notice: '',
      },
      rule,

      showTagSelector: false,
      showProtocol: false,
    }
  },
  computed: {
    ...mapState({
      globalTags: 'tags',
    }),
    ...mapState('group', {
      categories: 'category',
      protocol: 'protocol',
    }),
    validateFields () {
      return {
        avatar: this.avatar,
        name: this.form.name,
        summary: this.form.summary,
        category: this.category,
        tags: this.selectedTags,
        needPaid: this.needPaid,
        amount: this.paidAmount,
        location: this.geo.location,
        notice: this.form.notice,
        agree: this.agree,
      }
    },
    submitFields () {
      const form = new FormData()
      form.append('avatar', this.avatar.file)
      form.append('name', this.form.name)
      form.append('summary', this.form.summary)

      this.tags.forEach(({ id }) => {
        form.append('tags[][id]', id)
      })
      if (this.allowFeed) form.append('allow_feed', 1)
      if (this.needPaid) {
        form.append('mode', 'paid')
        form.append('money', this.paidAmount)
      } else {
        form.append('mode', this.isPublic ? 'public' : 'private')
      }
      if (this.geo.location) {
        Object.keys(this.geo).forEach(key => {
          form.append(key, this.geo[key])
        })
      }
      if (this.form.notice) {
        form.append('notice', this.form.notice)
      }
      return form
    },
  },
  watch: {
    globalTags (val) {
      this.tags = val
    },
    'avatar.status' (val) {
      if (['success', 'error'].includes(val)) this.$refs.form.validateField('avatar')
    },
    selectedTags () {
      this.$refs.form.validateField('tags')
    },
  },
  mounted () {
    this.loadFromStorage()
    this.getGroupCategories()
    this.getTags()
    this.$nextTick(() => {
      if (!this.protocol) this.getGroupProtocol()
    })
  },
  methods: {
    ...mapActions({
      getTags: 'getTags',
    }),
    ...mapActions('group', {
      getGroupCategories: 'getGroupCategories',
      getGroupProtocol: 'getGroupProtocol',
    }),
    markdown (md) {
      return markdown(md)
    },
    loadFromStorage () {
      this.$store.commit('LOAD_FROM_STORAGE') // 预加载全局标签
      this.$store.commit('group/LOAD_FROM_STORAGE') // 预加载分组信息
    },
    onTagAppend (tag) {
      this.selectedTags.push(tag)
    },
    onTagRemove (tag) {
      this.selectedTags = _.filter(this.selectedTags, t => t.id !== tag.id)
    },
    onSearchLocation: _.debounce(async function (keyword) {
      this.searchLocation = []
      if (!keyword) return
      const params = { name: keyword }
      const result = await this.$axios.$get('/locations/search', { params })
      this.searchLocation = result.map(item => parseSearchTree(item.tree))
    }, 450),
    onAfterCrop (blob, fileName) {
      this.$refs.uploader.uploadBlob(blob, fileName)
    },
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
      if (this.submitLock) return
      this.submitLock = true
      await this.$axios.$post(`/plus-group/categories/${this.category}/groups`, this.submitFields)
        .finally(() => {
          this.submitLock = false
        })
      this.$Message.success('创建成功，请等待审核')
      this.$router.back()
    },
  },
}
</script>

<style lang="less" scoped>
.p-group-create {
  padding: 40px 120px;
  background-color: #fff;

  .bottom {
    text-align: center;
    color: @disabled-color;

    .ivu-btn {
      margin-top: 16px;
    }
  }

  .avatar-wrap {
    position: relative;
    width: 120px;
    height: 120px;
    color: @disabled-color;
    cursor: pointer;

    .avatar-src {
      position: relative;
      width: 100%;
      height: 100%;
      background: transparent center / cover no-repeat;
      z-index: 1;
    }

    figcaption {
      position: absolute;
      top: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border: 1px dashed @border-color-base;
    }
  }

  .ivu-form-item {
    margin-top: 24px;

    &-error {
      .avatar-wrap figcaption,
      /deep/ .ivu-checkbox-inner {
        border-color: @error-color
      }
    }
  }

  .category-selector {
    width: 12em;
  }

  .ivu-form-item.tag {
    /deep/ .ivu-form-item-content {
      line-height: 1;
    }
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
