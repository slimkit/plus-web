<template>
  <nav class="c-common-header">
    <img src="" class="logo">
    <div class="container">
      <ul class="menu">
        <nuxt-link
          v-for="(item, index) in menu"
          :key="index"
          tag="li"
          class="menu-item"
          :to="{name: item.link}"
        >
          {{ item.label }}
        </nuxt-link>
      </ul>
    </div>
    <div class="extra">
      <nuxt-link class="login-btn" :to="{name: 'auth-login'}">登录</nuxt-link>
      <nuxt-link class="login-btn" :to="{name: 'auth-register'}">注册</nuxt-link>
      <Input
        class="search-box"
        search
        placeholder="输入关键词搜索"
      />
    </div>
  </nav>
</template>

<script>
const menu = [
  { name: 'feed', label: '动态', link: 'feed' },
  { name: 'news', label: '资讯', link: 'news' },
]

export default {
  name: 'CommonHeader',
  data () {
    return {
      menu,
    }
  },
}
</script>

<style lang="less">
.c-common-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: @layout-header-height;
  background-color: @head-bg;

  .logo {
    flex: none;
  }

  .container {
    flex: auto;
    height: 100%;
  }

  .menu {
    display: flex;
    align-items: center;
    max-width: 1080;
    margin: 0 auto;
    height: 100%;

    .menu-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 1em;
      margin-right: 2em;
      font-size: @font-size-large;
      cursor: pointer;

      &.nuxt-link-exact-active,
      &:hover {
        color: @primary-color;
        font-weight: bold;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          display: block;
          height: 2px;
          width: 100%;
          background-color: @primary-color;
        }
      }
    }
  }

  .extra {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    height: 100%;
    margin-right: 24px;

    .login-btn {
      display: flex;
      justify-content: center;
      font-size: @font-size-base;
      width: 6em;
    }

    .search-box {
      margin-right: 12px;

      .ivu-input {
        border-radius: 100px;
        background-color: @background-color-base;
        padding: 0 1em;
      }
    }
  }
}
</style>
