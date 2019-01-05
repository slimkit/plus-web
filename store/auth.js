import { cookie } from '@/utils/storage'

export const state = () => ({
  token: '', // access token
})

export const TYPES = {
  SAVE_TOKEN: 'SAVE_TOKEN',
}

export const mutations = {
  [TYPES.SAVE_TOKEN] (state, token) {
    state.token = token || ''
    if (process.client) {
      if (token) {
        cookie.set('access_token', token)
      } else {
        cookie.remove('access_token')
      }
    }
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
    try {
      // 提交注销请求
      await this.$axios.$post('/auth/logout', {}, {
        validateStatue: s => [200, 401].includes(s),
        timeout: 3000,
      })
    } catch (error) {
      console.warn('[axios] logout request failed', error) // eslint-disable-line no-console
    }

    // 清除 access token
    commit(TYPES.SAVE_TOKEN, null)
    // 清除登录用户信息
    commit('user/SAVE_CURRENT_USER', null, { root: true })
  },
}
