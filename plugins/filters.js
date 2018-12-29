/**
 * 全局过滤器
 */
import Vue from 'vue'
import { fromNow } from '@/utils/date'

const filter = {
  fromNow,
}

const install = function (Vue) {
  if (install.installed) return
  Object.keys(filter).forEach(key => {
    Vue.filter(key, filter[key])
  })
}
Vue.use({ install })
