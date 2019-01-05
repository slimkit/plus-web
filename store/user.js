import { local } from '@/utils/storage'

const LOCAL_KEY = {
  CURRENT_USER: 'user_logged',
}

export const state = () => ({
  logged: null, // 已登录用户
  recommend: [], // 推荐用户
})

export const TYPES = {
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  SAVE_CURRENT_USER: 'SAVE_CURRENT_USER',
  SAVE_RECOMMEND_USERS: 'SAVE_RECOMMEND_USERS',
}

export const mutations = {
  [TYPES.LOAD_FROM_STORAGE] (state) {
    const user = local.get(LOCAL_KEY.CURRENT_USER) || {}
    if (user.id) state.logged = user
  },

  [TYPES.SAVE_CURRENT_USER] (state, user) {
    state.logged = user
    if (user) {
      local.set(LOCAL_KEY.CURRENT_USER, user)
    } else {
      local.remove(LOCAL_KEY.CURRENT_USER)
    }
  },

  [TYPES.SAVE_RECOMMEND_USERS] (state, users) {
    state.recommend = users
  },
}

export const actions = {
  async getCurrentUser ({ commit }) {
    commit(TYPES.LOAD_FROM_STORAGE)
    const user = await this.$axios.$get('/user')
    commit(TYPES.SAVE_CURRENT_USER, user)
  },

  async fetchRecommendUsers ({ commit }) {
    const users = await this.$axios.$get('/user/recommends')
    commit(TYPES.SAVE_RECOMMEND_USERS, users)
  },
}
