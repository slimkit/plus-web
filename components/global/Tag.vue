<template>
  <li class="c-tag" :class="[size, {selected}]">
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
    size: { type: String, default: 'def', validator: s => ['def', 'sm', 'lg'].includes(s) },
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
  margin: 0;
  border: none;
  background-color: @normal-color;
  cursor: pointer;

  &.def {
    padding: 4px 12px;
    font-size: @font-size-base;
  }

  &.sm {
    padding: 2px 6px;
    font-size: @font-size-small;
  }

  &.lg {
    padding: 6px 16px;
    font-size: @font-size-large;
  }

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
