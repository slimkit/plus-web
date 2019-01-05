/**
 * 认证中间件
 * 如果页面需要登录才能访问，请引入此中间件
 */

export default function ({ store, redirect, route }) {
  if (!store.state.auth.token) {
    // 跳转到登录页
    return redirect('/auth/login')
  }
}
