<template>
  <div class="c-reference">
    <Component
      :is="refer"
      :source="source"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
import ReferenceFeed from './ReferenceFeed.vue'
import ReferenceNews from './ReferenceNews.vue'
import ReferenceGroup from './ReferenceGroup.vue'
import ReferencePost from './ReferencePost.vue'

const referMap = {
  'feeds': ReferenceFeed,
  'news': ReferenceNews,
  'groups': ReferenceGroup,
  'group-posts': ReferencePost,
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

  /deep/ .link {
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
