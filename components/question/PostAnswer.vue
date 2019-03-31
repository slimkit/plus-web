<template>
  <div class="c-post-answer">
    <header class="user-wrap">
      <Avatar :user="logged" />
      <div class="user-info">
        <h4>{{ logged.name }}</h4>
        <TagList :tags="userTags" size="sm" />
      </div>
    </header>

    <MarkdownEditor
      v-model="content"
      class="markdown-editor"
      placeholder="开始你的表演，支持 Markdown 语法"
    />

    <footer class="footer">
      <ICheckbox
        v-model="anonymity"
        class="anonymity"
        size="large"
      >
        启动匿名
      </ICheckbox>

      <IButton
        class="submit-btn"
        type="primary"
        @click="onSubmit"
      >
        提交
      </IButton>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { filterHTMLTags } from '@/utils/text'
import MarkdownEditor from '@/components/common/MarkdownEditor.vue'
import TagList from '@/components/tag/TagList.vue'

export default {
  name: 'PostAnswer',
  components: {
    MarkdownEditor,
    TagList,
  },
  props: {
    questionId: { type: Number, required: true },
  },
  data () {
    return {
      content: '',
      anonymity: false,
    }
  },
  computed: {
    ...mapState('user', {
      userTags: 'userTags',
    }),
  },
  mounted () {
    if (!this.userTags.length) this.getCurrentUserTags()
  },
  methods: {
    ...mapActions('user', {
      getCurrentUserTags: 'getCurrentUserTags',
    }),
    async onSubmit () {
      const data = {
        body: this.content,
        text_body: filterHTMLTags(this.content),
        anonymity: this.anonymity,
      }
      const { answer } = await this.$axios.$post(`/questions/${this.questionId}/answers`, data)
      this.$Message.success('回答成功！')
      this.$router.push(`/question/${this.questionId}/answer/${answer.id}`)
    },
  },
}
</script>

<style lang="less" scoped>
.c-post-answer {
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
    margin-top: 16px;

    .submit-btn {
      margin-left: auto;
    }
  }
}
</style>
