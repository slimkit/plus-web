<template>
  <header class="c-common-header">
    <div class="container">
      <!-- LOGO -->
      <nuxt-link
        :to="{name: 'index'}"
        class="logo"
        :style="{backgroundImage: `url(${require('@/assets/images/logo.png')})`}"
      />

      <!-- 导航栏 -->
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

      <!-- 右侧 搜索 + 登录状态 -->
      <div class="extra">
        <IPoptip
          v-if="logged"
          key="user-status"
          class="user-status"
          trigger="hover"
        >
          <nuxt-link class="user-wrap" to="/user">
            <Avatar
              :user="logged"
              size="sm"
              :link="false"
            />
            <span class="username text-cut">{{ logged.name }}</span>
          </nuxt-link>

          <template v-slot:content>
            <ul class="popup">
              <nuxt-link class="popup-item" :to="`/user/${logged.id}`">个人主页</nuxt-link>
              <hr>
              <nuxt-link class="popup-item" to="/setting/wallet">
                <svg class="icon"><use xlink:href="#icon-wallet" /></svg>
                我的钱包
              </nuxt-link>
              <nuxt-link class="popup-item" to="/setting/certificate">
                <svg class="icon"><use xlink:href="#icon-auth" /></svg>
                我的认证
              </nuxt-link>
              <nuxt-link class="popup-item" to="/user/collect">
                <svg class="icon"><use xlink:href="#icon-collect" /></svg>
                我的收藏
              </nuxt-link>
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

        <IPoptip
          key="search"
          trigger="hover"
          class="search-wrap"
          placement="bottom"
        >
          <template v-slot:default>
            <IInput
              v-model="keyword"
              class="search-box"
              search
              placeholder="输入关键词搜索"
              @on-search="onSearch"
            />
          </template>

          <template v-slot:content>
            <ul v-if="keyword" class="options search-tips">
              <li v-for="item in searchTips" :key="item.to">
                <nuxt-link :to="`${item.to}?keyword=${keyword}`">
                  与<span class="primary-color">{{ keyword.length > 10 ? keyword.slice(0, 10) + '...' : keyword }}</span>相关的{{ item.label }}
                </nuxt-link>
              </li>
            </ul>
          </template>
        </IPoptip>
      </div>
    </div>
  </header>
</template>

<script>
const menu = [
  { name: 'feed', label: '动态', to: '/feed' },
  { name: 'topic', label: '话题', to: '/topic' },
  { name: 'news', label: '资讯', to: '/news' },
  { name: 'group', label: '圈子', to: '/group' },
  { name: 'qa', label: '问答', to: '/question' },
  { name: 'people', label: '找伙伴', to: '/people' },
  // { name: 'about', label: '关于我们', to: '#' },
]

const searchTips = [
  { label: '动态', to: `/search/feed` },
  { label: '话题', to: `/search/topic` },
  { label: '资讯', to: `/search/news` },
  { label: '问题', to: `/search/question` },
  { label: '专题', to: `/search/question-topic` },
  { label: '圈子', to: `/search/group` },
  { label: '用户', to: `/search/user` },
]

export default {
  name: 'CommonHeader',
  data () {
    return {
      menu,
      searchTips,
      keyword: '', // 搜索关键字
    }
  },
  mounted () {
    const keyword = this.$route.query.keyword
    if (keyword) this.keyword = keyword
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
    onSearch (keyword) {
      if (!keyword) return this.$Message.error('请输入关键字')
      if (this.$route.path.match(/^\/search/)) {
        this.$router.replace({ query: { keyword } })
      } else {
        this.$router.push(`/search?keyword=${keyword}`)
      }
    },
    viewUser () {
      this.$router.push('/user')
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
      padding: 0 0.75em;
      margin-right: 1.5em;
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
      width: 5em;
    }

    .search-wrap {
      position: relative;
      padding: 0;
      margin: 0 24px;

      /deep/ .ivu-poptip-popper {
        left: 0;
        width: 100%;
      }
    }

    .search-box {
      margin-right: 12px;
      max-width: 14em;

      .ivu-input {
        border-radius: 100px;
        background-color: @background-color-base;
        padding: 0 1em;
      }
    }
  }
}
</style>
