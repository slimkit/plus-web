import { local } from '@/utils/storage'

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
  },

  /**
   * 获取动态列表
   *
   * @author mutoe <mutoe@foxmail.com>
   * @param {*} params
   * @returns {boolean} noMore
   */
  async getGroupList ({ commit }, params) {
    const isRefresh = !params.after && !params.hot
    if (isRefresh) commit(TYPES.LOAD_FROM_STORAGE) // 先从 storage 中填充数据
    const { feeds, pinned } = await this.$axios.$get('/feeds', { params })
    if (isRefresh) {
      if (params.type !== 'follow') commit(TYPES.SAVE_LIST, { type: 'pinned', list: pinned })
      commit(TYPES.SAVE_LIST, { type: params.type, list: feeds })
    } else {
      commit(TYPES.SAVE_LIST, { type: params.type, list: feeds, append: true })
    }
    return feeds.length < 15
  },
}
