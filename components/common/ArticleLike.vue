<template>
  <section class="c-article-like">
    <div class="meta-item">
      <Button
        size="large"
        class="meta-button"
        @click="$emit('collect')"
      >
        <svg class="icon"><use xlink:href="#icon-collect" /></svg>
        {{ collectCount }} 人收藏
      </Button>
      <Button
        size="large"
        class="meta-button"
        @click="$emit('like')"
      >
        <svg class="icon"><use xlink:href="#icon-like" /></svg>
        {{ likeCount }} 人喜欢
      </Button>
    </div>

    <div class="meta-item">
      分享至：
      <svg class="icon lg share-icon" :style="{color: '#f97d72'}"><use xlink:href="#icon-weibo" /></svg>
      <svg class="icon lg share-icon" :style="{color: '#54c58c'}"><use xlink:href="#icon-weixin" /></svg>
      <svg class="icon lg share-icon" :style="{color: '#5fbddf'}"><use xlink:href="#icon-qq" /></svg>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ArticleLike',
  props: {
    collectCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    liked: { type: Boolean, default: false },

    /**
     * @property {Object} share
     * @property {string} share.title 分享标题
     * @property {string} share.content 分享内容
     * @property {string} share.link 分享链接
     * @property {string} share.image 图片链接
     */
    share: { type: Object, default: () => {} },
  },
}
</script>

<style lang="less" scoped>
.c-article-like {
  display: flex;
  justify-content: space-between;

  .meta-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .meta-button {
    margin-right: 12px;

    .icon {
      margin-right: 4px;
    }
  }

  .share-icon {
    margin-left: 8px;
  }
}
</style>
