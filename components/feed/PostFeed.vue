<template>
  <!-- TODO: 收费图片 -->
  <div class="c-post-text feed">
    <div class="content-wrap">
      <textarea
        ref="editor"
        v-model="content"
        class="editor"
        :placeholder="placeholder"
      />
      <span class="count">还可输入 <span>{{ maxlength - content.length }}</span> 字</span>
    </div>
    <div class="tools">
      <IButton
        type="text"
        class="button tool"
        @click="$refs.uploader.select()"
      >
        <svg class="icon"><use xlink:href="#icon-img" /></svg>
        图片
      </IButton>
      <IButton
        type="text"
        class="button tool"
        @click="showMention"
      >
        <svg class="icon"><use xlink:href="#icon-mention" /></svg>
        某人
      </IButton>
      <IPoptip
        v-model="showPay"
        class="need-pay"
        placement="bottom"
      >
        <div class="label" :class="{active: showPay}">
          {{ needPay ? '付费' : '免费' }}
          <i class="drop-icon" />
        </div>

        <ul
          slot="content"
          class="options"
          @click="showPay = false"
        >
          <li @click="needPay = false">免费</li>
          <li @click="needPay = true">付费</li>
        </ul>
      </IPoptip>
      <IButton
        type="primary"
        class="button submit-button"
        :disabled="disabled"
        :loading="loading"
        @click="onSubmit"
      >
        分享
      </IButton>
    </div>

    <ul v-show="images.length" class="image-list">
      <li
        v-for="(image, index) in images"
        :key="index"
        class="upload-image"
        :class="image.status"
        :style="{backgroundImage: `url(${image.preview})`}"
        :title="uploadStatusMap[image.status]"
        @click="onImageView(image)"
      >
        <svg class="icon delete" @click.stop="onImageDelete(image, index)"><use xlink:href="#icon-close" /></svg>

        <template v-if="image.status === 'uploading'">
          <Loading type="circle" @click.stop="onImageReupload(image, index)" />
        </template>

        <template v-else-if="image.status === 'error'">
          <svg class="icon" @click.stop="onImageReupload(image, index)">
            <use xlink:href="#icon-warning" />
          </svg>
        </template>
      </li>
      <li
        v-if="images.length < 9"
        class="upload-placeholder"
        @click="$refs.uploader.select()"
      >
        <svg class="icon lg"><use xlink:href="#icon-add" /></svg>
      </li>
    </ul>

    <Uploader
      ref="uploader"
      v-model="images"
      type="file"
      accept="image/*"
      :multiple="true"
      :before-upload="beforeUpload"
      :preview-size="{width: 640, height:480}"
      @update="onUploadUpdate"
    />

    <!-- 图片预览 modal -->
    <IModal
      v-model="preview.show"
      class="preview-wrap"
      :title="`${preview.title} - 预览`"
      :transfer="false"
      :footer-hide="true"
      :styles="{width: 'auto', maxWidth: '100%'}"
    >
      <img :src="preview.src" class="preivew-image">
    </IModal>
  </div>
</template>

<script>
import PostText from '@/components/common/PostText.vue'

const uploadStatusMap = {
  success: '上传成功',
  error: '出错了，点击重新上传',
  pending: '等待上传',
  uploading: '上传中...',
}

export default {
  name: 'PostFeed',
  mixins: [ PostText ],
  data () {
    return {
      posting: false,
      showPay: false,
      needPay: false,
      amount: undefined,
      images: [],
      mark: null, // 唯一标识

      uploadStatusMap,
      preview: {
        show: false,
        title: null,
        src: null,
      },
    }
  },
  computed: {
    form () {
      const images = this.images.map(image => ({
        id: image.value,
        amount: undefined, // TODO: 收费图片
        type: this.needPay ? 'read' : undefined,
      }))
      return {
        feed_content: this.content,
        amount: this.amount,
        feed_from: 1,
        feed_mark: this.mark,
        images,
      }
    },
    disabled () {
      if (this.content || this.images.length) return false
      return true
    },
    loading () {
      return this.posting
    },
  },
  methods: {
    async onSubmit () {
      this.checkAuth()
      this.posting = true
      this.mark = `${this.logged.id}${+new Date()}`
      this.$axios.$post('/feeds', this.form)
        .then(({ id }) => {
          this.$Message.success('发布成功')
          this.$emit('post', id)
          this.clear()
        })
        .finally(() => {
          this.posting = false
        })
    },
    clear () {
      this.content = ''
      this.needPay = false
      this.images = []
      this.amount = null
      this.mark = null
      this.loading = false
    },
    beforeUpload (files) {
      if (files.length > 9) {
        this.$Message.error('最多上传9张图片')
        return false
      }
      return true
    },
    onUploadSuccess (images) {
      console.log(images)
    },
    onUploadUpdate (image, index) {
      this.images[index] = image
    },
    onImageView (image) {
      this.preview.title = image.filename
      this.preview.src = image.preview
      this.preview.show = true
    },
    onImageDelete (image, index) {
      this.images.splice(index, 1)
    },
    onImageReupload (image, index) {

    },
  },
}
</script>

<style lang="less" scoped>
.c-post-text.feed {
  .content-wrap {
    position: relative;
    margin-bottom: 8px;

    .editor {
      background-color: @background-color-base;
      width: 100%;
      min-height: 18px+21px*5;
      max-height: 18px+21px*10;
      padding: 8px 8px 24px;
      .border();
      .placeholder-color(@text-info-color);
    }

    .count {
      position: absolute;
      bottom: 8px;
      right: 8px;
      font-size: @font-size-small;

      > span {
        color: @primary-color;
      }
    }
  }

  .tools {
    display: flex;

    .tool {
      padding-left: 0;
      padding-right: 0;
      margin-right: 16px;
    }

    .need-pay {
      display: flex;
      align-items: center;
      margin-left: auto;
      margin-right: 1em;

      .label {
        display: flex;
        align-items: center;
        cursor: pointer;

        i.drop-icon {
          display: inline-block;
          width: 0;
          height: 0;
          margin-left: 4px;
          border: 6px solid transparent;
          border-top-color: @text-color;
          transform-origin: center 3px;
          transform: translateY(4px);
          transition: transform .2s;
        }

        &.active {
          i.drop-icon {
            transform: translateY(4px) rotate(180deg);
          }
        }
      }

      .options {
        text-align: center;
        font-size: @font-size-base;
      }
    }

    .submit-button {
      height: 100%;
      font-size: @font-size-base;
    }
  }

  .image-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 16px;

    > li {
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex:none;
      width: 60px;
      height: 60px;
      background: transparent center / cover no-repeat;
      margin-top: 8px;
      margin-right: 8px;

      &.upload-image {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: zoom-in;

        > .c-loading,
        > .icon {
          z-index: 1;
        }

        .delete {
          display: none;
          position: absolute;
          top: 0;
          right: 0;
          color: #fff;
          background-color: @text-color;
          cursor: pointer;
          z-index: 2;
        }

        &::after {
          content: '';
          position: absolute;
          display: block;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        }

        &.uploading,
        &.pending,
        &.error {
          &::after {
            background-color: rgba(0, 0, 0, 0.4);

          }
        }

        &.uploading {
          cursor: progress;
        }

        &.error {
          cursor: pointer;
        }

        &:hover {
          .delete {
            display: block;
          }
        }
      }

      &.upload-placeholder {
        background-color: #fff;
        border: 2px dashed @border-color-base;
        color: @border-color-base;
        cursor: copy;
      }
    }
  }

  .preview-wrap {
    .preview-iamge {
      width: 100%;
    }
  }

}
</style>
