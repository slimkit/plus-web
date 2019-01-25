<template>
  <div class="p-setting-tag">
    <nav class="nav-wrap">
      <span>选择标签</span>
    </nav>

    <section v-for="tagGroup in tags" :key="tagGroup.id">
      <p>{{ tagGroup.name }}</p>

      <TagList
        :tags="tagGroup.tags"
        :selected-tags="userTags"
        @append="onAppend"
        @remove="onRemove"
      />
    </section>

    <div class="selected-tags">
      <p>最多可选 {{ maxCount }} 个标签，已选 <span class="primary-color">{{ selected.length }}</span> 个</p>
      <TagList
        class="user-tags"
        :tags="userTags"
        :selected-tags="userTags"
        closeable
        @remove="onRemove"
      />
    </div>
  </div>
</template>

<script>
import TagList from '@/components/tag/TagList.vue'

export default {
  name: 'SettingTag',
  head: {
    title: '选择标签',
  },
  components: {
    TagList,
  },
  data () {
    return {
      maxCount: 5,
      userTags: [],
      tags: [],
      requestLock: false,
    }
  },
  computed: {
    selected () {
      return this.userTags.map(tag => tag.id)
    },
  },
  async asyncData ({ store, $axios }) {
    const [userTags, tags] = await Promise.all([
      $axios.$get('/user/tags'),
      $axios.$get('/tags'),
    ])
    return { userTags, tags }
  },
  methods: {
    async onAppend (tag) {
      if (this.requestLock) return
      if (this.userTags.length >= 5) return this.$Message.error('最多只能添加5个标签')
      this.requestLock = true
      await this.$axios.$put(`/user/tags/${tag.id}`, {}, { progress: true })
        .finally(() => {
          this.requestLock = false
        })
      this.userTags.push(tag)
    },
    async onRemove (tag) {
      if (this.requestLock) return
      this.requestLock = true
      await this.$axios.$delete(`/user/tags/${tag.id}`, { progress: true })
        .finally(() => {
          this.requestLock = false
        })
      this.userTags = this.userTags.filter(item => item.id !== tag.id)
    },
  },
}
</script>

<style lang="less" scoped>
.p-setting-tag {
  p {
    margin: 16px 0 8px;
  }

  .user-tags {
    padding: 8px 8px 0;
    .border();
  }

}
</style>