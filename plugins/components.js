/**
 * 注入全局组件
 * 使其可在每个 vue components 中使用
 */

import Vue from 'vue'
import components from '@/components/global'

const install = function (Vue) {
  if (install.installed) return

  Object.keys(components).forEach(key => {
    Vue.component(key, components[key])
  })
}

Vue.use({ install })
