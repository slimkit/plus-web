<template>
  <img
    v-if="type === 'image'"
    v-lazyload="src"
    class="c-async-file"
    :class="type"
  >
  <div
    v-else-if="type==='image-wrap'"
    v-lazyload:background="src"
    class="c-async-file"
    :class="type"
  />
</template>

<script>
import { getFileUrl } from '@/utils/file'

export default {
  name: 'AsyncFile',
  props: {
    type: { type: String, default: 'image', validator: val => ['image', 'image-wrap'].includes(val) },
    file: { type: Object, required: true },
    maxWidth: { type: Number, default: null },
    maxHeight: { type: Number, default: null },
    quility: { type: Number, default: null },
    blur: { type: Number, default: null },
  },
  computed: {
    src () {
      const fileId = this.file.file || this.file.id
      return getFileUrl(fileId, {
        w: this.maxWidth,
        h: this.maxHeight,
        blur: this.blur,
        quility: this.quility,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.c-async-file {
  max-width: 100%;

  &.image-wrap {
    width: 100%;
    height: 100%;
    background: @normal-color center / cover no-repeat;
  }
}
</style>
