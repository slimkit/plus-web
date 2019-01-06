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
      // const { url } = await this.$axios.$get(`/files/${id}?json=1`, { progress: false })
      const url = `${process.env.apiURL}/files/${id}`
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
