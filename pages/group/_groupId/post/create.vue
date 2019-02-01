<template>
  <div class="p-group-post-edit">
    <main class="main-container">
      <form @submit.prevent>
        <input
          v-model="title"
          class="title-input"
          type="text"
          maxlength="20"
          placeholder="请在此输入20字以内的标题"
        >
        <MarkdownEditor
          v-model="content"
          class="markdown-editor"
          init-content="123"
          placeholder="请输入帖子内容， 支持 Markdown 语法"
        />
        <ICheckbox
          v-model="syncToFeed"
          class="sync-feed"
          :true-value="1"
          :false-value="0"
          size="large"
        >
          同步分享至动态
        </ICheckbox>
        <IButton
          class="submit-btn"
          type="primary"
          size="large"
          html-type="submit"
          @click="onSubmit"
        >
          确定
        </IButton>
      </form>
    </main>

    <aside class="side-wrap">
      <SideWidgetGroupRecommend key="recommend-group" />
    </aside>
  </div>
</template>

<script>
import MarkdownEditor from '@/components/common/MarkdownEditor.vue'
import SideWidgetGroupRecommend from '@/components/group/SideWidgetGroupRecommend.vue'

export default {
  name: 'GroupPostEdit',
  head () {
    return {
      title: `发布帖子 - ${this.group.name}`,
    }
  },
  middleware: ['reuqireAuth'],
  components: {
    MarkdownEditor,
    SideWidgetGroupRecommend,
  },
  data () {
    return {
      group: { name: '圈子' },
      title: '',
      content: '',
      syncToFeed: 0,
    }
  },
  computed: {
    groupId () {
      return Number(this.$route.params.groupId)
    },
    allowSyncToFeed () {
      return this.group.allow_feed || false
    },
    form () {
      const form = {
        title: this.title,
        body: this.content,
        summary: this.content.substr(0, 100),
      }
      // TODO: 上传图片
      if (this.allowSyncToFeed) {
        Object.assign(form, {
          sync_feed: this.syncToFeed || null,
          feed_form: 1,
        })
      }
      return form
    },
  },
  mounted () {
    this.fetchGroupInfo()
  },
  methods: {
    async fetchGroupInfo () {
      this.group = await this.$axios.$get(`/plus-group/groups/${this.groupId}`)
      if (!this.group.joined) {
        this.$Message.error('请先加入圈子')
        this.$router.back()
      }
    },
    async onSubmit () {
      if (!this.title) return this.$Message.error('帖子标题必填')
      if (!this.content) return this.$Message.error('帖子内容必填')
      const { post } = await this.$axios.$post(`/plus-group/groups/${this.groupId}/posts`, this.form)
      this.$Message.success('发布成功')
      this.$router.replace(`/group/${post.group_id}/post/${post.id}`)
    },
  },
}
</script>

<style lang="less" scoped>
.p-group-post-edit {
  display: flex;

  .main-container {
    flex: auto;
    margin-right: 30px;
    padding: 50px 80px;
    background-color: #fff;

    form {
      display: flex;
      flex-direction: column;
      align-items: center;

      .title-input {
        width: 100%;
        margin-bottom: 16px;
        padding: 8px 0;
        border: none;
        .border(bottom);
        font-size: @font-size-large * 1.3;
        font-weight: bold;
        .placeholder-color(@text-info-color);
      }

      .markdown-editor {
        width: 100%;
      }

      .sync-feed {
        margin-top: 16px;
        align-self: flex-start;
      }

      .submit-btn {
        margin-top: 16px;
        width: fit-content;
      }
    }
  }

  .side-wrap {
    flex: none;
    width: @sidebar-width;
  }
}
</style>
