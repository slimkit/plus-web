<template>
  <li
    class="c-post-feed-images-item"
    :class="image.status"
    :style="{backgroundImage: `url(${image.preview})`}"
    :title="uploadStatusMap[image.status]"
    @click="onPreview(image)"
  >
    <svg class="icon delete" @click.stop="onDelete"><use xlink:href="#icon-close" /></svg>
    <span
      v-if="needPay"
      class="amount-wrap"
      @click.stop="onSetAmount"
    >
      <svg class="icon"><use xlink:href="#icon-money" /></svg>
      {{ image.amount || '设置金额' }}
    </span>

    <template v-if="image.status === 'uploading'">
      <Loading type="circle" @click.stop="onReupload" />
    </template>

    <template v-else-if="image.status === 'error'">
      <svg class="icon" @click.stop="onReupload">
        <use xlink:href="#icon-warning" />
      </svg>
    </template>
  </li>
</template>

<script>
const uploadStatusMap = {
  pending: '等待上传',
  uploading: '上传中...',
  success: '上传成功',
  error: '出错了，点击重新上传',
}

export default {
  name: 'PostFeedImagesItem',
  props: {
    index: { type: Number, required: true },
    image: { type: Object, required: true },
    needPay: { type: Boolean, default: false },
  },
  data () {
    return {
      uploadStatusMap,
    }
  },
  methods: {
    onPreview (image) {
      this.$emit('preview', image)
    },
    onDelete () {
      this.$emit('delete', this.index)
    },
    onImageReupload () {
      this.$emit('reupload', this.index)
    },
    onSetAmount () {
      this.$emit('set-amount', this.index)
    },
  },
}
</script>

<style lang="less" scoped>
.c-post-feed-images-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.zoom {
    cursor: zoom-in;
  }

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

  .amount-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2px 0;
    background-color: rgba(0, 0, 0, .4);
    color: #fff;
    text-align: center;
    font-size: @font-size-small;
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
</style>
