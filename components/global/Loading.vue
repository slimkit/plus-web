<template>
  <div class="c-loading" :style="style">
    <i />
    <i />
    <i />
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    height: { type: Number, default: 64 },
  },
  computed: {
    style () {
      return {
        height: this.height,
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

  > i {
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
</style>
