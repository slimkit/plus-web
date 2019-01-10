import { cookie } from '@/utils/storage'

export const strict = false

export const state = () => ({
  boot: {},
})

export const TYPES = {
  SAVE_BOOT: 'SAVE_BOOT',
}

export const mutations = {
  [TYPES.SAVE_BOOT] (state, boot) {
    state.boot = boot
  },
}

export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { req }) {
    const token = cookie.get('access_token', req.headers.cookie)
    commit('auth/SAVE_TOKEN', token)

    const promises = [
      dispatch('getBootstrappers'),
    ]
    if (token) {
      promises.push(...[
        dispatch('user/getCurrentUser'),
      ])
    }
    await Promise.all(promises)
    return Promise.resolve()
  },

  async getBootstrappers ({ commit }) {
    const boot = await this.$axios.$get('/bootstrappers')
    commit(TYPES.SAVE_BOOT, boot)
  },
}
