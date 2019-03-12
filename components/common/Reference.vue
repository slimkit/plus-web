<template>
  <div class="c-reference">
    <Component :is="refer" :source="source" />
  </div>
</template>

<script>
import ReferenceFeed from './ReferenceFeed.vue'

const referMap = {
  feed: ReferenceFeed,
}

export default {
  name: 'Reference',
  props: {
    type: { type: String, required: true },
    source: { type: Object, required: true },
  },
  computed: {
    refer () {
      return referMap[this.type]
    },
  },
}
</script>

<style lang="less" scoped>
.c-reference {
  position: relative;
  padding: 12px;
  margin-bottom: 12px;
  background-color: @background-color-base;

  /deep/ .media {
    color: @primary-color;
  }
}
</style>
