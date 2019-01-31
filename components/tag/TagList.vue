<template>
  <ul class="c-tag-list">
    <TagItem
      v-for="tag in tags"
      :key="tag.id"
      :tag="tag"
      :selected="selected || isSelected(tag.id)"
      :closeable="closeable"
      :text="tag.name"
      :size="size"
      @click.native="onClick(tag)"
    />
  </ul>
</template>

<script>
import TagItem from './TagItem.vue'

export default {
  name: 'TagList',
  components: {
    TagItem,
  },
  props: {
    tags: { type: Array, default: () => [] },
    selected: { type: Boolean, default: false },
    selectedTags: { type: Array, default: () => [] },
    closeable: { type: Boolean, default: false },
    size: { type: String, default: 'def' },
  },
  methods: {
    isSelected (tagId) {
      const selected = this.selectedTags.map(tag => tag.id)
      return selected.includes(tagId)
    },
    onClick (tag) {
      this.$emit('click', tag)
      this.isSelected(tag.id) || this.closeable
        ? this.onRemove(tag)
        : this.onAppend(tag)
    },
    onAppend (tag) {
      this.$emit('append', tag)
    },
    onRemove (tag) {
      this.$emit('remove', tag)
    },
  },
}
</script>

<style lang="less" scoped>
.c-tag-list {
  display: flex;
  flex-wrap: wrap;

  > li {
    display: inline-block;
    margin-right: 8px;
    margin-bottom: 8px;
  }
}
</style>
