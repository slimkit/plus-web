/**
 * 认证中间件
 * 如果页面需要登录才能访问，请引入此中间件
 */

export default function ({ store, redirect, route }) {
  if (!store.state.auth.token) {
    // 记录来源页面
    const redirectPath = encodeURIComponent(route.fullPath)

    // 跳转到登录页
    return redirect({ name: 'auth-login', query: { redirect: redirectPath } })
  }
}
