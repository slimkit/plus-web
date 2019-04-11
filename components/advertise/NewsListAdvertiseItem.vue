<template>
  <li class="c-news-list-item">
    <div class="news-image">
      <a :href="news.data.link" :target="getLinkTarget(news.data.link)">
        <AsyncFile
          type="image-wrap"
          :max-width="220"
          :max-height="160"
          :url="news.data.image || {}"
        />
      </a>
    </div>
    <a
      class="news-body"
      :href="news.data.link"
      :target="getLinkTarget(news.data.link)"
    >
      <div class="news-content">
        <h2 class="news-title text-cut-2">{{ news.title }}</h2>
        <div class="news-subject text-cut-3"> {{ news.data.content }} </div>
      </div>
      <div class="news-bottom">
        {{ news.data.name }} · {{ news.data.time | fromNow({full: true}) }}
        <span class="badge ad">广告</span>
      </div>
    </a>
  </li>
</template>

<script>

export default {
  name: 'NewsListAdvertiseItem',
  props: {
    news: { type: Object, required: true },
  },
  computed: {

  },
  methods: {
    getFileUrl (url) {
      if (url.match(new RegExp('/api/v2/files/\\d+$'))) url += '?w=235'
      return url
    },
    getLinkTarget (url) {
      const host = location.origin
      if (url.match(new RegExp(`^${host}`))) return null
      return '_blank'
    },
  },
}
</script>

<style lang="less" scoped>
.c-news-list-item {
  display: flex;
  height: 180px;
  justify-content: space-between;

  .news-image {
    flex: none;
    width: 220px;
  }

  .news-body {
    flex: auto;
    display: flex;
    flex-direction: column;
    margin-left: 24px;

    .news-title {
      margin-bottom: 12px;
    }

    .new-subject {
      font-size: @font-size-base;
      color: @text-color;
    }

    .news-bottom {
      margin-top: auto;
      font-size: @font-size-small;
      color: @text-info-color;

      .badge {
        padding: 0 4px;
        margin-left: 8px;
        border: 1px solid @border-color-base;
        border-radius: @border-radius-small;
        color: @text-info-color;
      }
    }
  }
}
</style>
