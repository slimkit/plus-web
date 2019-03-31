import xss from 'xss'
import { shyMatcher, linkMatcher } from './matcher'

/**
 * 过滤文本中的 HTML 标签
 * @param {string} htmlString
 * @returns {string}
 */
export function filterHTMLTags (htmlString) {
  return htmlString.replace(/<[^>]+>|&[^>]+;/g, '').trim()
}

/**
 * 将字符串中的 at 信息抽取出来, 用链接包裹
 *
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {string} string
 * @returns {string}
 */
export function convertAtHTML (string) {
  string = xss(string)
  return string.replace(shyMatcher, function (m, username) {
    var url = `${process.env.NUXT_ENV_PATH_PREFIX}user/${username}`
    return `<a class="link-at-user" href="${url}">@${username}</a>`
  })
}

/**
 * 将链接替换为“访问链接+”
 * @param {string} string
 * @returns {string}
 */
export function convertLinkHTML (string) {
  string = xss(string)
  return string.replace(linkMatcher, `<a class="text-link" href="$1" target="_blank">访问链接+</a>`)
}
