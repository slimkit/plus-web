<template>
  <div class="c-post-feed-images">
    <ul class="image-list">
      <PostFeedImagesItem
        v-for="(image, index) in images"
        :key="index"
        :class="{zoom: canPreview}"
        :image="image"
        :index="index"
        @preview="onPreview"
        @delete="onDelete"
      />

      <li
        v-if="images.length < 9"
        class="upload-placeholder"
        @click="select"
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
      :preview-size="{width: 120}"
      @update="onUploadUpdate"
    />

    <!-- 图片预览 modal -->
    <IModal
      v-model="previewShow"
      class="preview-wrap"
      :title="`${previewTitle} - 预览`"
      :transfer="false"
      :footer-hide="true"
      :styles="{width: 'auto', maxWidth: '100%'}"
    >
      <img :src="previewSrc" class="preivew-image">
    </IModal>
  </div>
</template>

<script>
import { getImageCover } from '@/utils/file'
import PostFeedImagesItem from './PostFeedImagesItem.vue'

export default {
  name: 'PostFeedImages',
  components: {
    PostFeedImagesItem,
  },
  props: {
    list: { type: Array, default: () => [] },
    canPreview: { type: Boolean, default: true },
  },
  data: function () {
    return {
      previewShow: false,
      previewTitle: '',
      previewSrc: null,
    }
  },
  computed: {
    images: {
      get () {
        return this.list
      },
      set (val) {
        this.$emit('update:list', val)
      },
    },
  },
  methods: {
    select () {
      this.$refs.uploader.select()
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
    onDelete (index) {
      this.images.splice(index, 1)
    },
    async onPreview (image) {
      this.$emit('preview', image)
      if (this.canPreview) {
        this.previewSrc = null
        this.previewShow = true
        this.previewTitle = image.title
        this.previewSrc = await getImageCover(image.file, { width: 640 })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.c-post-feed-images {

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
    }

    .upload-placeholder {
      background-color: #fff;
      border: 2px dashed @border-color-base;
      color: @border-color-base;
      cursor: copy;
    }
  }

  .preview-wrap {
    .preview-iamge {
      width: 100%;
    }
  }
}
</style>
