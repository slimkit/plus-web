<template>
  <div class="c-post-answer">
    <header v-if="answer" class="question-wrap">
      <h2>{{ question.subject }}</h2>
    </header>
    <header v-else class="user-wrap">
      <Avatar :user="logged" />
      <div class="user-info">
        <h4>{{ logged.name }}</h4>
        <TagList :tags="userTags" size="sm" />
      </div>
    </header>

    <MarkdownEditor
      v-model="content"
      :init-content="initContent"
      class="markdown-editor"
      placeholder="开始你的表演，支持 Markdown 语法"
    />

    <footer class="footer">
      <Checkbox
        v-model="anonymity"
        class="anonymity"
        size="large"
      >
        启动匿名
      </Checkbox>

      <Button
        class="submit-btn"
        type="primary"
        :loading="submitLock"
        @click="onSubmit"
      >
        提交
      </Button>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import markdown from '@/utils/markdown'
import MarkdownEditor from '@/components/common/MarkdownEditor.vue'
import TagList from '@/components/tag/TagList.vue'

export default {
  name: 'PostAnswer',
  components: {
    MarkdownEditor,
    TagList,
  },
  props: {
    question: { type: Object, required: true },
    answer: { type: Object, default: null },
  },
  data () {
    return {
      content: '',
      anonymity: false,
      initContent: '',

      submitLock: false,
    }
  },
  computed: {
    ...mapState('user', {
      userTags: 'userTags',
    }),
  },
  mounted () {
    if (this.answer) {
      this.content = this.answer.body
      this.initContent = markdown(this.content)
      this.activated = this.anonymity
    } else if (!this.userTags.length) this.getCurrentUserTags()
  },
  methods: {
    ...mapActions('user', {
      getCurrentUserTags: 'getCurrentUserTags',
    }),
    async onSubmit () {
      if (this.answer) return this.onPatchAnswer()

      this.submitLock = true
      const data = {
        body: this.content,
        anonymity: this.anonymity,
      }
      const { answer } = await this.$axios.$post(`/currrency-questions/${this.question.id}/answers`, data)
        .finally(() => {
          this.submitLock = false
        })
      this.$Message.success('回答成功！')
      this.$router.push(`/question/${this.question.id}/answer/${answer.id}`)
    },
    async onPatchAnswer () {
      this.submitLock = true
      const data = {
        body: this.content,
        anonymity: this.anonymity,
      }
      await this.$axios.$patch(`/question-answers/${this.answer.id}`, data)
        .finally(() => {
          this.submitLock = false
        })
      this.$Message.success('修改成功')
      this.$emit('after-patch')
    },
  },
}
</script>

<style lang="less" scoped>
.c-post-answer {
  .question-wrap {
    margin-bottom: 16px;
  }

  .user-wrap {
    display: flex;
    margin-bottom: 16px;

    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 16px;
    }
  }

  .footer {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    margin-top: 16px;

    .submit-btn {
      margin-left: auto;
    }
  }
}
</style>
