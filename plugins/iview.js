import Vue from 'vue'
import iView from 'iview'
import locale from 'iview/dist/locale/zh-CN' // Change locale, check node_modules/iview/dist/locale
import '@/assets/less/index.less'

Vue.use(iView, {
  locale,
})
