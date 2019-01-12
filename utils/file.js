import md5 from 'js-md5'

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
