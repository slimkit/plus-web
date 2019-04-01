<template>
  <li class="c-news-list-item">
    <div class="news-image">
      <AsyncFile
        type="image-wrap"
        :max-width="260"
        :max-height="160"
        :file="news.image || {}"
      />
    </div>
    <div class="news-body">
      <div class="news-content">
        <h2 class="news-title text-cut-2">{{ news.title }}</h2>
        <div class="news-subject text-cut-3"> {{ news.subject }} </div>
      </div>
      <div class="news-bottom">
        <span v-if="!categoryId" class="badge">{{ news.category.name }}</span>
        {{ news.from }} · {{ news.created_at }}
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'NewsListItem',
  props: {
    news: { type: Object, required: true },
    categoryId: { type: Number, default: null },
  },
}
</script>

<style lang="less" scoped>
.c-news-list-item {
  display: flex;
  height: 200px;
  justify-content: space-between;

  .news-image {
    flex: none;
    width: 240px;
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
        margin-right: 8px;
        border: 1px solid @primary-color;
        border-radius: @border-radius-base;
        color: @primary-color;
      }
    }
  }
}
</style>
