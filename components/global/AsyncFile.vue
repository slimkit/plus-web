<template>
  <div class="c-async-file" :class="type">
    <img
      v-if="type === 'image'"
      class="async-image"
      :src="src"
    >
  </div>
</template>

<script>
export default {
  name: 'AsyncFile',
  props: {
    type: { type: String, default: 'image' },
    file: { type: Object, required: true },
    classes: { type: null, default: '' },
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
      const { url } = await this.$axios.$get(`/files/${this.file.file}?json=1`)
      this.src = url
    },
  },
}
</script>

<style lang="less" scoped>
.c-async-file {
  .async-image {
    max-width: 100%;
  }
}
</style>
