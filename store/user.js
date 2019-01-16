import { limit } from '@/utils'
import { local } from '@/utils/storage'

const LOCAL_KEY = {
  CURRENT_USER: 'user_logged',
  RECOMMEND_USERS: 'user_recommend',
  HOT_USERS: 'user_hot',
}

export const state = () => ({
  logged: null, // 已登录用户
  recommend: [], // 推荐用户
  hot: [], // 热门用户
})

export const TYPES = {
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  SAVE_CURRENT_USER: 'SAVE_CURRENT_USER',
  SAVE_RECOMMEND_USERS: 'SAVE_RECOMMEND_USERS',
  SAVE_HOT_USERS: 'SAVE_HOT_USERS',
}

export const mutations = {
  [TYPES.LOAD_FROM_STORAGE] (state) {
    // 加载推荐用户
    const recommend = local.get(LOCAL_KEY.RECOMMEND_USERS)
    if (recommend) state.recommend = recommend

    // 加载热门用户
    const hot = local.get(LOCAL_KEY.HOT_USERS)
    if (hot) state.hot = hot
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
    local.set(LOCAL_KEY.RECOMMEND_USERS, users)
  },

  [TYPES.SAVE_HOT_USERS] (state, { users, offset = 0 }) {
    if (offset) {
      state.hot.push(...users)
    } else {
      state.hot = users
      local.set(LOCAL_KEY.HOT_USERS, users)
    }
  },
}

export const actions = {
  async getCurrentUser ({ commit }) {
    const user = await this.$axios.$get('/user')
    commit(TYPES.SAVE_CURRENT_USER, user)
  },

  async fetchRecommendUsers ({ commit }) {
    const users = await this.$axios.$get('/user/recommends')
    commit(TYPES.SAVE_RECOMMEND_USERS, users)
  },

  async fetchHotUsers ({ commit }, offset) {
    if (!offset) commit(TYPES.LOAD_FROM_STORAGE)
    const params = { offset, limit }
    const users = await this.$axios.$get('/user/populars', { params })
    commit(TYPES.SAVE_HOT_USERS, { users, offset })
    const noMore = users.length < limit
    return noMore
  },
}
