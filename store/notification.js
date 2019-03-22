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
  previewComment: ({ comment }) => {
    if (!comment.badge) return '没有收到新的评论'
    return `${(comment.preview_users_names || []).join('、')}评论了我`
  },
  previewAt: ({ at }) => {
    if (!at.badge) return '还没有人@我'
    return `${(at.preview_users_names || []).join('、')}@了我`
  },
  previewLike: ({ like }) => {
    if (!like.badge) return '还没有人赞我'
    return `${(like.preview_users_names || []).join('、')}赞了我`
  },
  previewSystem: ({ system }) => {
    if (!system.badge) return '暂无系统消息'
    return `${(system.preview_users_names || []).join('、')}@了我`
  },
  previewAudit: (state, { unreadAudits }) => {
    if (!unreadAudits) return '暂无审核消息'
    return '您有新的审核消息，请及时处理'
  },
}

export const TYPES = {
  SAVE_NOTIFICATIONS: 'SAVE_NOTIFICATIONS',
  CLEAR_UNREAD_NOTIFICATION: 'CLEAR_UNREAD_NOTIFICATION',
}

export const mutations = {
  [TYPES.SAVE_NOTIFICATIONS] (state, notifications) {
    for (const key in _.pick(state, ['comment', 'like', 'system', 'at'])) {
      state[key] = notifications[key]
    }
  },

  [TYPES.CLEAR_UNREAD_NOTIFICATION] (state, type) {
    state[type].badge = 0
  },
}

export const actions = {
  async getNotificationStatistics ({ commit }) {
    const data = await this.$axios.$get('/user/notification-statistics')
    commit(TYPES.SAVE_NOTIFICATIONS, data)
  },

  async clearUnreadNotification ({ commit }, type) {
    await this.$axios.$patch('/user/notifications', {}, { params: { type } })
    commit(TYPES.CLEAR_UNREAD_NOTIFICATION, type)
  },
}
