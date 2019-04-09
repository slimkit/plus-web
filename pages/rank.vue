<template>
  <div class="p-rank-index">
    <nav class="nav-wrap">
      <nuxt-link to="/rank/user">用户排行榜</nuxt-link>
      <nuxt-link to="/rank/qa">问答排行榜</nuxt-link>
      <nuxt-link to="/rank/feed">动态排行榜</nuxt-link>
      <nuxt-link to="/rank/news">资讯排行榜</nuxt-link>
    </nav>

    <main>
      <nuxt-child class="rank-list-wrap" />
    </main>
  </div>
</template>

<script>
export default {
  name: 'RankHome',
  head () {
    return {
      title: '排行榜',
    }
  },
  fetch ({ route, redirect }) {
    if (route.name === 'rank') return redirect(301, '/rank/user')
  },
}
</script>

<style lang="less">
.p-rank-index {
  background-color: #fff;

  .nav-wrap {
    display: flex;
    height: 80px;
    margin-bottom: 1px;
    .border(bottom);

    > a {
      display: inline-flex;
      align-items: center;
      color: @disabled-color;
      margin-left: 40px;

      &.active {
        color: unset;
      }
    }
  }

  > main {
    .rank-list-wrap {
      display: flex;
      flex-wrap: wrap;

      > .c-rank-list {
        flex: none;
        width: 50%;
        min-width: 0;

        &:nth-child(odd) {
          .border(right);
        }
      }
    }
  }
}
</style>
