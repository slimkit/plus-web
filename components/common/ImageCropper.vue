<template>
  <div class="c-image-cropper">
    <Modal
      v-model="show"
      :title="title"
      :footer-hide="!image"
      :width="width * (preview ? 2 : 1) * 1.25 + 32"
      :transfer="false"
    >
      <template v-slot:default>
        <div class="modal-container" :style="{width: `${width * 1.25 * (preview ? 2 : 1)}px`, height: `${height * 1.2}px`}">
          <input
            ref="input"
            type="file"
            class="hidden"
            @change="handleSelectFile"
          >
          <div :class="['cropper-wrap', {single: !preview}]">
            <div class="placeholder" @click="$refs.input.click()">
              <svg class="icon xl"><use xlink:href="#icon-ico_upload" /></svg>
              点击上传文件
            </div>
            <VueCropper
              v-if="image"
              ref="cropper"
              :img="image"
              v-bind="cropperProps"
              @real-time="onCropMoving"
            />
          </div>
          <div v-if="preview" class="preview-wrap">
            <div
              class="preview"
              :class="{circle}"
              v-html="html"
            />
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <div class="footer">
          <div class="tools">
            <Button size="small" @click="$refs.input.click()">更换图片</Button>
            <div class="devide" />
            <Button size="small" @click="$refs.cropper.changeScale(1)"><span class="icon">+</span></Button>
            <Button size="small" @click="$refs.cropper.changeScale(-1)"><span class="icon">-</span></Button>
            <div class="devide" />
            <Button size="small" @click="$refs.cropper.rotateLeft()"><span class="icon">↺</span></Button>
            <Button size="small" @click="$refs.cropper.rotateRight()"><span class="icon">↻</span></Button>
          </div>
          <div class="tools">
            <Button
              size="small"
              :long="true"
              type="primary"
              @click="onConfirm"
            >
              确定
            </Button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { getObjectUrl } from '@/utils/file'

export default {
  name: 'ImageCropper',
  props: {
    title: { type: String, default: null },
    circle: { type: Boolean, default: false },
    preview: { type: Boolean, default: false },
    width: { type: Number, default: 640 },
    height: { type: Number, default: 640 },
    fixed: { type: Boolean, default: false },
  },
  data () {
    return {
      show: false,
      image: null,
      html: '预览',
      fileName: '',
    }
  },
  computed: {
    cropperProps () {
      return {
        mode: 'cover',
        autoCrop: true, // 自动打开截图框
        autoCropWidth: this.width,
        autoCropHeight: this.height,
        fixed: this.fixed,
        fixedBox: this.fixed,
        fixedNumber: [this.width, this.height],
        'center-box': true, // 截图框限制在图片里面
        canMoveBox: !this.fixed,
        maxImageSize: Math.max(this.width, this.height),

        ...this.$attrs,
      }
    },
  },
  watch: {
    show (val) {
      if (!val) this.close()
    },
  },
  methods: {
    open () {
      this.show = true
    },
    close () {
      this.image = null
      this.html = '预览'
      this.show = false
    },
    handleSelectFile (event) {
      const file = this.$refs.input.files[0]
      this.fileName = file.name
      this.image = getObjectUrl(file)
    },
    onCropMoving (data) {
      this.html = data.html
    },
    onConfirm () {
      this.$refs.cropper.getCropBlob(blob => {
        if (this.$attrs['output-type'] === 'png') {
          const isPng = this.fileName.match(/\.png$/)
          if (!isPng) this.fileName += '.png'
        } else {
          const isJpeg = this.fileName.match(/\.jpe?g$/)
          if (!isJpeg) this.fileName += '.jpg'
        }
        this.$emit('after-crop', blob, this.fileName)
        this.close()
      })
    },
  },
}
</script>

<style lang="less" scoped>
.c-image-cropper {
  position: relative;

  .hidden {
    position: absolute;
    z-index: -10;
    opacity: 0;
  }
  .modal-container {
    display: flex;
    justify-content: center;
  }

  .cropper-wrap {
    position: relative;
    flex: none;
    width: 50%;
    height: 100%;

    &.single {
      width: 100%;
    }

    .placeholder {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      background-color: @background-color-base;
      cursor: pointer;
    }
  }

  .preview-wrap {
    position: relative;
    flex: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;

    .preview.circle {
      overflow: hidden;
      border-radius: 1000px;
    }
  }

  .footer {
    display: flex;

    .tools {
      display: flex;
      justify-content: space-around;
      width: 50%;
      padding: 0 5%;

      /deep/ .ivu-btn {
        height: 42px;
        margin: 0 4px;
        padding: 0 12px;
      }

      .icon {
        font-size: 200%;
        font-family: Consolas, "Courier New", Courier, FreeMono, monospace;
      }

      .devide {
        margin: auto;
      }
    }
  }

}
</style>
