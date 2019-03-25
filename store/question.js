import { limit } from '@/utils'
import { local } from '@/utils/storage'

const LOCAL_KEY = {
  HOT: 'question_hot',
}

export const state = () => ({
  all: [], // 全部问题
  hot: [], // 热门问题
  new: [], // 最新问题
  reward: [], // 悬赏问题
  excellent: [], // 精选问题
  follow: [], // 关注的问题
  current: {}, // 当前问题
})

export const getters = {}

export const TYPES = {
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  SAVE_LIST: 'SAVE_LIST',
  SAVE_QUESTION: 'SAVE_QUESTION',
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

  [TYPES.SAVE_QUESTION] (state, question) {
    state.current = question
  },
}

export const actions = {
  async getQuestionList ({ commit }, params = {}) {
    params = { limit, ...params }
    commit(TYPES.LOAD_FROM_STORAGE)
    const list = await this.$axios.$get('/questions', { params })
    commit(TYPES.SAVE_LIST, { type: params.type, list, append: params.offset })
  },
}
