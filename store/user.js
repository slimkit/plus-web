import { limit } from '@/utils'
import { local } from '@/utils/storage'

const LOCAL_KEY = {
  CURRENT_USER: 'user_logged',
  RECOMMEND_USERS: 'user_recommend',
  HOT_USERS: 'user_hot',
  FRIEND: 'user_friend',
  USER_TAGS: 'user_tags',
}

export const state = () => ({
  logged: null, // 已登录用户
  friend: [], // 好友
  recommend: [], // 推荐用户（已缓存）
  recommendLoading: false, // 推荐用户加载中
  hot: [], // 热门用户（已缓存）
  new: [], // 最新用户
  userTags: [], // 当前登录用户标签
})

export const TYPES = {
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  SAVE_CURRENT_USER: 'SAVE_CURRENT_USER',
  SAVE_RECOMMEND_USERS: 'SAVE_RECOMMEND_USERS',
  SAVE_HOT_USERS: 'SAVE_HOT_USERS',
  SAVE_NEW_USERS: 'SAVE_NEW_USERS',
  SAVE_FRIEND: 'SAVE_FRIEND',
  SAVE_USER_TAGS: 'SAVE_USER_TAGS',
  SET_RECOMMEND_USER_LOADING: 'SET_RECOMMEND_USER_LOADING',
}

export const mutations = {
  [TYPES.SET_RECOMMEND_USER_LOADING] (state, status) {
    state.recommendLoading = status
  },
  [TYPES.LOAD_FROM_STORAGE] (state) {
    // 加载推荐用户
    const recommend = local.get(LOCAL_KEY.RECOMMEND_USERS)
    if (recommend) state.recommend = recommend

    // 加载热门用户
    const hot = local.get(LOCAL_KEY.HOT_USERS)
    if (hot) state.hot = hot

    const friend = local.get(LOCAL_KEY.FRIEND)
    if (friend) state.friend = friend
  },

  [TYPES.SAVE_CURRENT_USER] (state, user) {
    state.logged = user
    if (user) {
      local.set(LOCAL_KEY.CURRENT_USER, user)
    } else {
      local.remove(LOCAL_KEY.CURRENT_USER)
    }
  },

  [TYPES.SAVE_FRIEND] (state, users = []) {
    state.friend = users
  },

  [TYPES.SAVE_RECOMMEND_USERS] (state, { users, offset = 0 }) {
    if (offset) {
      state.recommend.push(...users)
    } else {
      state.recommend = users
      local.set(LOCAL_KEY.RECOMMEND_USERS, users)
    }
  },

  [TYPES.SAVE_HOT_USERS] (state, { users, offset = 0 }) {
    if (offset) {
      state.hot.push(...users)
    } else {
      state.hot = users
      local.set(LOCAL_KEY.HOT_USERS, users)
    }
  },

  [TYPES.SAVE_NEW_USERS] (state, { users, offset = 0 }) {
    if (offset) {
      state.new.push(...users)
    } else {
      state.new = users
    }
  },

  [TYPES.SAVE_USER_TAGS] (state, tags) {
    state.userTags = tags
    local.set(LOCAL_KEY.USER_TAGS, tags)
  },
}

export const actions = {
  async getCurrentUser ({ commit }) {
    const user = await this.$axios.$get('/user')
    commit(TYPES.SAVE_CURRENT_USER, user)
  },

  async getCurrentUserTags ({ commit }) {
    const tags = await this.$axios.$get('/user/tags')
    commit(TYPES.SAVE_USER_TAGS, tags)
  },

  async getUserFriends ({ commit }) {
    const params = { limit: 5 }
    const users = await this.$axios.$get('/user/follow-mutual', { params })
    commit(TYPES.SAVE_FRIEND, users)
  },

  async fetchRecommendUsers ({ commit, state }, offset) {
    if (!state.recommendLoading) {
      commit(TYPES.SET_RECOMMEND_USER_LOADING, true)
      const params = { offset, limit }
      const users = await this.$axios.$get('/user/recommends', { params })
      commit(TYPES.SET_RECOMMEND_USER_LOADING, false)
      commit(TYPES.SAVE_RECOMMEND_USERS, { users, offset })
      const noMore = users.length < limit
      return noMore
    }
  },

  async fetchHotUsers ({ commit }, offset) {
    if (!offset) commit(TYPES.LOAD_FROM_STORAGE)
    const params = { offset, limit }
    const users = await this.$axios.$get('/user/populars', { params })
    commit(TYPES.SAVE_HOT_USERS, { users, offset })
    const noMore = users.length < limit
    return noMore
  },

  async fetchNewUsers ({ commit }, offset) {
    const params = { offset, limit }
    const users = await this.$axios.$get('/user/latests', { params })
    commit(TYPES.SAVE_NEW_USERS, { users, offset })
    const noMore = users.length < limit
    return noMore
  },
}
