import { cookie } from '@/utils/storage'

export const state = () => ({
  token: '', // access token
})

export const TYPES = {
  SAVE_TOKEN: 'SAVE_TOKEN',
}

export const mutations = {
  [TYPES.SAVE_TOKEN] (state, token) {
    state.token = token
    if (process.client) {
      cookie.set('access_token', token)
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
}
