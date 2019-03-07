<template>
  <div class="p-topic-index">
    <main class="main-container">
      <nav class="sort-items">
        <nuxt-link
          v-for="(item, name) in typeMap"
          :key="name"
          :to="{query: {type: name}}"
          replace
          class="sort-item"
          :class="{active: type === name}"
        >
          {{ item.label }}
        </nuxt-link>
      </nav>

      <Loadmore
        ref="loader"
        :show-bottom="type === 'new'"
        @refresh="onRefresh"
        @loadmore="onLoadmore"
      >
        <TopicList
          class="topic-list"
          :topics="topics"
        />
      </Loadmore>
    </main>

    <div class="right-container">
      <SideWidget class="topic-widget">
        <IButton
          type="primary"
          :long="true"
          size="large"
          shape="circle"
        >
          <h3><svg class="icon"><use xlink:href="#icon-topic4" /></svg> 创建话题</h3>
        </IButton>
      </SideWidget>

      <SideWidgetHotTopics
        key="recommend-topics"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SideWidget from '@/components/common/SideWidget.vue'
import SideWidgetHotTopics from '@/components/topic/SideWidgetHotTopics.vue'
import TopicList from '@/components/topic/TopicList.vue'
import { getLastField } from '@/utils'

const defaultType = 'hot'
const typeMap = {
  hot: { label: '热门' },
  new: { label: '最新' },
}

export default {
  name: 'TopicIndex',
  components: {
    SideWidget,
    SideWidgetHotTopics,
    TopicList,
  },
  data () {
    return {
      typeMap,
    }
  },
  computed: {
    ...mapState('topic', {
      hot: 'hot',
      new: 'new',
    }),
    type () {
      const { type } = this.$route.query
      if (!Object.keys(typeMap).includes(type)) return defaultType
      return type
    },
    topics () {
      return this[this.type] || []
    },
  },
  watch: {
    type () {
      this.loader.beforeRefresh()
    },
  },
  methods: {
    ...mapActions('topic', {
      getHotTopicList: 'getHotTopicList',
      getNewTopicList: 'getTopicList',
    }),
    async onRefresh () {
      const noMore = await this.getTopics()
      this.loader.afterRefresh(noMore)
    },
    async onLoadmore () {
      const params = { index: getLastField(this.new) }
      const noMore = await this.getTopics(params)
      this.loader.afterLoadmore(noMore)
    },
    getTopics (params) {
      switch (this.type) {
        case 'hot':
          return this.getHotTopicList()
        case 'new':
          return this.getNewTopicList(params)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.p-topic-index {
  display: flex;

  .main-container {
    flex: auto;
    background-color: #fff;
    margin-right: 30px;
    padding: 30px;

    .sort-items {
      padding-bottom: 20px;
      margin-bottom: 30px;
      .border(bottom);

      .sort-item {
        margin-right: 20px;
        font-size: @font-size-large;
        color: @disabled-color;

        &.active {
          color: @text-color;
        }
      }
    }
  }

  .right-container {
    flex: none;
    width: @sidebar-width;

    .topic-widget {
      background-color: #fff;
      padding: 24px;
    }
  }
}
</style>
