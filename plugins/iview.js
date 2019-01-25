import Vue from 'vue'
import '@/assets/less/index.less'

import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Poptip,
  Message,
  Modal,
  Notice,
  Spin,
  Tag,
  AutoComplete,
} from 'iview'

const components = {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Poptip,
  Modal,
  Spin,
  Tag,
  AutoComplete,
}

const install = function (Vue, opts = {}) {
  if (install.installed) return

  Object.keys(components).forEach(key => {
    Vue.component(`I${key}`, components[key])
  })

  Vue.prototype.$Message = Message
  Vue.prototype.$Modal = Modal
  Vue.prototype.$Notice = Notice
  Vue.prototype.$Spin = Spin

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
