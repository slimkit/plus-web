<template>
  <div ref="report" class="c-modal-report">
    <Modal
      ref="modal"
      v-model="show"
      :loading="true"
      :title="title"
      :transfer="false"
      @on-ok="onSubmit"
    >
      <textarea
        ref="editor"
        v-model="content"
        v-ctrl-enter="onSubmit"
        class="editor"
        placeholder="请输入举报理由，不超过190字"
      />
    </Modal>
  </div>
</template>

<script>
import { noop } from '@/utils'

const apiMap = {
  feed (id, reason) { return this.$axios.$post(`/feeds/${id}/reports`, { reason }) },
  news (id, reason) { return this.$axios.$post(`/news/${id}/reports`, { reason }) },
  group (id, reason) { return this.$axios.$post(`/plus-group/groups/${id}/reports`, { reason }) },
  post (id, reason) { return this.$axios.$post(`/plus-group/reports/posts/${id}`, { content: reason }) },
  question (id, reason) { return this.$axios.$post(`/questions/${id}/reports`, { reason }) },
  answer (id, reason) { return this.$axios.$post(`/question-answers/${id}/reports`, { reason }) },
  comment (id, reason) { return this.$axios.$post(`/report/comments/${id}`, { reason }) },
  user (id, reason) { return this.$axios.$post(`/report/users/${id}`, { reason }) },
  topic (id, reason) { return this.$axios.$put(`/user/report-feed-topics/${id}`, { message: reason }) },
}

export default {
  name: 'ModalReport',
  data () {
    return {
      title: '举报',
      show: false,
      content: '',
      type: null,
      id: null,
    }
  },
  created () {
    this.$root.$on('report', options => {
      this.type = options.type
      this.id = options.id
      this.callback = options.callback || noop
      this.open()
    })
  },
  destroyed () {
    this.$root.$off('report')
  },
  methods: {
    open () {
      this.show = true
      this.$nextTick(() => {
        this.$refs.editor.focus()
      })
    },
    close () {
      this.show = false
      this.content = ''
    },
    async onSubmit () {
      if (!this.content) return this.$Message.error('请输入举报理由')
      const api = apiMap[this.type].bind(this)
      await api(this.id, this.content)
      this.$Message.success('举报成功')
      this.close()
    },
  },
}
</script>

<style lang="less" scoped>
.c-modal-report {
  .editor {
    background-color: @background-color-base;
    width: 100%;
    min-height: 16px+22*2;
    max-height: 16px+22*5;
    padding: 8px;
    color: @text-color;
    font-size: @font-size-base;
    .border();
    .placeholder-color(@text-info-color);
  }
}
</style>
