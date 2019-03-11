<template>
  <div class="p-setting-index">
    <aside class="nav-wrap">
      <nuxt-link
        v-for="item in navMap"
        :key="item.label"
        :to="item.to"
      >
        <svg v-if="item.icon" class="icon"><use :xlink:href="item.icon" /></svg>
        {{ item.label }}
      </nuxt-link>
    </aside>

    <main class="container-wrap">
      <nuxt-child />
    </main>
  </div>
</template>

<script>
const navMap = [
  { label: '基本资料', icon: '#icon-userinfo', to: '/setting/profile' },
  { label: '标签管理', icon: '#icon-tag', to: '/setting/tag' },
  { label: '认证管理', icon: '#icon-auth', to: '/setting/certificate' },
  { label: '安全设置', icon: '#icon-password', to: '/setting/security' },
  { label: '我的钱包', icon: '#icon-wallet', to: '/setting/wallet' },
  { label: '我的积分', icon: '#icon-currency', to: '/setting/currency' },
  { label: '账号管理', icon: '#icon-account', to: '/setting/account' },
]

export default {
  name: 'SettingHome',
  middleware: ['requireAuth'],
  data () {
    return {
      navMap,
    }
  },
  fetch ({ route, redirect }) {
    if (route.fullPath === '/setting') return redirect('/setting/profile')
  },
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

      &.active,
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
