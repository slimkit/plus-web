/**
 * 系统消息提示文字解析
 * @param {Object} data
 */
export function getNotificationDisplay (data) {
  switch (data.type) {
    // 用户相关
    case 'reward':
      return `${data.sender.name}打赏了你`
    case 'user-certification':
      if (data.state === 'reject') return `你申请的身份认证已被驳回，驳回理由：${data.contents}`
      return `你申请的身份认证已通过`
    case 'user-cash':
      if (data.state === 'rejected') return `你的提现申请被拒绝：${data.contents}`
      return `你的提现申请通过啦`
    case 'user-currency:cash':
      if (data.state === 'rejected') return `你的积分提取申请被拒绝：${data.contents}`
      return `你的积分提取申请通过啦`

    // 动态
    case 'reward:feeds':
      return `${data.sender.name}打赏了你的动态`
    case 'pinned:feeds':
      return `管理员置顶了你的动态`
    case 'pinned:feed/comment':
      return `你的动态评论「${data.comment.contents}」的置顶请求被${data.state === 'passed' ? '同意' : '拒绝'}了`

    // 资讯
    case 'reward:news':
      return `你的资讯《${data.news.title}》被${data.sender.name}打赏了${data.amount + data.unit}`
    case 'pinned:news/comment':
      return `你关于资讯《${data.news.title}》下评论「${data.comment.contents}」的置顶请求被${data.state !== 'reject' ? '同意' : '拒绝'}了`

    // 问答
    case 'qa:answer-adoption':
    case 'question:answer':
      return `你提交的回答「${data.answer.body}」被采纳`
    case 'qa:reward':
      return `${data.sender.name}打赏了你的回答`
    case 'qa:invitation':
      return `${data.sender.name}邀请你回答问题「${data.question.subject}」`
    case 'qa:question-topic:accept':
      return `你的《${data.topic.name}》专题申请已通过`
    case 'qa:question-topic:reject':
      return `你的《${data.topic_application.name}》专题申请被拒绝`
    case 'qa:question-excellent:accept':
      return `你的问题「${data.application.question.subject}」已通过申请精选`
    case 'qa:question-excellent:reject':
      return `你的问题「${data.application.question.subject}」没有通过申请精选`

    // 圈子
    case 'group:join':
      if (data.state === 'passed') return `你已被同意加入圈子「${data.group.name}」`
      else if (data.state === 'rejected') return `你已被拒绝加入圈子「${data.group.name}」`
      return `${data.user.name}请求加入圈子「${data.group.name}」`
    case 'group:transform':
      return `${data.user.name}将圈子「${data.group.name}」转让给你了`
    case 'group:post-reward':
      return `你的帖子「${data.post.title}」被${data.sender.name}打赏了`
    case 'group:comment-pinned':
    case 'group:send-comment-pinned':
      return `你的帖子「${data.post.title}」的评论置顶请求被${data.state !== 'reject' ? '同意' : '拒绝'}了`
    case 'group:post-pinned':
      return `你的帖子「${data.post.title}」的置顶请求被${data.state !== 'rejected' ? '同意' : '拒绝'}了`
    case 'group:pinned-admin':
      return `你的帖子「${data.post.title}」已被管理员置顶`

    case 'report':
      return `你举报的内容平台已处理：${data.subject}`
  }
}
