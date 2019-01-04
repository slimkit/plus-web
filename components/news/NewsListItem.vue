<template>
  <section class="c-news-list-item">
    <div class="news-image">
      <AsyncFile
        class="news-"
        type="image"
        :file="news.image"
      />
    </div>
    <div class="news-body">
      <div class="news-content">
        <a class="news-title">{{ news.title }}</a>
        <div class="news-subject">
          {{ news.subject }}
        </div>
      </div>
      <div class="news-bottom">
        {{ news.author }}·{{ news.created_at }}
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NewsListItem',
  props: {
    news: { type: Object, required: true },
  },
}
</script>

<style lang="less" scoped>
.c-news-list-item {
  display: flex;
  padding: 10px;
  height: 200px;
  justify-content: space-between;
}
  &:last-child {
    border-bottom: none;
  }

  .news-image img{
      width: 260px;
      height: 180px;
  }

  .news-body {
      width: 450px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
  }
    .news-content {
      height: 160px;
    }

      .news-title {
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
        font-size: @font-size-large;
      }

      .new-subject {
        font-size: @font-size-base;
        color: @text-color;
      }
    .news-bottom {
      font-size: @font-size-small;
      color: @text-info-color;
    }
</style>
