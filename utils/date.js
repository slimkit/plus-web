/**
 * Date Utilities
 * 处理时间的工具类
 * @typedef {Date|string|number} DateLike
 */

/**
 * UTC 时间转化为祖鲁时间
 * 避免使用 new Date() 时产生时区时差
 *
 * @author mutoe <mutoe@foxmail.com>
 * @param {DateLike} date
 * @returns {string}
 * @example const date = "2018-12-24 10:06:48"
 *          toZuluTimezone(date) // -> "2018-12-24T10:06:48Z"
 */
export function toZuluTimezone (date) {
  const matcher = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/
  if (!matcher.test(date)) return date
  return date.replace(matcher, '$1T$2Z')
}

/**
 * 判断目标日期是否是昨天
 *
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {DateLike} target
 * @returns {boolean}
 */
export function isYesterday (target) {
  const date = new Date()
  const today = +new Date(date.getFullYear(), date.getMonth(), date.getDate()) // 今日凌晨
  const yesterday = +new Date(today - 1000 * 24 * 3600) // 昨日凌晨
  target = +new Date(target)
  return target < today && target > yesterday
}

/**
 * 获取目标时间到当前时间的时间差
 *
 * @author mutoe <mutoe@foxmail.com>
 * @param {DateLike} target
 * @param {Object} [options]
 * @param {boolean} [options.full=false] 是否显示完整时间
 * @returns {string}
 */
export function fromNow (target, options = {}) {
  const zulu = toZuluTimezone(target)
  const date = new Date(zulu)
  const offset = (new Date() - new Date(date)) / 1000
  if (Number.isNaN(offset)) return target
  let relative = offset

  // 今天
  if (relative < 60) return '1分钟内'
  relative = Math.floor(relative / 60) // min
  if (relative < 60) return `${relative}分钟前`
  relative = Math.floor(relative / 60) // hour
  if (relative < 24) return `${relative}小时前`

  // 超过 1 天
  const timeString = date.toTimeString().substr(0, 5)
  relative = Math.floor(relative / 24) // day
  if (isYesterday(date)) return `昨天 ${timeString}`
  if (relative < 9) return `${relative}天前`

  // 超过 9 天
  if (options.full) {
    return `${date.toLocaleDateString().replace(/\//g, '-')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  return `${date.getMonth() + 1}-${date.getDate()}`
}
