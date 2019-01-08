/**
 * 空函数
 */
export const noop = () => {}

/**
 * api 默认限制返回条数
 */
export const limit = 15

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

export default {

}
