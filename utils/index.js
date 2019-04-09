import _ from 'lodash'
import plueMessageBundle from 'plus-message-bundle'

/**
 * 空函数
 */
export const noop = () => {}

/**
 * api 默认限制返回条数
 */
export const limit = 15

/**
 * 判断一个变量是否为数字
 * @param {*} val
 */
export const isNumber = val => {
  if (typeof val === 'number') return true
  else if (typeof val !== 'string') return false
  else return /^\d+$/.test(val)
}

/**
 * 判断是否是 IE 浏览器
 */
export function isIE () {
  if (process.client) {
    return !!window.ActiveXObject || 'ActiveXObject' in window
  }
  return null
}

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
 * ThinkSNS Plus 消息解析器，获取顶部消息.
 *
 * @author Seven Du <shiweidu@outlook.com>
 * @param {Object} message
 * @param {string} [defaultMessage]
 * @return {string}
 */
export function errorMessageHandler (message, defaultMessage) {
  return plueMessageBundle(message, defaultMessage).getMessage()
}

/**
 * 移除一段文本中的 HTML 标签
 * @param {string} content
 * @returns {string}
 */
export const removeHTMLTags = content => {
  return content.replace(/<[^>]+>|&[^>]+;/g, ' ').trim()
}
