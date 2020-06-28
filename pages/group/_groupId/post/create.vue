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
import GroupPostCreate from '@/pages/group/post/create.vue'

export default {
  name: 'GroupPostCreate',
  head () {
    return {
      title: `发布帖子 - ${this.group.name}`,
    }
  },
  extends: GroupPostCreate,
  data () {
    return {
      group: { name: '圈子' },
    }
  },
  computed: {
    groupId () {
      return +this.$route.params.groupId
    },
    currentGroup () {
      return this.group
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
  },
}
</script>
