import { local } from '@/utils/storage'
import { limit } from '@/utils'

// 要写入 localStrorage 缓存的字段以及 key
const LOCAL_KEY = {
  CATEGORY: 'group_category',
  RECOMMEND: 'group_recommend',
  COUNT: 'group_count',
  ALL: 'group_all',
  JOINED: 'group_joined',
  NEARBY: 'group_nearby',
}

export const state = () => ({
  current: {}, // 当前访问的圈子
  category: [], // 圈子分类
  all: [], // 所有圈子
  count: 0, // 所有圈子数量
  recommend: [], // 推荐（热门）圈子
  joined: [], // 我加入的圈子
  nearby: [], // 附近的圈子
  protocol: '', // 圈子协议
})

export const TYPES = {
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  SAVE_COUNT: 'SAVE_COUNT',
  SAVE_CATEGORY: 'SAVE_CATEGORY',
  SAVE_LIST: 'SAVE_LIST',
  DELETE_FEED: 'DELETE_FEED',
  SAVE_CURRENT_GROUP: 'SAVE_CURRENT_GROUP',
  SAVE_GROUP_PROTOCOL: 'SAVE_GROUP_PROTOCOL',
}

export const mutations = {
  [TYPES.LOAD_FROM_STORAGE] (state) {
    Object.keys(LOCAL_KEY).forEach(key => {
      const data = local.get(LOCAL_KEY[key])
      if (data) state[key.toLowerCase()] = data
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

  [TYPES.SAVE_CURRENT_GROUP] (state, group) {
    state.current = group
  },

  [TYPES.SAVE_GROUP_PROTOCOL] (state, protocol) {
    state.protocol = protocol
  },
}

export const actions = {
  async getGroupsCount ({ commit }) {
    const { count } = await this.$axios.$get('/plus-group/groups/count')
    commit(TYPES.SAVE_COUNT, count)
  },

  async getGroupCategories ({ commit }) {
    const cates = await this.$axios.$get('/plus-group/categories')
    commit(TYPES.SAVE_CATEGORY, cates)
  },

  async getRecommendGroups ({ commit }, params = {}) {
    Object.assign({ limit }, params)
    const groups = await this.$axios.$get('/plus-group/recommend/groups', { params })
    commit(TYPES.SAVE_LIST, {
      type: 'recommend',
      list: groups,
    })
    const noMore = groups.length < limit
    return noMore
  },

  async getAllGroups ({ commit }, params = {}) {
    Object.assign({ limit }, params)
    const groups = await this.$axios.$get('/plus-group/groups', { params })
    commit(TYPES.SAVE_LIST, {
      type: 'all',
      list: groups,
      append: params.offset,
    })
    const noMore = groups.length < limit
    return noMore
  },

  async getNearbyGroups ({ commit }, params = {}) {
    Object.assign({ limit }, params)
    const groups = await this.$axios.$get('/plus-group/round/groups', { params })
    commit(TYPES.SAVE_LIST, {
      type: 'nearby',
      list: groups,
      append: params.offset,
    })
    const noMore = groups.length < limit
    return noMore
  },

  async getJoinedGroups ({ commit }, params = {}) {
    Object.assign({ limit }, params)
    const groups = await this.$axios.$get('/plus-group/user-groups', { params })
    commit(TYPES.SAVE_LIST, {
      type: 'joined',
      list: groups,
      append: params.offset,
    })
    const noMore = groups.length < limit
    return noMore
  },

  async getGroupDetail ({ commit }, groupId) {
    const group = await this.$axios.$get(`/plus-group/groups/${groupId}`)
    commit(TYPES.SAVE_CURRENT_GROUP, group)
    return group
  },

  async getGroupProtocol ({ commit }) {
    const { protocol } = await this.$axios.$get('/plus-group/groups/protocol')
    commit(TYPES.SAVE_GROUP_PROTOCOL, protocol)
  },
}
