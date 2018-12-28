export const state = () => ({
  recommend: [],
})

export const TYPES = {
  SAVE_RECOMMEND_USERS: 'SAVE_RECOMMEND_USERS',
}

export const mutations = {
  [TYPES.SAVE_RECOMMEND_USERS] (state, users) {
    state.recommend = users
  },
}

export const actions = {
  async fetchRecommendUsers ({ commit }) {
    const users = await this.$axios.$get('/user/recommends')
    commit(TYPES.SAVE_RECOMMEND_USERS, users)
  },
}
