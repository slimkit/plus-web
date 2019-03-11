<template>
  <div class="p-user-collect">
    <nav class="cate-wrap">
      <nuxt-link to="/user/collect/feed" replace> 动态 </nuxt-link>
      <nuxt-link to="/user/collect/news" replace>文章</nuxt-link>
      <nuxt-link to="/user/collect/post" replace> 帖子 </nuxt-link>
      <!--
      <nuxt-link :to="{params: {type: 'answer'}}" replace>回答</nuxt-link>
      -->
    </nav>

    <main class="collect-wrap">
      <keep-alive>
        <nuxt-child />
      </keep-alive>
    </main>
  </div>
</template>

<script>
export default {
  name: 'UserCollect',
  fetch ({ route, redirect }) {
    if (route.name === 'user-index-collect') return redirect(301, '/user/collect/feed')
  },

}
</script>

<style lang="less" scoped>
.p-user-collect {
  .cate-wrap {
    margin-bottom: 16px;

    > a {
      margin-right: 16px;
      color: @disabled-color;

      &.exact-active {
        color: @text-color;
      }
    }
  }
}
</style>
