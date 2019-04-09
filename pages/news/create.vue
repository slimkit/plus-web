<template>
  <div class="p-news-create">
    <main class="main-container">
      <IForm
        ref="form"
        :model="validateForm"
        :rules="validator"
        :label-width="20"
        @submit.native.prevent
      >
        <IFormItem prop="title" label=" ">
          <IInput
            v-model="form.title"
            size="large"
            placeholder="请在此输入20字以内的资讯标题"
          />
        </IFormItem>

        <IFormItem prop="subject">
          <IInput v-model="form.subject" placeholder="请在此输入200字以内的摘要" />
        </IFormItem>

        <IFormItem prop="category" label=" ">
          <Select
            v-model="form.category"
            class="category-wrap"
            placeholder="请选择资讯分类"
          >
            <Option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
              :label="category.name"
            />
          </Select>
        </IFormItem>

        <IFormItem prop="content" label=" ">
          <MarkdownEditor v-model="form.content" placeholder="请输入资讯内容，支持 Markdown 语法" />
        </IFormItem>

        <IFormItem
          class="tag"
          prop="tags"
          label=" "
        >
          <TagSelector :selected-tags.sync="selectedTags" placeholder="请选择资讯标签" />
        </IFormItem>

        <IFormItem prop="cover">
          <figure class="cover-wrap">
            <div
              class="cover-src"
              :style="{backgroundImage: `url(${cover.preview})`}"
              @click="$refs.cropper.open()"
            />

            <ImageCropper
              ref="cropper"
              title="上传资讯封面"
              :preview="false"
              :fixed="true"
              :width="640"
              :height="360"
              @after-crop="afterCrop"
            />

            <Uploader
              ref="uploader"
              v-model="cover"
              type="file"
            />

            <figcaption>
              <svg class="icon xl"><use xlink:href="#icon-ico_upload" /></svg>
              点击上传封面
            </figcaption>
          </figure>
        </IFormItem>

        <IFormItem>
          <IInput v-model="form.author" placeholder="文章作者（选填）" />
        </IFormItem>

        <IFormItem>
          <IInput v-model="form.from" placeholder="文章来源（原创可不填）" />
        </IFormItem>

        <div class="submit-wrap">
          <p>投稿后，我们将在两个工作日内给予反馈，谢谢合作！</p>
          <IButton
            class="submit-btn"
            type="primary"
            size="large"
            :loading="submitLock"
            @click="beforeSubmit"
          >
            投稿
          </IButton>
        </div>
      </IForm>
    </main>

    <aside class="side-container">
      <SideWidget title="投稿须知">
        <div class="notice-wrap">
          <p>请用准确的语言描述您发布的资讯的主旨</p>
          <p>选择适合的资讯分类, 让您发布的资讯能快速在相应的分类中得到展示.</p>
          <p>详细补充您的资讯内容, 并提供一些相关的素材以供参与者更多的了解您所要表述的资讯思想。</p>
          <p>注：如果您的内容不够正式，为了数据更美观，您的投稿将不会通过；投稿内容一经审核通过，所投递的内容将共所有人可以阅读，并在您发布资讯中进行分享、点赞和评论</p>
        </div>
      </SideWidget>
    </aside>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { Message } from 'iview'
import { filterHTMLTags } from '@/utils/text'
import MarkdownEditor from '@/components/common/MarkdownEditor.vue'
import SideWidget from '@/components/common/SideWidget.vue'
import ImageCropper from '@/components/common/ImageCropper.vue'
import TagSelector from '@/components/tag/TagSelector.vue'

export default {
  name: 'NewsCreate',
  head () {
    return {
      title: `资讯投稿`,
    }
  },
  middleware: ['requireAuth'],
  components: {
    MarkdownEditor,
    SideWidget,
    ImageCropper,
    TagSelector,
  },
  data () {
    return {
      form: {
        title: '',
        subject: '',
        category: 0,
        content: '',
        author: '',
        from: '',
      },
      selectedTags: [],
      cover: {},

      submitLock: false,
    }
  },
  computed: {
    ...mapState({
      tags: 'tags',
    }),
    ...mapGetters({
      categories: 'news/categories',
    }),
    validateForm () {
      return {
        ...this.form,
        tags: this.selectedTags.map(t => t.id).join(','),
        image: this.cover.value,
      }
    },
    validator () {
      return {
        title: [
          { required: true, message: '请输入资讯标题', trigger: 'blur' },
          { type: 'string', max: 20, message: '最多20字', trigger: 'change' },
          { type: 'string', max: 20, message: '最多20字', trigger: 'blur' },
        ],
        subject: [
          { type: 'string', max: 200, message: '最多200字', trigger: 'change' },
        ],
        category: [
          { required: true, message: '请选择资讯分类' },
          { validator: (rule, value, callback) => {
            if (!value) return callback(new Error('请选择资讯分类'))
            callback()
          } },
        ],
        content: [
          { required: true, message: '请输入资讯内容' },
          { validator: (rule, value, callback) => {
            if (!filterHTMLTags(value)) return callback(new Error('请输入资讯内容'))
            callback()
          } },
        ],
        tags: [
          { required: true, message: '请选择资讯标签' },
          { validator: (rule, value, callback) => {
            if (!value) return callback(new Error('请选择资讯标签'))
            callback()
          } },
        ],
      }
    },
    payAmount () {
      const { news } = this.boot
      return news.contribute.pay && news.pay_contribute
    },
  },
  watch: {
    'form.content' () {
      this.$nextTick(() => {
        this.$refs.form.validateField('content')
      })
    },
  },
  asyncData ({ store, redirect }) {
    const logged = store.state.user.logged || {}
    const needVerify = store.state.boot.news.contribute.verified
    if (needVerify && !logged.verified) {
      Message.error('投稿前需要进行实名认证')
      return redirect('/setting/certificate')
    }
  },
  mounted () {
    this.getTags()
    this.getCategories()
  },
  methods: {
    ...mapActions({
      getCategories: 'news/getNewsCategories',
      getTags: 'getTags',
    }),
    async beforeSubmit () {
      if (!await this.$refs.form.validate()) {
        return this.$Message.error('表单校验失败，请检查')
      }
      if (this.payAmount) {
        this.$Modal.confirm({
          title: '提示',
          content: `本次投稿您需要支付${this.payAmount}积分，是否继续？`,
          onOk: async () => {
            const password = await new Promise(resolve => {
              this.$root.$emit('password', password => resolve(password))
            })
            if (password === false) return
            this.$root.$emit('password:close')
            this.onSubmit(password)
          },
        })
      } else {
        this.onSubmit()
      }
    },
    async onSubmit (password) {
      const { category, ...params } = this.validateForm
      if (password) params.password = password

      this.submitLock = true
      await this.$axios.$post(`/news/categories/${category}/currency-news`, params)
        .finally(() => {
          this.submitLock = false
        })

      this.$Message.success({ content: '投稿成功，请等待审核', duration: 3 })
      this.$router.back()
    },
    afterCrop (blob, fileName) {
      this.$refs.uploader.uploadBlob(blob, fileName)
    },
  },
}
</script>

<style lang="less" scoped>
.p-news-create {
  display: flex;
  align-items: flex-start;

  .main-container {
    flex: auto;
    padding: 60px 40px;
    margin-right: 30px;
    background-color: #fff;
  }

  .side-container {
    position: sticky;
    top: 30px;
    flex: none;
    width: @sidebar-width;

    .notice-wrap {
      padding: 16px;
      color: @disabled-color;
      line-height: 1.8;

      p {
        margin-bottom: 8px;
      }
    }
  }

  .category-wrap {
    width: 16em;
  }

  .cover-wrap {
    position: relative;
    width: 100%;
    height: 320px;
    color: @disabled-color;
    cursor: pointer;

    .cover-src {
      position: relative;
      width: 100%;
      height: 100%;
      background: transparent center / cover no-repeat;
      border-radius: @border-radius-base;
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
      border-radius: @border-radius-base;
    }
  }

  .submit-wrap {
    text-align: center;
    margin-top: 30px;
    color: @disabled-color;

    .submit-btn {
      margin-top: 30px;
      padding: 8px 32px;
    }
  }

  /deep/ .ivu-input {
    border-width: 0 0 1px;
  }
}
</style>
