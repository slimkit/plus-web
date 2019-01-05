import Vue from 'vue'
import '@/assets/less/index.less'

import {
  Button,
  Form,
  FormItem,
  Input,
  Poptip,
  Message,
  Modal,
  Notice,
} from 'iview'

const components = {
  Button,
  Form,
  FormItem,
  Input,
  Poptip,
}

const install = function (Vue, opts = {}) {
  if (install.installed) return

  Object.keys(components).forEach(key => {
    Vue.component(`I${key}`, components[key])
  })

  Vue.prototype.$Message = Message
  Vue.prototype.$Modal = Modal
  Vue.prototype.$Notice = Notice

  Vue.prototype.$IVIEW = {
    size: opts.size || '',
    transfer: 'transfer' in opts ? opts.transfer : '',
  }
}

Vue.use({ install })

export {
  Message,
  Notice,
  Modal,
}
