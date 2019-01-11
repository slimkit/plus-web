<template>
  <div v-if="type === 'dots'" class="c-loading dots">
    <template v-for="(i, index) in new Array(3)">
      <i :key="index" />
    </template>
  </div>
  <div v-else-if="type === 'circle'" class="c-loading circle">
    <template v-for="(i, index) in new Array(12)">
      <i :key="index" />
    </template>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    type: { type: String, default: 'dots', validator: val => ['dots', 'circle'].includes(val) },
    height: { type: Number, default: 64 },
  },
  computed: {
    style () {
      if (this.type === 'circle') {
        return {
          maxHeight: this.height,
          maxWidth: this.height,
        }
      } else {
        return {
          height: this.height,
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.c-loading {
  display: flex;
  align-items: center;
  justify-content: center;

  &.dots > i {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: @primary-color;
    margin: 0 6px;
    animation: scale 1s infinite ease-in-out;

    &:nth-child(odd) {
      background-color: tint(@primary-color, 30%);
      animation-delay: 0.5s;
    }
  }

  &.circle {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;

    > i {
      position: absolute;
      left: 50%;
      bottom: calc(~"50% - 18px");
      margin-left: -1px;
      width: 2px;
      height: 8px;
      border-radius: 2px;
      transform-origin: center -10px;
      animation: loading-fade 1.1s infinite linear;

      .generate-i(12);
      .generate-i(@n, @i: 1) when (@i =< @n) {
        &:nth-child(@{i}) {
          animation-delay: 0.1s * (@i - 1);
          transform: rotate(30deg * (@i - 1));
        }
        .generate-i(@n, (@i + 1))
      }
    }
  }
}
</style>

<style lang="less">
@keyframes scale {
  0%, 100% {
    transfrom: scale(1);
  }
  50% {
    transform: scale(0.66);
  }
}

@keyframes loading-fade {
  0% {
    background-color: #cacaca;
  }
  100% {
    background-color: rgba(255, 255, 255, 0);
  }
}
</style>
