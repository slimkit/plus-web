<template>
  <div class="c-loadmore">
    <div class="loadmore-head" :class="{refreshing}">
      <Loading />
    </div>
    <div class="loadmore-main">
      <slot />
    </div>

    <!-- 加载触发器 -->
    <div v-loadmore.lazy="onTrigger" />

    <div
      v-if="showBottom && !refreshing"
      class="loadmore-foot"
      :class="{loading: loading || inBottom}"
    >
      <Loading v-if="loading" />
      <span v-else-if="noMore">没有更多</span>
      <span v-else>加载更多</span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { noop } from '@/utils'

// 预触发高度
const triggerHeight = 600

function onScroll (callback = noop, event) {
  const offsetY = this.getBoundingClientRect().top
  const innerHeight = window.innerHeight
  const trigger = offsetY - innerHeight - triggerHeight < 0
  if (trigger) callback(trigger)
}

export default {
  name: 'Loadmore',
  directives: {
    loadmore: {
      bind (el, binding) {
        const { modifiers } = binding
        const { lazy = false } = modifiers
        const fn = binding.value || (() => {})
        window.addEventListener('scroll', _.throttle(onScroll.bind(el, fn), lazy ? 200 : 20))
      },
      unbind () {
        window.removeEventListener('scroll', onScroll)
      },
    },
  },
  props: {
    autoLoad: { type: Boolean, default: true },
    showBottom: { type: Boolean, default: true },
    limit: { type: [Boolean, Number], default: 3 },
  },
  data () {
    return {
      noMore: false,
      refreshing: false,
      loading: false,
      inBottom: false,
    }
  },
  mounted () {
    if (this.autoLoad) this.beforeRefresh()
  },
  methods: {
    beforeRefresh () {
      if (this.refreshing) return
      this.refreshing = true
      this.$emit('refresh')
    },
    afterRefresh (noMore = true) {
      this.refreshing = false
      this.noMore = noMore
    },
    beforeLoadmore () {
      if (this.loading || this.refreshing || this.noMore) return
      this.loading = true
      this.$emit('loadmore')
    },
    afterLoadmore (noMore = true) {
      this.loading = false
      this.noMore = noMore
    },
    onTrigger (inView) {
      if (this.showBottom && inView) {
        this.inBottom = true
        this.beforeLoadmore()
      } else {
        this.inBottom = false
      }
    },
  },
}
</script>

<style lang="less" scoped>
.c-loadmore {
  transform: translate(0, 0); // 硬件加速

  .loadmore-head {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 0;
    opacity: 0;
    transition-property: height, opacity, transform;
    transition-duration: 0.3s;
    transition-timing-function: ease;
    transform: scaleY(0.3);
    overflow: hidden;

    &.refreshing {
      margin-bottom: 24px;
      height: 24px;
      opacity: 1;
      transform: scaleY(1);
    }

  }

  .loadmore-foot {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 0;
    margin-top: 24px;
    color: @disabled-color;
    opacity: 0;
    transition-property: height, opacity, transform;
    transition-duration: 0.3s;
    transition-timing-function: ease;
    transform: scaleY(0.3);
    overflow: hidden;

    &.loading {
      height: 24px;
      margin-top: 24px;
      opacity: 1;
      transform: scaleY(1);
    }
  }
}
</style>
