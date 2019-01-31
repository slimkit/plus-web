import { local, cookie } from '@/utils/storage'

export const strict = false

const LOCAL_KEY = {
  TAGS: 'tags',
}

export const state = () => ({
  boot: {}, // 启动信息
  tags: [], // 全局标签
})

export const TYPES = {
  SAVE_BOOT: 'SAVE_BOOT',
  SAVE_TAGS: 'SAVE_TAGS',
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
}

export const mutations = {
  [TYPES.SAVE_BOOT] (state, boot) {
    state.boot = boot
  },

  [TYPES.LOAD_FROM_STORAGE] (state) {
    const tags = local.get(LOCAL_KEY.TAGS)
    if (tags) state.tags = tags
  },

  [TYPES.SAVE_TAGS] (state, tags) {
    state.tags = tags
    local.set(LOCAL_KEY.TAGS, tags)
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

  async getTags ({ commit }) {
    const tags = await this.$axios.$get('/tags')
    commit(TYPES.SAVE_TAGS, tags)
  },
}
