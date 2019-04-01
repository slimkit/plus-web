import { local } from '@/utils/storage'

const LOCAL_KEY = {
  CATEGORIES: 'news_categories',
  HOT: 'news_hot',
}

export const state = () => ({
  categories: { // 分类
    my: [],
    more: [],
  },
  hot: { // 热门资讯
    day: [],
    week: [],
    month: [],
    quarter: [],
  },
})

export const getters = {
  categories ({ categories }) {
    return [...categories.my, ...categories.more]
  },
}

export const TYPES = {
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  SAVE_CATEGORIES: 'SAVE_CATEGORIES',
  SAVE_HOT: 'SAVE_HOT',
}

export const mutations = {
  [TYPES.LOAD_FROM_STORAGE] (state, key) {
    // 加载分类
    const categories = local.get(LOCAL_KEY.CATEGORIES)
    if (categories) state.categories = categories

    // 加载热门资讯
    const hot = local.get(LOCAL_KEY.HOT)
    if (hot) state.hot = hot
  },

  [TYPES.SAVE_CATEGORIES] (state, categories) {
    state.categories.my = categories.my
    state.categories.more = categories.more
    local.set(LOCAL_KEY.CATEGORIES, state.categories)
  },

  [TYPES.SAVE_HOT] (state, { type, list = [] }) {
    state.hot[type] = list
    local.set(LOCAL_KEY.HOT, state.hot)
  },

}

export const actions = {
  async getNewsCategories ({ commit }) {
    commit(TYPES.LOAD_FROM_STORAGE)
    const { my_cates: my, more_cates: more } = await this.$axios.$get('/news/cates')
    commit(TYPES.SAVE_CATEGORIES, { my, more })
  },

  async getHotNews ({ commit }) {
    commit(TYPES.LOAD_FROM_STORAGE);
    ['day', 'week', 'month', 'quarter'].forEach(async type => {
      const params = { type, limit: 9 }
      const list = await this.$axios.$get('/news/ranks', { params })
      commit(TYPES.SAVE_HOT, { type, list })
    })
  },
}
