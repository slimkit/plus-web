<template>
  <div class="p-setting-index">
    <aside class="nav-wrap">
      <nuxt-link to="/setting/profile"><svg class="icon"><use xlink:href="#icon-userinfo" /></svg> 基本资料</nuxt-link>
      <nuxt-link to="/setting/tag"><svg class="icon"><use xlink:href="#icon-tag" /></svg> 标签管理</nuxt-link>
      <nuxt-link to="/setting/certificate"><svg class="icon"><use xlink:href="#icon-auth" /></svg> 认证管理</nuxt-link>
      <nuxt-link to="/setting/security"><svg class="icon"><use xlink:href="#icon-password" /></svg> 安全设置</nuxt-link>
      <nuxt-link to="/setting/wallet"><svg class="icon"><use xlink:href="#icon-wallet" /></svg> 我的钱包</nuxt-link>
      <nuxt-link to="/setting/currency"><svg class="icon"><use xlink:href="#icon-currency" /></svg> 我的积分</nuxt-link>
      <nuxt-link to="/setting/account"><svg class="icon"><use xlink:href="#icon-account" /></svg> 账号管理</nuxt-link>
    </aside>

    <main class="container-wrap">
      <nuxt-child />
    </main>
  </div>
</template>

<script>
export default {
  name: 'SettingHome',
}
</script>

<style lang="less">
.p-setting-index {
  display: flex;

  > .nav-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: none;
    width: @sidebar-width;
    padding: 25px 0;
    background-color: @border-color-base;
    font-size: @font-size-large;

    > a {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 44px;
      width: 100%;
      margin: 8px 0;
      font-weight: bold;

      .icon {
        margin-right: 4px;
      }

      &.exact-active,
      &:hover {
        background-color: @primary-color;
        color: #fff;
      }
    }
  }

  > .container-wrap {
    flex: auto;
    padding: 40px;
    background-color: #fff;

    /* 子组件样式 */
    .nav-wrap {
      display: flex;
      height: 48px;
      .border(bottom);

      > a,
      > span {
        margin-right: 24px;
        cursor: pointer;
      }
    }
  }
}
</style>
