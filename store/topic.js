import { local } from '@/utils/storage'

const LOCAL_KEY = {
  HOT: 'topic_hot',
}

export const state = () => ({
  hot: [], // 热门话题
  new: [], // 最新话题
})

export const getters = {}

export const TYPES = {
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  SAVE_LIST: 'SAVE_LIST',
}

export const mutations = {
  [TYPES.LOAD_FROM_STORAGE] (state) {
    Object.keys(LOCAL_KEY).forEach(key => {
      state[key.toLowerCase()] = local.get(LOCAL_KEY[key]) || []
    })
  },

  [TYPES.SAVE_LIST] (state, { type, list, append = false }) {
    if (!append) {
      state[type] = list
      local.set(LOCAL_KEY[type.toUpperCase()], state[type])
    } else {
      state[type].push(...list)
    }
  },
}

export const actions = {
  async getHotTopicList ({ commit }) {
    const params = { only: 'hot' }
    commit(TYPES.LOAD_FROM_STORAGE)
    const list = await this.$axios.$get('/feed/topics', { params })
    commit(TYPES.SAVE_LIST, { type: 'hot', list })
  },

  async getTopicList ({ commit }, params = {}) {
    const isRefresh = !params.index
    if (isRefresh) commit(TYPES.LOAD_FROM_STORAGE)
    const list = await this.$axios.$get('/feed/topics', { params })
    commit(TYPES.SAVE_LIST, { type: 'new', list, append: !isRefresh })
  },
}
