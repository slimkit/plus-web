import { local } from '@/utils/storage'
import { limit } from '@/utils'

const LOCAL_KEY = {
  CATEGORY: 'group_category',
  RECOMMEND: 'group_recommend',
  COUNT: 'group_count',
  ALL: 'group_all',
  JOINED: 'group_joined',
}

export const state = () => ({
  category: [],
  all: [],
  count: 0,
  recommend: [],
  joined: [],
})

export const TYPES = {
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  CLEAR_STORAGE: 'CLEAR_STORAGE',
  SAVE_COUNT: 'SAVE_COUNT',
  SAVE_CATEGORY: 'SAVE_CATEGORY',
  SAVE_LIST: 'SAVE_LIST',
  DELETE_FEED: 'DELETE_FEED',
}

export const mutations = {
  [TYPES.LOAD_FROM_STORAGE] (state) {
    Object.keys(LOCAL_KEY).forEach(key => {
      const data = local.get(LOCAL_KEY[key])
      if (data) state[key.toLowerCase()] = data
    })
  },
  [TYPES.CLEAR_STORAGE] () {
    Object.values(LOCAL_KEY).forEach(item => {
      local.remove(item)
    })
  },
  [TYPES.SAVE_CATEGORY] (state, cates) {
    state.category = cates
    local.set(LOCAL_KEY.CATEGORY, cates)
  },
  [TYPES.SAVE_LIST] (state, { type, list, append = false }) {
    if (!append) {
      state[type] = list
      local.set(LOCAL_KEY[type.toUpperCase()], state[type])
    } else {
      state[type].push(...list)
    }
  },
  [TYPES.SAVE_COUNT] (state, count) {
    state.count = count
    local.set(LOCAL_KEY.COUNT, count)
  },
}

export const actions = {
  async getGroupCount ({ commit }) {
    const { count } = await this.$axios.$get('/plus-group/groups/count')
    commit(TYPES.SAVE_COUNT, count)
  },

  async getGroupCategories ({ commit }) {
    const cates = await this.$axios.$get('/plus-group/categories')
    commit(TYPES.SAVE_CATEGORY, cates)
  },

  async getRecommendGroups ({ commit }, params) {
    const groups = await this.$axios.$get('/plus-group/recommend/groups', { params })
    commit(TYPES.SAVE_LIST, {
      type: 'recommend',
      list: groups,
    })
    const noMore = groups.length < limit
    return noMore
  },

  async getAllGroups ({ commit }, params = {}) {
    const groups = await this.$axios.$get('/plus-group/groups', { params })
    commit(TYPES.SAVE_LIST, {
      type: 'all',
      list: groups,
      append: params.offset,
    })
    const noMore = groups.length < limit
    return noMore
  },

  async getNearbyGroups ({ commit }, params) {
    const groups = await this.$axios.$get('/plus-group/round/groups')
    commit(TYPES.SAVE_LIST, {
      type: 'nearby',
      list: groups,
      append: params.offset,
    })
    const noMore = groups.length < limit
    return noMore
  },
}
