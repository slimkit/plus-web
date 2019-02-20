import { local } from '@/utils/storage'

const LOCAL_KEY = {
  CATEGORIES: 'news_categories',
}

export const state = () => ({
  categories: {
    my: [],
    more: [],
  }, // 分类
})

export const getters = {
  categories ({ categories }) {
    return [...categories.my, ...categories.more]
  },
}

export const TYPES = {
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  SAVE_CATEGORIES: 'SAVE_CATEGORIES',
}

export const mutations = {
  [TYPES.LOAD_FROM_STORAGE] (state) {
    // 加载分类
    const categories = local.get(LOCAL_KEY.CATEGORIES)
    if (categories) state.categories = categories
  },

  [TYPES.SAVE_CATEGORIES] (state, categories) {
    state.categories.my = categories.my
    state.categories.more = categories.more
    local.set(LOCAL_KEY.CATEGORIES, state.categories)
  },

}

export const actions = {
  async getNewsCategories ({ commit }) {
    commit(TYPES.LOAD_FROM_STORAGE)
    const { my_cates: my, more_cates: more } = await this.$axios.$get('/news/cates')
    commit(TYPES.SAVE_CATEGORIES, { my, more })
  },
}
