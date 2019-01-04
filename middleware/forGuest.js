/**
 * 游客认证中间件
 * 如果页面不登录才能访问，请引入此中间件
 */

export default function ({ redirect, store }) {
  if (store.state.auth.token) {
    redirect('/')
  }
}
