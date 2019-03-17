import _ from 'lodash'

export const state = () => ({
  system: {
    first: {
      data: {},
    },
  },
  at: {},
  comment: {},
  like: {},
  follow: {},
  audits: {
    feedCommentPinned: [],
    newsCommentPinned: [],
    postPinned: [],
    postCommentPinned: [],
    groupJoined: [],
  },
})

export const getters = {
  unreadAudits: state => Object.keys(state.audits)
    .reduce((sum, key) => sum + state.audits[key].filter(item => item.status === 0).length, 0),
}

export const TYPES = {
  SAVE_NOTIFICATIONS: 'SAVE_NOTIFICATIONS',
}

export const mutations = {
  [TYPES.SAVE_NOTIFICATIONS] (state, notifications) {
    for (const key in _.pick(state, ['comment', 'like', 'system', 'at'])) {
      state[key] = notifications[key]
    }
  },
}

export const actions = {
  async getNotificationStatistics ({ commit }) {
    const data = await this.$axios.$get('/user/notification-statistics')
    commit(TYPES.SAVE_NOTIFICATIONS, data)
  },
}
