import Vue from 'vue'
import '@/assets/less/index.less'

import {
  Button,
  Form,
  FormItem,
  Input,
} from 'iview'

const components = {
  Button,
  Form,
  FormItem,
  Input,
}

const install = function (Vue, opts = {}) {
  if (install.installed) return

  Object.keys(components).forEach(key => {
    Vue.component(`I${key}`, components[key])
  })

  Vue.prototype.$IVIEW = {
    size: opts.size || '',
    transfer: 'transfer' in opts ? opts.transfer : '',
  }
}

Vue.use({ install })
