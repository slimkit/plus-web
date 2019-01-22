<template>
  <li class="c-tag" :class="{selected}">
    <span class="tag-text"><slot>{{ text }}</slot></span>
    <svg v-if="closeable" class="icon"><use xlink:href="#icon-close" /></svg>
  </li>
</template>

<script>
export default {
  name: 'Tag',
  props: {
    text: { type: String, default: '' },
    selected: { type: Boolean, default: false },
    closeable: { type: Boolean, default: false },
    size: { type: String, default: 'def' },
  },
  data () {
    return {

    }
  },
}
</script>

<style lang="less">
.c-tag {
  height: auto;
  padding: 4px 12px;
  margin: 0;
  border: none;
  background-color: @normal-color;
  font-size: @font-size-base;
  cursor: pointer;

  &.selected {
    color: @primary-color;
    background-color: tint(@primary-color, 90%);

    .icon {
      font-size: 90%;
      color: @primary-color;
    }
  }
}
</style>
