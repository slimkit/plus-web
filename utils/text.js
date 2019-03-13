import { shyMatcher } from './matcher'

/**
 * 将字符串中的 at 信息抽取出来, 用链接包裹
 *
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {string} string
 * @returns {string}
 */
export function convertAtHTML (string) {
  return string.replace(shyMatcher, function (m, username) {
    var url = `${process.env.NUXT_ENV_PATH_PREFIX}user/${username}`
    return `<a href="${url}">@${username}</a>`
  })
}
