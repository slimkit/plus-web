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

        <Select
          v-model.number="selectedGroup"
          placeholder="请选择圈子"
          no-found-text="暂无加入的圈子，请先加入圈子"
          filterable
          class="group-selector"
          :transfer="true"
        >
          <Option
            v-for="group in joinedGroups"
            :key="group.id"
            :value="group.id"
            :label="group.name"
          />
        </Select>

        <MarkdownEditor
          v-model="content"
          class="markdown-editor"
          placeholder="请输入帖子内容，支持 Markdown 语法"
        />
        <Checkbox
          v-if="allowSyncToFeed"
          v-model="syncToFeed"
          class="sync-feed"
          :true-value="1"
          :false-value="0"
          size="large"
        >
          同步分享至动态
        </Checkbox>
        <Button
          class="submit-btn"
          type="primary"
          size="large"
          html-type="submit"
          @click="onSubmit"
        >
          确定
        </Button>
      </form>
    </main>

    <aside class="side-wrap">
      <SideWidgetGroupRecommend key="recommend-group" />
    </aside>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Message } from 'iview'
import MarkdownEditor from '@/components/common/MarkdownEditor.vue'
import SideWidgetGroupRecommend from '@/components/group/SideWidgetGroupRecommend.vue'
import { removeHTMLTags } from '@/utils'

export default {
  name: 'GroupPostCreate',
  head () {
    return {
      title: '发布帖子',
    }
  },
  middleware: ['requireAuth'],
  components: {
    MarkdownEditor,
    SideWidgetGroupRecommend,
  },
  data () {
    return {
      selectedGroup: null,
      title: '',
      content: '',
      syncToFeed: 0,
    }
  },
  computed: {
    ...mapState('group', {
      joinedGroups: 'joined',
    }),
    allowSyncToFeed () {
      return this.currentGroup.allow_feed || false
    },
    form () {
      const form = {
        title: this.title,
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
    currentGroup () {
      return this.joinedGroups.find(group => group.id === this.groupId) || {}
    },
    groupId () {
      return this.selectedGroup
    },
  },
  async beforeRouterEnter (to, from, next) {
    if (!this.store.state.group.joined.length) {
      Message.error('你还没有加入圈子，请先加入圈子')
      return next(false)
    }
    next()
  },
  methods: {
    async onSubmit () {
      if (!this.title) return this.$Message.error('帖子标题必填')
      if (!this.content) return this.$Message.error('帖子内容必填')
      const form = this.form
      form.body = this.content
      form.summary = removeHTMLTags(this.content).substr(0, 100)
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

      .group-selector {
        margin-bottom: 16px;
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
