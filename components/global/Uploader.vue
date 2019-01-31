<template>
  <div class="c-uploader">
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      :multiple="multiple"
      :accept="accept"
      @change="afterSelect"
    >
  </div>
</template>

<script>
/**
 * 文件上传对象
 * @typedef {Object} UploadObject
 * @property {File} file
 * @property {string} filename
 * @property {Blob} preview
 * @property {string} hash
 * @property {string} status enum:{pending, uploading, success, error}
 * @property {Object|Object[]} value 如果是multiple，则为数组，否则为对象
 * @property {Error} error
 */

import { hashFile, getImageCover } from '@/utils/file'
import uploadByStorage from '@/utils/upload'

const validatePreviewSize = obj => {
  if (obj.width && obj.width <= 0) return false
  if (obj.height && obj.height <= 0) return false
  return true
}

export default {
  name: 'Uploader',
  props: {
    /**
     * 文件类型
     * @property {string} type enum{file: 旧文件系统 file id, storage: 新文件系统的 storage file node}
     */
    type: { type: String, default: 'storage', validator: (type) => ['file', 'storage', 'blob'].includes(type) },
    value: { type: [Object, Array], default: () => ({}) }, // UploadObject 或其数组，取决于 multiple
    previewSize: { type: Object, default: () => ({ width: 1080 }), validator: validatePreviewSize }, // 预览图宽高限制 {width: undefined, height: undfined}
    readonly: { type: Boolean, default: false },
    accept: { type: String, default: null },
    multiple: { type: Boolean, default: false }, // 多图上传
    beforeUpload: { type: Function, default: files => files }, // 上传前回调， 可以在此裁切图片或者拦截，返回 falsy 则拦截
  },
  methods: {
    /**
     * 选择文件
     * @export
     */
    select () {
      if (this.readonly) return
      this.$refs.fileInput.click()
    },

    /**
     * 上传单个文件
     * @export
     * @param {UploadObject} file
     * @param {boolean} [retry=false] 是否为重新上传
     */
    async upload (file, retry = false) {
      // 如果非重新上传
      if (file.status === 'error' && !retry) return

      switch (this.type) {
        case 'file':
          return this.uploadByFile(file)
        case 'storage':
          return this.uploadByStorage(file)
        case 'blob':
          return this.getBlob(file)
      }
    },
    /**
     * update value
     */
    update (files, emitProp = 'input') {
      if (!this.multiple) files = files[0]
      this.$emit(emitProp, files)
    },
    async afterSelect (e) {
      let files = e.target.files || e.dataTransfer.files
      // FileList 转化为可遍历的数组
      files = Array.from(files)

      // 创建 upload 对象
      const promises = files.map(file => this.createObject(file))
      files = await Promise.all(promises)

      // 合并
      if (this.multiple) files = [...this.value, ...files]

      // 上传前处理
      const result = this.beforeUpload(files)
      if (!result) return
      files = (result instanceof Array) ? result : files // 返回的不是数组的话就使用原始值
      this.update(files)

      this.$nextTick(() => {
        this.onUpload(files)
      })
    },

    /**
     * 创建文件上传对象
     * @param {File} file
     * @returns {UploadObject}
     */
    async createObject (file) {
      const [preview, hash] = await Promise.all([
        getImageCover(file, this.previewSize),
        hashFile(file),
      ])
      return {
        file,
        filename: file.name,
        preview,
        hash,
        status: 'pending',
        value: null,
        error: null,
      }
    },
    /**
     * 批量上传
     * @param {UploadObject[]} files
     */
    async onUpload (files) {
      // 更新上传状态
      this.update(files.map(file => {
        file.status = 'uploading'
        return file
      }))

      // 并发上传
      const promises = files.map((file, index) => new Promise(resolve => {
        this.upload(file)
          .then(result => {
            if (!result) return resolve(file)

            Object.assign(file, result)
            this.$emit('update', file, index)
          })
          .catch(error => {
            file.error = error.message
            file.status = 'error'
            this.$emit('update', file, index)
          })
          .finally(() => {
            resolve(file)
          })
      }))
      files = await Promise.all(promises)

      // 全部文件上传完毕
      this.update(files, 'finish')
    },
    async getBlob (file) {
      file.value = file.file
      file.status = 'success'
      return file
    },
    /**
     * 旧文件上传
     * @param {UploadObject} file
     */
    async uploadByFile (file) {
      let fileId = null

      // 上传前检查服务器是否已存在该文件
      const { id } = await this.$axios.$get(
        `/files/uploaded/${file.hash}`,
        { validateStatus: s => [200, 404].includes(s) }
      )
      fileId = id

      // 上传文件
      if (!fileId) {
        const formData = new FormData()
        formData.append('file', file.file)
        const { id } = await this.$axios.$post('/files', formData)
        fileId = id
      }

      file.value = fileId
      file.status = 'success'
      return file
    },
    /**
     * 新文件上传
     * @param {UploadObject} file
     */
    async uploadByStorage (file) {
      const node = await uploadByStorage(file.file)
      file.value = node
      file.status = 'success'
      return file
    },
  },
}
</script>

<style lang="less" scoped>
.c-uploader {
  .hidden {
    display: none;
  }
}
</style>
