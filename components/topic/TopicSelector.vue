<template>
  <div class="c-topic-selector">
    <IInput
      v-model.trim="keyword"
      search
      placeholder="搜索话题"
    />

    <template v-if="!keyword">
      <h4 class="topic-title">热门话题</h4>
      <ul class="topic-list">
        <li v-for="topic in hotTopics" :key="topic.id">
          <a @click="onSelectTopic(topic)">{{ topic.name }}</a>
        </li>
      </ul>
    </template>

    <div v-else class="search-container">
      <ISpin v-if="searchLock" fix />

      <template v-else-if="result.length">
        <h4 class="topic-title">为你找到以下话题</h4>
        <ul class="topic-list">
          <li v-for="topic in result" :key="topic.id">
            <a @click="onSelectTopic(topic)" v-html="topic.highlight" />
          </li>
        </ul>
      </template>
      <div
        v-else
        v-empty:search
        class="empty"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TopicSelector',
  data () {
    return {
      result: [],
      keyword: '',
      searchLock: false,
    }
  },
  computed: {
    ...mapState('topic', {
      hotTopics: 'hot',
    }),
    isSearchMode () {
      return this.keyword
    },
  },
  watch: {
    keyword (val) {
      if (val) {
        this.searchTopicByKeyword()
        this.searchLock = true
      } else {
        this.result = []
        this.searchLock = false
      }
    },
  },
  mounted () {
    if (!this.hotTopics.length) this.getHotTopicList()
  },
  methods: {
    ...mapActions('topic', {
      getHotTopicList: 'getHotTopicList',
    }),
    onSelectTopic (topic) {
      this.$emit('select', topic)
    },
    searchTopicByKeyword: _.debounce(async function () {
      if (!this.keyword) return
      this.result = []
      const params = { limit: 8, q: this.keyword }
      const result = await this.$axios.$get('/feed/topics', { params })
      const regex = new RegExp(`(${this.keyword})`, 'ig')
      this.result = result.map(topic => {
        topic.highlight = topic.name.replace(regex, '<span class="keyword">$1</span>')
        return topic
      })
      this.searchLock = false
    }, 450),
  },
}
</script>

<style lang="less" scoped>
.c-topic-selector {
  padding: 22px;
  width: 300px;

  .topic-title {
    margin-top: 12px;
  }

  .topic-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 8px;

    > li {
      padding: 4px 0;
    }
  }

  .search-container {
    position: relative;
    min-height: 100px;
  }

  /deep/ .keyword {
    color: @primary-color;
  }

  .empty {
    height: 300px;
  }
}
</style>
