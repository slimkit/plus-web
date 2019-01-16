<template>
  <nav class="c-feed-left-navigation">
    <nuxt-link
      v-for="item in menu"
      :key="item.name"
      :to="item.route"
      class="item"
      :class="{active: item.name === current}"
    >
      <svg class="icon lg"><use :xlink:href="item.icon" /></svg>
      <span class="label">{{ item.label }}</span>
    </nuxt-link>
  </nav>
</template>

<script>
const menu = [
  { name: 'feed', label: '全部动态', icon: '#icon-dynamic', route: '/feed' },
  { name: 'user', label: '我的动态', icon: '#icon-mydynamic', route: '/user' },
  { name: 'fans', label: '我的粉丝', icon: '#icon-myfans', route: '/fans' },
  { name: 'follow', label: '关注的人', icon: '#icon-attention', route: '/follow' },
  { name: 'rank', label: '排行榜', icon: '#icon-rank', route: '/rank' },
  { name: 'collect', label: '收藏的', icon: '#icon-collection', route: '/user/collect' },
  { name: 'setting', label: '设置', icon: '#icon-sets', route: '/setting' },
]

export default {
  name: 'FeedLeftNavigation',
  props: {
    current: { type: String, default: 'feed' },
  },
  data () {
    return {
      menu,
    }
  },
}
</script>

<style lang="less" scoped>
.c-feed-left-navigation {
  display: flex;
  flex-direction: column;
  padding: 20px 0;

  .item {
    display: flex;
    align-items: center;
    margin-bottom: 36px;
    font-size: @font-size-large;

    &.active {
      color: @primary-color;
      font-weight: bold;
    }

    .label {
      margin-left: 0.5em;
    }
  }
}
</style>
