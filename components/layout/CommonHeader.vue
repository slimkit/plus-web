<template>
  <header class="c-common-header">
    <div class="container">
      <nuxt-link
        :to="{name: 'index'}"
        class="logo"
        :style="{backgroundImage: `url(${require('@/assets/images/logo.png')})`}"
      />
      <nav v-once class="main-navigation">
        <ul class="menu">
          <nuxt-link
            v-for="(item, index) in menu"
            :key="index"
            tag="li"
            class="menu-item"
            :to="item.to"
          >
            {{ item.label }}
          </nuxt-link>
        </ul>
      </nav>
      <div class="extra">
        <IPoptip v-if="logged" trigger="hover">
          <div class="user-wrap">
            <Avatar :user="logged" size="sm" />
            <span class="username text-cut">{{ logged.name }}</span>
          </div>

          <template slot="content">
            <ul class="popup">
              <nuxt-link class="popup-item" :to="`/user/${logged.id}`">个人主页</nuxt-link>
              <hr>
              <nuxt-link class="popup-item" to="/setting">
                <svg class="icon"><use xlink:href="#icon-setting" /></svg>
                设置
              </nuxt-link>
              <hr>
              <a class="popup-item" @click="onLogout">退出登录</a>
            </ul>
          </template>
        </IPoptip>
        <template v-else>
          <nuxt-link class="login-btn" :to="{name: 'auth-login'}">登录</nuxt-link>
          <nuxt-link class="login-btn" :to="{name: 'auth-register'}">注册</nuxt-link>
        </template>
        <IInput
          class="search-box"
          search
          placeholder="输入关键词搜索"
        />
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'

const menu = [
  { name: 'feed', label: '动态', to: { name: 'feed' } },
  { name: 'news', label: '资讯', to: { name: 'news' } },
  // { name: 'group', label: '圈子', to: '#' },
  // { name: 'qa', label: '问答', to: '#' },
  // { name: 'find', label: '找伙伴', to: '#' },
  // { name: 'about', label: '关于我们', to: '#' },
]

export default {
  name: 'CommonHeader',
  data () {
    return {
      menu,
    }
  },
  computed: {
    ...mapState('user', { logged: 'logged' }),
  },
  methods: {
    onLogout () {
      this.$Modal.confirm({
        title: '提示',
        content: '是否确认退出当前账号？',
        loading: true,
        onOk: async () => {
          await this.$store.dispatch('auth/logout')
          this.$Modal.remove()
          this.$Message.success('退出登录成功！')
          this.$router.push('/')
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.c-common-header {
  height: @layout-header-height;
  background-color: @head-bg;

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

  .main-navigation {
    flex: auto;
    height: 100%;
  }

  .menu {
    display: flex;
    align-items: center;
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

      &.active,
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

    .ivu-poptip {
      display: flex;
      align-items: center;
      padding: 0 24px;
      cursor: pointer;
      height: 100%;

      /deep/ .ivu-poptip-rel {
        height: 100%;
      }

      .user-wrap {
        display: flex;
        align-items: center;
        height: 100%;
      }

      .username {
        flex: none;
        margin-left: 12px;
        max-width: 8em;
      }
    }

    .popup {
      .popup-item {
        display: list-item;
        padding: 16px;

        .icon {
          margin-right: 8px;
        }
      }
    }

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
