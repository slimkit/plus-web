<template>
  <main class="p-topic-create">
    <h1>{{ topicId ? '编辑话题' : '创建话题' }}</h1>

    <IForm
      ref="form"
      label-position="top"
      :model="form"
      :rules="validator"
      @submit.native.prevent="onSubmit"
    >
      <IFormItem prop="logo">
        <div class="cover">
          <div
            v-if="!cover.preview"
            class="default"
            @click="$refs.cropper.open()"
          >
            <svg class="icon"><use xlink:href="#icon-ico_upload" /></svg>
            上传话题封面图
          </div>

          <div
            v-else
            class="image"
            :style="{backgroundImage: `url(${cover.preview})`}"
          >
            <IButton
              class="change-btn"
              ghost
              shape="circle"
              size="small"
              @click="$refs.cropper.open()"
            >
              改变话题封面
            </IButton>
          </div>

          <ImageCropper
            ref="cropper"
            title="上传话题封面"
            :fixed="true"
            :width="720"
            :height="380"
            @after-crop="onAfterCrop"
          />

          <Uploader
            ref="uploader"
            v-model="cover"
            accept="image/*"
            :preview-size="{height: 400, width: 1080}"
          />
        </div>
      </IFormItem>

      <IFormItem prop="name">
        <IInput
          v-model="name"
          size="large"
          placeholder="输入话题标题（必填）"
          :disabled="!!topicId"
        />
      </IFormItem>

      <IFormItem prop="desc">
        <IInput v-model="desc" placeholder="简单介绍以下话题内容" />
      </IFormItem>

      <div class="submit">
        <p class="tips">话题创建成功后，标题不可更改</p>

        <IButton
          class="submit-btn"
          type="primary"
          html-type="submit"
          size="large"
          :disabled="!modifiedForm"
        >
          提交
        </IButton>
      </div>
    </IForm>
  </main>
</template>

<script>
import ImageCropper from '@/components/common/ImageCropper.vue'

export default {
  name: 'TopicCreate',
  components: {
    ImageCropper,
  },
  middlewares: ['requireAuth'],
  data () {
    return {
      cover: {},
      name: '',
      desc: '',
      validator: {
        name: [
          { required: true, message: '请输入话题名称' },
        ],
      },
    }
  },
  computed: {
    topicId () {
      return null
    },
    form () {
      return {
        name: this.name,
        desc: this.desc,
        logo: this.cover.value,
      }
    },
    modifiedForm () {
      return !!this.name
    },
  },
  methods: {
    onAfterCrop (blob, fileName) {
      this.$refs.uploader.uploadBlob(blob, fileName)
    },
    beforeSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) this.onSubmit()
        else this.$Message.error('表单校验失败，请检查')
      })
    },
    async onSubmit () {
      const { id, need_review: needReview = false } = await this.$axios.$post('/feed/topics', this.form)
      if (needReview) {
        this.$Message.success('话题创建成功，请等待审核')
        this.$router.push('/topic')
      } else {
        this.$Message.success('话题创建成功')
        this.$router.push(`/topic/${id}`)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.p-topic-create {
  padding: 40px 30px;
  background-color: #fff;

  .cover {
    margin: 24px auto;
    width: 720px;
    height: 380px;
    cursor: pointer;

    .default {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: @background-color-base;
      height: 100%;
      font-size: 150%;
      color: @disabled-color;
    }

    .image {
      position: relative;
      width: 100%;
      height: 100%;
      background: center / cover no-repeat;

      .change-btn {
        position: absolute;
        bottom: 30px;
        right: 30px;
      }
    }
  }

  /deep/ .ivu-input {
    border-width: 0 0 1px;
  }

  .submit {
    text-align: center;

    .tips {
      margin: 20px;
      color: @disabled-color;
    }

    .submit-btn {
      padding: 8px 28px;
    }
  }
}
</style>
