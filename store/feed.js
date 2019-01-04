import { local } from '@/utils/storage'

const LOCAL_KEY = {
  PINNED: 'feed_pinned',
  HOT: 'feed_hot',
  NEW: 'feed_new',
}

export const state = () => ({
  pinned: local.get(LOCAL_KEY.PINNED) || [],
  hot: local.get(LOCAL_KEY.HOT) || [],
  new: local.get(LOCAL_KEY.NEW) || [],
})

export const TYPES = {
  SAVE_LIST: 'SAVE_LIST',
}

export const mutations = {
  [TYPES.SAVE_LIST] (state, { type, list }) {
    state[type] = list
    local.set(LOCAL_KEY[type.toUpperCase()], list)
  },
}

export const actions = {
  async getFeedList ({ commit }, params) {
    const { feeds, pinned } = await this.$axios.$get('/feeds', { params })
    commit(TYPES.SAVE_LIST, { type: 'pinned', list: pinned })
    if (!params.after && !params.hot) {
      // 保存第一页数据用来填充默认数据
      commit(TYPES.SAVE_LIST, { type: params.type, list: feeds })
    }
    // 返回普通动态列表
    return feeds
  },
}
