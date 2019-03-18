/**
 * 系统消息提示文字解析
 * @param {Object} data
 */
export function getNotificationDisplay (data) {
  switch (data.type) {
    case 'reward':
      return `${data.sender.name}打赏了你`
      // return i18n.t('message.system.reward_user', { user: data.sender.name })
    case 'reward:feeds':
      return `${data.sender.name}打赏了你的动态`
      // return i18n.t('message.system.reward_feed', { user: data.sender.name })
    case 'reward:news':
      return `你的资讯《${data.news.title}》被${data.sender.name}打赏了${data.amount + data.unit}`
      // return i18n.t('message.system.reward_news', { news: data.news.title, user: data.sender.name, amount: data.amount + data.unit })
    case 'group:post-reward':
      return `你的帖子「${data.post.title}」被${data.sender.name}打赏了`
      // return i18n.t('message.system.reward_post', { user: data.sender.name, post: data.post.title })
    case 'group:join':
      if (data.state !== 'reject') return `同意用户${data.user.name}加入圈子「${data.group.name}」`
      return `${data.user.name}请求加入圈子「${data.group.name}」`
      // return i18n.t(`message.system.group_join[${data.state !== 'reject' ? 1 : 0}]`, { group: data.group.name, user: (data.user || {}).name })
    case 'user-certification':
      if (data.state !== 'reject') return `你申请的身份认证已被驳回，驳回理由：${data.contents}`
      return `你申请的身份认证已通过`
      // return i18n.t(`message.system.certificate[${data.state !== 'reject' ? 1 : 0}]`, { reason: data.contents })
    case 'qa:answer-adoption':
    case 'question:answer':
      return `你提交的回答「${data.answer.body}」被采纳`
    // return i18n.t('message.system.qa_adopt', { answer: data.answer.body })
    case 'qa:reward':
      return `${data.sender.name}打赏了你的回答`
      // return i18n.t('message.system.reward_qa', { user: data.sender.name })
    case 'qa:invitation':
      return `${data.sender.name}邀请你回答问题「${data.question.subject}」`
      // return i18n.t('message.system.qa_invitation', { user: data.sender.name, question: data.question.subject })
    case 'pinned:feed/comment':
      return `${data.state !== 'reject' ? '同意' : '拒绝'}用户动态评论「${data.comment.contents}」的置顶请求`
      // return i18n.t(`message.system.pinned_feed_comment[${data.state !== 'reject' ? 1 : 0}]`, { comment: data.comment.contents })
    case 'pinned:news/comment':
      return `${data.state !== 'reject' ? '同意' : '拒绝'}用户关于资讯《${data.news.title}》评论「${data.comment.contents}」的置顶请求`
      // return i18n.t(`message.system.pinned_news_comment[${data.state !== 'reject' ? 1 : 0}]`, { news: data.news.title, comment: data.comment.contents })
    case 'group:comment-pinned':
    case 'group:send-comment-pinned':
      return `${data.state !== 'reject' ? '同意' : '拒绝'}帖子「${data.post.title}」的评论置顶请求`
      // return i18n.t(`message.system.pinned_post_comment[${data.state !== 'reject' ? 1 : 0}]`, { post: data.post.title })
    case 'group:post-pinned':
      return `${data.state !== 'reject' ? '同意' : '拒绝'}用户帖子「${data.post.title}」的置顶请求`
      // return i18n.t(`message.system.pinned_post[${data.state !== 'reject' ? 1 : 0}]`, { post: data.post.title })
  }
}
