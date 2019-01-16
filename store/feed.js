import _ from 'lodash'
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

export const getters = {
  pinned (state) {
    // 注入 pinned 属性
    return state.pinned.map(item => {
      item.pinned = true
      return item
    })
  },
  hot (state, getters) {
    // 混入置顶数据并去重
    return _.unionBy(getters.pinned, state.hot, 'id')
  },
  new (state, getters) {
    // 混入置顶数据并去重
    return _.unionBy(getters.pinned, state.new, 'id')
  },
  follow (state) {
    return state.follow
  },
}

export const TYPES = {
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  CLEAR_STORAGE: 'CLEAR_STORAGE',
  SAVE_LIST: 'SAVE_LIST',
  DELETE_FEED: 'DELETE_FEED',
}

export const mutations = {
  [TYPES.LOAD_FROM_STORAGE] (state) {
    Object.keys(LOCAL_KEY).forEach(key => {
      state[key.toLowerCase()] = local.get(LOCAL_KEY[key]) || []
    })
  },
  [TYPES.CLEAR_STORAGE] () {
    Object.values(LOCAL_KEY).forEach(item => {
      local.remove(item)
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
  [TYPES.DELETE_FEED] (state, { type, feedId }) {
    state.pinned = state.pinned.filter(item => item.id !== feedId)
    state[type] = state[type].filter(item => item.id !== feedId)
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
      if (params.type !== 'follow') commit(TYPES.SAVE_LIST, { type: 'pinned', list: pinned })
      commit(TYPES.SAVE_LIST, { type: params.type, list: feeds })
    } else {
      commit(TYPES.SAVE_LIST, { type: params.type, list: feeds, append: true })
    }
    return feeds.length < 15
  },
}
