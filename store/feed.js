import { local } from '@/utils/storage'

const LOCAL_KEY = {
  PINNED: 'feed_pinned',
  HOT: 'feed_hot',
  NEW: 'feed_new',
  FOLLOW: 'feed_follow',
}

export const state = () => ({
  pinned: [],
  hot: [],
  new: [],
  follow: [],
})

export const TYPES = {
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  SAVE_LIST: 'SAVE_LIST',
}

export const mutations = {
  [TYPES.LOAD_FROM_STORAGE] (state) {
    Object.keys(LOCAL_KEY).forEach(key => {
      state[key.toLowerCase()] = local.get(LOCAL_KEY[key])
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
  /**
   * 获取动态列表
   *
   * @author mutoe <mutoe@foxmail.com>
   * @param {*} params
   * @returns {boolean} noMore
   */
  async getFeedList ({ commit }, params) {
    const isRefresh = !params.after && !params.hot
    if (isRefresh) commit(TYPES.LOAD_FROM_STORAGE) // 先从 storage 中填充数据
    const { feeds, pinned } = await this.$axios.$get('/feeds', { params })
    if (isRefresh) {
      commit(TYPES.SAVE_LIST, { type: 'pinned', list: pinned })
      commit(TYPES.SAVE_LIST, { type: params.type, list: feeds })
    } else {
      commit(TYPES.SAVE_LIST, { type: params.type, list: feeds, append: true })
    }
    return feeds.length < 15
  },
}
