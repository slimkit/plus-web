import { cookie, local, session } from '@/utils/storage'

export const state = () => ({
  token: '', // access token
})

export const TYPES = {
  SAVE_TOKEN: 'SAVE_TOKEN',
  CLEAR_STORAGE: 'CLEAR_STORAGE',
}

export const mutations = {
  [TYPES.SAVE_TOKEN] (state, token) {
    state.token = token || ''
    if (process.client) {
      if (token) {
        cookie.set('access_token', token, { expires: 7 })
      } else {
        cookie.remove('access_token')
      }
    }
  },

  [TYPES.CLEAR_STORAGE] () {
    local.clear()
    session.clear()
  },
}

export const actions = {
  async getAccessToken ({ commit, dispatch }, payload) {
    const { account, password, code } = payload

    // 获取 access token
    const params = { login: account, password, code }
    const { access_token: token } = await this.$axios.$post('/auth/login', params)

    // 存储 access token
    commit(TYPES.SAVE_TOKEN, token)

    // 获取登录用户信息
    await dispatch('user/getCurrentUser', null, { root: true })
  },

  async logout ({ commit }) {
    // 清除 access token
    commit(TYPES.SAVE_TOKEN, null)
    // 清除登录用户信息
    commit('user/SAVE_CURRENT_USER', null, { root: true })
    // 清除本地缓存
    commit(TYPES.CLEAR_STORAGE)
  },
}
