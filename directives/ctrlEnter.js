/**
 * ctrl+enter 键指令
 * 用于按下 ctrl+enter 时执行相应的方法
 * 兼容 windows、mac、linux
 * @example <textarea v-ctrl-enter="onSubmit" />
 */

const handler = (event, binding, vnode) => {
  if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
    vnode.context[binding.expression](event)
  }
}

export default {
  bind (el, binding, vnode) {
    el.addEventListener('keydown', event => handler(event, binding, vnode))
  },
  unbind (el) {
    el.removeEventListener('keydown', event => handler(event))
  },
}
