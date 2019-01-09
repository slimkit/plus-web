<template>
  <img
    v-if="type === 'image'"
    class="c-async-file"
    :class="type"
    :src="src"
  >
</template>

<script>
export default {
  name: 'AsyncFile',
  props: {
    type: { type: String, default: 'image' },
    file: { type: Object, required: true },
    maxWidth: { type: Number, default: null },
    maxHeight: { type: Number, default: null },
    quility: { type: Number, default: null },
    blur: { type: Number, default: null },
  },
  data: function () {
    return {
      src: false,
    }
  },
  mounted () {
    this.getFileURL()
  },
  methods: {
    async getFileURL () {
      const id = this.file.file || this.file.id
      let url = `${process.env.apiURL}/files/${id}`

      // query
      const paramsString = new URLSearchParams()
      if (this.maxWidth) paramsString.append('w', this.maxWidth)
      if (this.maxHeight) paramsString.append('h', this.maxHeight)
      if (this.quility) paramsString.append('q', this.quility)
      if (this.blur) paramsString.append('b', this.blur)
      if (paramsString.toString()) url += `?${paramsString.toString()}`

      this.src = url
    },
  },
}
</script>

<style lang="less" scoped>
.c-async-file {
  max-width: 100%;
}
</style>
