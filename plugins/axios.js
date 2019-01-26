/**
 * Nuxt axios 插件配置
 * TODO: 路由切换时取消正在进行的请求
 */

import { cookie } from '@/utils/storage'
import { errorMessageHandler } from '@/utils'
import { Message } from 'iview'

export default function ({ $axios, env, store, redirect }) {
  $axios.setHeader('Accept', 'application/json')

  $axios.onRequest(config => {
    if (process.client && config.loading) {
      $nuxt.$loading.start()
    }
    if (env.debug) {
      console.log(`[axios] request to ${config.url}`) // eslint-disable-line no-console
    }

    // auth
    const authToken = store.state.auth.token
    if (authToken) {
      config.headers.common['Authorization'] = `Bearer ${authToken}`
    }
  })

  $axios.onResponse(res => {
    const { config = {} } = res
    if (process.client && config.loading) {
      $nuxt.$loading.finish()
    }
  })

  $axios.onError(error => {
    const { config = {} } = error
    if (process.client && config.loading) {
      $nuxt.$loading.fail()
    }

    const code = parseInt(error.response && error.response.status)
    if (error && error.response) {
      switch (code) {
        case 400:
          error.tips = '错误请求'
          break
        case 401:
          error.tips = cookie.get('access_token')
            ? '登陆失效，请重新登录'
            : '请先登录'
          cookie.remove('access_token')
          redirect('/auth/login')
          break
        case 403:
          error.tips = '拒绝访问'
          const { data } = error.response
          error.tips = data || { message: '拒绝访问' }
          break
        case 404:
          error.tips = '请求错误,未找到该资源'
          break
        case 405:
          error.tips = '请求方法未允许'
          break
        case 408:
          error.tips = '请求超时'
          break
        case 422: {
          const { data } = error.response
          error.tips = data || { message: '错误请求' }
          break
        }
        case 429:
          error.tips = '请求次数过多'
          break
        case 500:
          error.tips = '服务器端出错'
          break
        case 501:
          error.tips = '网络未实现'
          break
        case 502:
          error.tips = '网络错误'
          break
        case 503:
          error.tips = '服务不可用'
          break
        case 504:
          error.tips = '网络超时'
          break
        case 505:
          error.tips = 'http版本不支持该请求'
          break
        default:
          error.tips = `连接错误${error.response.status}`
      }
    } else {
      error.tips = '网络不可用，请检查！'
    }
    console.error(error) // eslint-disable-line no-console
    const message = errorMessageHandler(error.tips)
    Message.error(message)
  })
}
