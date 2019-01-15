import axios from 'axios'
import { hashFile } from './file'

const localUploadInstance = axios.create()

export async function createUploadTask (file) {
  return $nuxt.$axios.$post('/storage', {
    filename: file.name,
    size: file.size,
    mime_type: file.type,
    storage: {
      channel: 'public',
    },
    hash: await hashFile(file),
  })
}

async function uploadByPut (task, file) {
  return localUploadInstance.put(task.uri, file, {
    headers: task.headers,
  })
}

async function uploadByPost (task, file) {
  return localUploadInstance.post(task.uri, file, {
    headers: task.headers,
  })
}

/**
 * 启动上传
 * @export
 * @param {File} file
 * @returns
 */
export default async function (file) {
  const task = await createUploadTask(file)

  switch (task.method) {
    case 'PUT':
      await uploadByPut(task, file)
      break
    case 'POST':
      await uploadByPost(task, file)
      break
    default:
      throw new Error('不支持的上传方式')
  }

  return task.node
}
