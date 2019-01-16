/**
 * 全局过滤器
 */
import Vue from 'vue'
import { fromNow } from '@/utils/date'

const placeholder = (value, label) => {
  if (value) return value
  switch (label) {
    case 'bio':
      return '这家伙很懒，什么都没留下'
    default:
      return value
  }
}

const filter = {
  fromNow,
  placeholder,
}

const install = function (Vue) {
  if (install.installed) return
  Object.keys(filter).forEach(key => {
    Vue.filter(key, filter[key])
  })
}
Vue.use({ install })
