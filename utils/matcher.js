
/**
 * 匹配纯文本中的 at 用户信息
 * @example // 匹配 at 用户信息，在用户前后加入空白字符 \u00ad
 * content.replace(textAtMatcher, '\u00ad$1\u00ad$2')
 */
export const textAtMatcher = /(@[^\r\n\t\v\f@ ]+)(\s?)/g

/**
 * 匹配纯文本中含有空白字符 \u00ad 包裹的字符串
 * @example // 匹配 at 用户信息，将用户加入链接
 * body.replace(shyMatcher, function(matches, username) {
 *   var url = `${BASE_URL}/user/${username}`
 *   return `<a href="${url}">${username}</a>`
 * });
 */
export const shyMatcher = /\u00ad@([^/]+?)\u00ad/gi

/**
 * 匹配文本中的超级链接
 */
export const linkMatcher = /((?:https?|mailto|ftp):\/\/([^\s<'"“”‘’，。}]*)?)/gi
