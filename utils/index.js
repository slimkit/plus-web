/**
 * 空函数
 */
export const noop = () => {}

/**
 * api 默认限制返回条数
 */
export const limit = 15

/**
 * 获取列表最后一条数据的字段 默认为 ID
 * 一般用于加载更多是入参
 *
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {Object[]} list
 * @param {string} [field='id']
 * @returns
 */
export function getLastField (list, field = 'id') {
  if (!list.length) return undefined
  const last = [...list].pop() || {}
  if (typeof last === 'object') return last[field]
  else return last
}

/**
 * 错误消息处理
 * @return {string} message
 */
export const errorMessageHandler = content => {
  if (typeof content === 'string') return content
  if (content instanceof Object) {
    if (content.message instanceof Array) return content.message[0]
    return content.message
  }
  return content
}
