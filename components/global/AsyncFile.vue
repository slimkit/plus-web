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
      const id = this.file.file || this.file.id
      let url = `${process.env.apiURL}/files/${id}`

      // query
      const paramsString = new URLSearchParams()
      if (this.maxWidth) paramsString.append('w', this.maxWidth)
      if (this.maxHeight) paramsString.append('h', this.maxHeight)
      if (this.quility) paramsString.append('q', this.quility)
      if (this.blur) paramsString.append('b', this.blur)
      if (paramsString.toString()) url += `?${paramsString.toString()}`
      return url
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
