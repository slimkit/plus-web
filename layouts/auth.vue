<template>
  <div class="layout-auth">
    <header class="header">
      <nav class="container">
        <nuxt-link
          to="/"
          class="logo"
          :style="{backgroundImage: `url(${require('@/assets/images/logo.png')})`}"
        />
        <ul class="buttons">
          <nuxt-link to="/auth/register">注册</nuxt-link>
          <a href="http://www.thinksns.com" target="_blank">TS+ 官网</a>
        </ul>
      </nav>
    </header>

    <div class="wrap container">
      <nuxt />

      <footer class="footer">
        <p class="copyright">Copyright © 2018 Chengdu ZhiYiChuangXiang Technology Co., Ltd. All rights reserved.</p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
}
</script>

<style lang="less" scoped>
.layout-auth {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;

  .header {
    height: 80px;
    background-color: #fff;

    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }

    .logo {
      flex: none;
      min-width: 0;
      display: flex;
      align-items: center;
      margin-right: 24px;
      height: @layout-header-height;
      width: @layout-header-height;
      background: center / contain no-repeat;
    }

    .buttons {
      font-size: @font-size-large;

      > a {
        padding: 3px 22px;
        .border(right);
        color: @text-info-color;

        &:last-child {
          border: none;
        }
      }
    }
  }

  .wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 640px;
    height: 100%;
  }

  .footer {
    margin-top: 30px;
    text-align: center;

    .copyright {
      color: @text-info-color;
    }
  }

}
</style>
