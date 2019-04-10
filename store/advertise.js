import _ from 'lodash'
import { local } from '@/utils/storage'

/** PC端广告位类型 */
const PC_ADVERTISE_SPACES_NAME = [
  'pc:feeds:right', // 动态右侧广告位
  'pc:feeds:list', // 动态列表卡片广告位

  'pc:news:top', // 资讯顶部广告位
  'pc:news:right', // 资讯右侧广告位
  'pc:news:list', // 资讯列表卡片广告位
]

const LOCAL_KEY = {
  SPACES: 'advertise_spaces',
  LIST: 'advertise_list',
}

export const state = () => ({
  spaces: [], // 所有广告位
  list: [], // PC端广告列表
})

export const getters = {
  /** PC端分组广告列表 */
  grouped: state => _.groupBy(state.list, 'space_id'),

  /** 根据 space_id 获取PC端广告列表 */
  getListBySpaceId: (state, getters) => spaceId => getters.grouped[spaceId] || [],

  /** 根据 space name 获取PC端广告列表 */
  getListBySpace: (state, getters) => spaceName => {
    const space = _.find(state.spaces, s => s.space === spaceName) || {}
    return getters.getListBySpaceId(space.id)
  },
}

export const TYPES = {
  SAVE_SPACES: 'SAVE_SPACES',
  SAVE_ADVERTISE: 'SAVE_ADVERTISE',
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
}

export const mutations = {
  [TYPES.LOAD_FROM_STORAGE] (state) {
    const spaces = local.get(LOCAL_KEY.SPACES)
    if (spaces) state.spaces = spaces
  },

  [TYPES.SAVE_ADVERTISE] (state, ads) {
    state.list = ads
    local.set(LOCAL_KEY.LIST, ads)
  },

  [TYPES.SAVE_SPACES] (state, spaces) {
    state.spaces = spaces
    local.set(LOCAL_KEY.SPACE, spaces)
  },
}

export const actions = {
  async getAdvertiseSpace ({ commit }) {
    const spaces = await this.$axios.$get('/advertisingspace')
    commit(TYPES.SAVE_SPACES, spaces)
  },

  async getPcAdvertises ({ state, commit }) {
    const spaces = _.filter(state.spaces, s => PC_ADVERTISE_SPACES_NAME.includes(s.space))
    const ids = spaces.map(s => s.id).join(',')
    if (!ids) return
    const ads = await this.$axios.$get(`/advertisingspace/advertising/`, { params: { space: ids } })
    commit(TYPES.SAVE_ADVERTISE, ads)
  },
}
