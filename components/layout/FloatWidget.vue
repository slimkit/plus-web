<template>
  <aside v-once class="c-float-widget">
    <ul class="float-items">
      <li v-return-top="300" class="float-item return-top">
        <svg class="icon">
          <use xlink:href="#icon-uptop" />
        </svg>
      </li>
      <li class="float-item">
        <svg class="icon">
          <use xlink:href="#icon-phone" />
        </svg>
      </li>
    </ul>
  </aside>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'FloatWidget',
  directives: {
    returnTop (el, binding) {
      // 点击返回顶部
      el.addEventListener('click', function (event) {
        const scroll = function () {
          let top = document.documentElement.scrollTop || document.body.scrollTop
          const speed = Math.floor(-top / 3)
          if (top > 40) {
            requestAnimationFrame(scroll)
          } else {
            top = 0
          }
          document.documentElement.scrollTop = document.body.scrollTop = top + speed
        }
        requestAnimationFrame(scroll)
      })

      // 滑动距离超过 binding.value 后才显示 (with throttle)
      window.addEventListener('scroll', _.throttle(function (event) {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop > binding.value) {
          el.classList.add('active')
        } else {
          el.classList.remove('active')
        }
      }, 20))
    },
  },
}
</script>

<style lang="less" scoped>
.c-float-widget {
  position: sticky;
  bottom: 15vh;
  left: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  max-width: @screen-lg;
  min-width: @screen-md;
  height: 0;
  padding: 0 32px;
  margin: 0 auto;
  overflow: visible;
  transition: all 0.4s ease;

  .float-items {
    display: flex;
    flex-direction: column-reverse;
    font-size: @font-size-large;

    .float-item {
      flex: none;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background-color: #dedede;
      color: #fff;
      margin-top: 12px;
      cursor: pointer;
      box-shadow: 0 0 8px rgba(#dedede, 0.4);

      &:first-child {
        margin-bottom: 36px;
      }

      svg {
        transition: all 0.3s;
      }

      &:hover svg {
        font-size: 120%;
      }
    }

    .return-top {
      position: relative;
      top: 40px;
      opacity: 0;
      background-color: @primary-color;
      transition: all .4s ease;
      pointer-events: none;
      font-size: 140%;

      &.active {
        top: 0;
        opacity: 1;
        pointer-events: auto;
      }
    }
  }
}

@media (min-width: @screen-lg + 48 * 2) {
  .c-float-widget {
    transform: translateX(48 + 32px)
  }
}
</style>
