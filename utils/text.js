/**
 * 获取字符串长度 中文字符记2 英文字符记1
 * @param {string} string
 * @returns {number}
 */
export function getLength (string) {
  let realLength

  for (let i = 0; i < string.length; i++) {
    const charCode = string.charCodeAt(i)
    realLength += (charCode >= 0 && charCode <= 128) ? 1 : 2
  }
  return realLength
}
