/**
 * 全局指令
 */
import Vue from 'vue'
import directives from '@/directives'

const install = function (Vue) {
  if (install.installed) return
  Object.keys(directives).forEach(key => {
    Vue.directive(key, directives[key])
  })
}
Vue.use({ install })
