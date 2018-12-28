export default function ({ $axios, $loading }) {
  $axios.onRequest(config => {
    console.log(`Making request to ${config.url}`) // eslint-disable-line no-console
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (error && error.response) {
      switch (code) {
        case 400:
          error.tips = '错误请求'
          break
        case 401:
          // error.tips = lstore.hasData('H5_CUR_USER')
          //   ? '登陆失效，请重新登录'
          //   : '请登录'
          // lstore.clearData()
          // requireAuth()
          break
        case 403:
          error.tips = '拒绝访问'
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
    // Message.error(error.tips)
  })
}
