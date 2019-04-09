import Vue from 'vue'
import '@/assets/less/index.less'

import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Checkbox,
  Carousel,
  CarouselItem,
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Poptip,
  Tooltip,
  Message,
  Modal,
  Notice,
  Spin,
  Tag,
  AutoComplete,
  Select,
  Option,
  OptionGroup,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from 'iview'

const components = {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Checkbox,
  Carousel,
  CarouselItem,
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Poptip,
  Tooltip,
  Modal,
  Spin,
  Tag,
  AutoComplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
}

const install = function (Vue, opts = {}) {
  if (install.installed) return

  Object.keys(components).forEach(key => {
    Vue.component(`I${key}`, components[key])
  })

  // 这两个需要特殊处理，不使用前缀`I`, 因为如果加了前缀使用会异常
  Vue.component('Select', Select)
  Vue.component('Option', Option)
  Vue.component('OptionGroup', OptionGroup)

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
