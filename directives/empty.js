/**
 * 空内容
 *
 * @example <div v-empty:content>
 */

const supportType = ['content', 'search']
const textMap = {
  content: '暂无相关内容',
  search: '无搜索结果，换个词试试 ？',
}

function onBind (el, binding) {
  const type = binding.arg || 'content'
  if (!supportType.includes(type)) {
    throw new Error(`[custom directive warning]: directive "v-empty" is not support argument "${type}"`)
  }
  el.classList.add(`v-empty-${type}`)

  const placeholder = binding.value || textMap[type]
  el.append(placeholder)
}

export default {
  bind: onBind,
}
