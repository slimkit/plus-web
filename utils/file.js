import md5 from 'js-md5'
import { cookie } from '@/utils/storage'

/**
 * 获取文件的 md5 hashed string
 * @author mutoe <mutoe@foxmail.com>
 * @param {File} file
 * @returns {string} hashed string
 */
export const hashFile = file => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = event => {
      const arrayBuffer = event.target.result
      const hash = md5(arrayBuffer)
      resolve(hash)
    }
    reader.readAsArrayBuffer(file)
  })
}

/**
 * 获取图片文件的预览
 * GIF 图像取第一帧
 * @author mutoe <mutoe@foxmail.com>
 * @param {File} file
 * @param {Object} [limit={}] 不填则不限制
 * @param {number} [limit.width] 最大宽度
 * @param {number} [limit.height] 最大高度
 * @returns {Blob} Blob 对象
 */
export const getImageCover = async (file, limit = {}) => {
  return new Promise(resolve => {
    const image = new Image()
    image.onload = () => {
      let width = image.width
      let height = image.height

      if (width > limit.width) {
        const ratio = width / limit.width
        width /= ratio
        height /= ratio
      } else if (height > limit.height) {
        const ratio = height / limit.height
        width /= ratio
        height /= ratio
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      // 绘制图片帧（第一帧）
      canvas.getContext('2d').drawImage(image, 0, 0, width, height)
      const blob = canvas.toDataURL('image/png')
      return resolve(blob)
    }
    image.src = getObjectUrl(file)
  })
}

/**
 * 获取 Blob 对象的临时地址 （用于浏览器预览）
 * @author mutoe <mutoe@foxmail.com>
 * @param {Blob} blob
 * @returns {string} blob url 地址
 */
export const getObjectUrl = blob => {
  let url = null
  if (window.createObjectURL !== undefined) {
    // basic
    url = window.createObjectURL(blob)
  } else if (window.URL !== undefined) {
    // mozilla(firefox)
    url = window.URL.createObjectURL(blob)
  } else if (window.webkitURL !== undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(blob)
  }
  return url
}

/**
 * 获取图片的真实地址
 * @param {number|string} file || fileURL
 * @param {Object} [params]
 * @param {string} [params.type=file]
 * @param {number|string} [params.w] 最大宽度
 * @param {number|string} [params.h] 最大宽度
 * @param {number|string} [params.quility] 压缩质量
 * @param {number|string} [params.blur] 模糊
 */
export const getFileUrl = (file, params = {}) => {
  const paramsString = new URLSearchParams()
  let url = ''

  const { type = 'file' } = params
  if (type === 'file') {
    url = `${process.env.apiURL}/files/${file}`
    if (params.w) paramsString.append('w', params.w)
    if (params.h) paramsString.append('h', params.h)
    if (params.quility) paramsString.append('q', params.quility)
    if (params.blur) paramsString.append('b', params.blur)
    const token = cookie.get('access_token')
    if (token) paramsString.append('token', token)
  } else {
    url = file
    let rule = []
    if (params.w) rule.push(`w_${params.w}`)
    if (params.h) rule.push(`h_${params.h}`)
    if (params.quility) rule.push(`q_${params.quility}`)
    if (params.blur) rule.push(`b_${params.blur}`)
    if (rule.length) paramsString.append('rule', rule.join(','))
  }

  if (paramsString.toString()) url += `?${paramsString.toString()}`
  return url
}
