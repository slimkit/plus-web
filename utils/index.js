import _ from 'lodash'

/**
 * 空函数
 */
export const noop = () => {}

/**
 * api 默认限制返回条数
 */
export const limit = 15

/**
 * 获取关注状态
 * @param {boolean} follower 被关注
 * @param {boolean} following 关注
 */
export const getFollowStatus = (follower = false, following = false) => {
  const followMap = {
    follow: { label: '关注' },
    followed: { label: '已关注' },
    each: { label: '互相关注' },
  }
  if (follower && following) return followMap.each
  return followMap[follower ? 'followed' : 'follow']
}

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
  const last = _.last(list) || {}
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
    let message
    const { errors } = content
    if (errors && Object.keys(errors).length) {
      // 处理 errors 消息
      message = Object.values(errors)[0]
    } else {
      // 处理普通的 message 消息
      message = content.message
    }
    if (message instanceof Array) return message[0]
    return message
  }
  return content
}
