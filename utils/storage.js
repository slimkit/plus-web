/**
 * 轻量级浏览器存储事件工具类
 * storage events 来自 Plus SPA 端
 * cookie 来自 js-cookie
 */

// 存储 key 前缀，适用于 localStorage 和 sessionStorage
const STORAGE_PREFIX = process.env.NUXT_ENV_STORAGE_PREFIX || 'plus_'

// localStorage
export const local = {
  get: getItem,
  set: setItem,
  has: hasItem,
  remove: removeItem,
  clear: clearItems,
}

// sessionStorage
export const session = {
  get: (...args) => getItem(...args, true),
  set: (...args) => setItem(...args, true),
  has: (...args) => hasItem(...args, true),
  remove: (...args) => removeItem(...args, true),
  clear: (...args) => clearItems(...args, true),
}

// cookie
export const cookie = {
  get: getCookie,
  set: setCookie,
  remove: removeCookie,
}

function isSupport () {
  try {
    return (
      window.sessionStorage.setItem('PlusTest', 'lalala'),
      window.sessionStorage.removeItem('PlusTest'),
      true
    )
  } catch (err) {
    if (process.client) {
      console.warn('你的浏览器不支持本地存储') // eslint-disable-line no-console
    }
    return false
  }
}

function getItem (key, session = false) {
  if (!isSupport()) return false
  const store = session ? 'sessionStorage' : 'localStorage'
  if (hasItem(key, session)) {
    try {
      return JSON.parse(window[store][STORAGE_PREFIX + key])
    } catch (error) {
      return window[store][STORAGE_PREFIX + key]
    }
  }
  return null
}

function setItem (key, value, session = false) {
  if (!isSupport()) return false
  const store = session ? 'sessionStorage' : 'localStorage'
  value = JSON.stringify(value)
  window[store][STORAGE_PREFIX + key] = value
}

function hasItem (key, session = false) {
  if (!isSupport()) return false
  const store = session ? 'sessionStorage' : 'localStorage'
  if (window[store][STORAGE_PREFIX + key]) return true
  return false
}

function removeItem (key, session = false) {
  if (!isSupport()) return false
  const store = session ? 'sessionStorage' : 'localStorage'
  window[store] &&
    window[store][STORAGE_PREFIX + key] &&
    window[store].removeItem(STORAGE_PREFIX + key)
}

function clearItems (session = false) {
  if (!isSupport()) return false
  const store = session ? 'sessionStorage' : 'localStorage'
  window[store].clear()
}

function getCookie (key, cookie) {
  if (!cookie && typeof document === 'undefined') return
  const jar = {}
  cookie = cookie || document.cookie
  const cookies = cookie ? cookie.split('; ') : []

  function decode (s) {
    return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
  }

  for (let i = 0; i < cookies.length; i++) {
    const parts = cookies[i].split('=')
    let cookie = parts.slice(1).join('=')
    try {
      const name = decode(parts[0])
      cookie = decode(cookie)
      jar[name] = cookie
      if (key === name) break
    } catch (e) {}
  }
  return key ? jar[key] : jar
}

/**
 * 设置 cookie
 *
 * @param {string} key
 * @param {string} value
 * @param {Object} attributes
 * @param {string} [attributes.path=/]
 * @param {number|Date} [attributes.expires] 为数字时单位为分
 * @returns {string} cookie string
 */
function setCookie (key, value, attributes) {
  if (typeof document === 'undefined') return
  const path = process.env.NUXT_ENV_PATH_PREFIX || '/'
  attributes = Object.assign({ path }, attributes)
  if (typeof attributes.expires === 'number') {
    attributes.expires = new Date(+new Date() + attributes.expires * 60 * 1000)
  }
  attributes.expires = attributes.expires ? attributes.expires.toUTCString() : ''
  try {
    var result = JSON.stringify(value)
    if (/^[{[]/.test(result)) value = result
  } catch (e) {}
  value = encodeURIComponent(String(value))
    .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent)
  key = encodeURIComponent(String(key))
    .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape)
  var stringifiedAttributes = ''
  for (var attributeName in attributes) {
    if (!attributes[attributeName]) continue
    stringifiedAttributes += '; ' + attributeName
    if (attributes[attributeName] === true) continue
    stringifiedAttributes += '=' + attributes[attributeName].split(';')[0]
  }
  return (document.cookie = key + '=' + value + stringifiedAttributes)
}

function removeCookie (key, attributes = {}) {
  setCookie(key, '', Object.assign(attributes, { expires: -1 }))
}
