<template>
  <div class="c-image-cropper">
    <IModal
      v-model="show"
      :title="title"
      :width="preview ? 960 : 720"
      :footer-hide="!image"
      :transfer="false"
    >
      <template v-slot:default>
        <div v-if="show" class="modal-container">
          <input
            ref="input"
            type="file"
            class="hidden"
            @change="handleSelectFile"
          >
          <div :class="['cropper-wrap', {single: !preview}]" @click.once="$refs.input.click()">
            <div class="placeholder">
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
            <IButton size="small" @click="$refs.input.click()">更换图片</IButton>
            <div class="devide" />
            <IButton size="small" @click="$refs.cropper.changeScale(1)"><span class="icon">+</span></IButton>
            <IButton size="small" @click="$refs.cropper.changeScale(-1)"><span class="icon">-</span></IButton>
            <div class="devide" />
            <IButton size="small" @click="$refs.cropper.rotateLeft()"><span class="icon">↺</span></IButton>
            <IButton size="small" @click="$refs.cropper.rotateRight()"><span class="icon">↻</span></IButton>
          </div>
          <div class="tools">
            <IButton
              size="small"
              :long="true"
              type="primary"
            >
              确定
            </IButton>
          </div>
        </div>
      </template>
    </IModal>
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
  },
  data () {
    return {
      show: false,
      image: null,
      html: '',
    }
  },
  computed: {
    cropperProps () {
      return {
        ...this.$attrs,
        autoCrop: true, // 自动打开截图框
        autoCropWidth: '1000',
        autoCropHeight: '1000',
        centerBox: true, // 截图框限制在图片里面
      }
    },
  },
  methods: {
    open () {
      this.show = true
    },
    close () {
      this.show = false
    },
    handleSelectFile (event) {
      const file = this.$refs.input.files[0]
      this.image = getObjectUrl(file)
    },
    onCropMoving (data) {
      this.html = data.html
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
    height: 400px;
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
