import { limit } from '@/utils'
import { local } from '@/utils/storage'

const LOCAL_KEY = {
  HOT: 'question_hot',
  TOPICS: 'question_topics',
}

export const state = () => ({
  all: [], // 全部问题
  hot: [], // 热门问题
  new: [], // 最新问题
  reward: [], // 悬赏问题
  excellent: [], // 精选问题
  follow: [], // 关注的问题
  topics: [], // 全部专题
  followedTopics: [], // 关注的专题
  current: {}, // 当前问题
  rankAnswer: { // 解答排行榜
    day: [],
    week: [],
    month: [],
  },
})

export const getters = {}

export const TYPES = {
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  SAVE_LIST: 'SAVE_LIST',
  SAVE_QUESTION: 'SAVE_QUESTION',
  SAVE_QUESTION_TOPICS: 'SAVE_QUESTION_TOPICS',
  SAVE_ANSWER_RANKS: 'SAVE_ANSWER_RANKS',
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
      if (type === 'hot') local.set(LOCAL_KEY[type.toUpperCase()], state[type])
    } else {
      state[type].push(...list)
    }
  },

  [TYPES.SAVE_QUESTION] (state, question) {
    state.current = question
  },

  [TYPES.SAVE_QUESTION_TOPICS] (state, { type, list }) {
    state[type] = list
  },

  [TYPES.SAVE_ANSWER_RANKS] (state, { type, list }) {
    state.rankAnswer[type] = list
  },
}

export const actions = {
  async getQuestionList ({ commit }, params = {}) {
    params = { limit, ...params }
    commit(TYPES.LOAD_FROM_STORAGE)
    const list = await this.$axios.$get('/questions', { params })
    commit(TYPES.SAVE_LIST, { type: params.type, list, append: params.offset })
    const noMore = list.length < limit
    return noMore
  },

  // 获取全部问题话题列表
  async getQuestionTopicList ({ commit }, params = {}) {
    params = { limit, ...params }
    const list = await this.$axios.$get('/question-topics', { params })
    commit(TYPES.SAVE_QUESTION_TOPICS, { type: 'topics', list })
    const noMore = list.length < limit
    return noMore
  },

  // 获取关注的问题话题列表
  async getFollowedTopicList ({ commit }, params = {}) {
    params = { limit, ...params }
    const list = await this.$axios.$get('/user/question-topics', { params })
    list.forEach(t => (t.has_follow = true)) // 标记关注
    commit(TYPES.SAVE_QUESTION_TOPICS, { type: 'followedTopics', list })
    const noMore = list.length < limit
    return noMore
  },

  async getQuestionAnswerRanks ({ commit }) {
    const promises = ['day', 'week', 'month'].map(type => {
      return this.$axios.$get('/question-ranks/answers', { params: { type } })
    })
    const [day, week, month] = await Promise.all(promises)
    commit(TYPES.SAVE_ANSWER_RANKS, { type: 'day', list: day })
    commit(TYPES.SAVE_ANSWER_RANKS, { type: 'week', list: week })
    commit(TYPES.SAVE_ANSWER_RANKS, { type: 'month', list: month })
  },
}
