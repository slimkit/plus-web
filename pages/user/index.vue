<template>
  <div class="p-user-index">
    <header class="header">
      <figure class="cover">
        <div class="image" :style="{backgroundImage: `url(${userBackground})`}">
          <ISpin v-if="loading" fix />
        </div>
        <figcaption class="info-wrap">
          <Avatar
            class="avatar"
            :user="user"
            size="xl"
            :link="false"
          />
          <div class="user-info">
            <h1 class="username">
              {{ user.name }}
              <small>
                <svg class="icon"><use xlink:href="#icon-position" /></svg> {{ user.location }}
                |
                <svg class="icon"><use xlink:href="#icon-currency" /></svg> {{ user.currency.sum }} 积分
              </small>
            </h1>
            <p>{{ bio }}</p>
            <ul class="tags">
              <li
                v-for="tag in tags"
                :key="tag.id"
                class="tag-item"
              >
                {{ tag.name }}
              </li>
            </ul>
            <p v-if="user.verified">{{ user.verified.description }}</p>
          </div>
        </figcaption>
        <button
          v-if="!loading"
          class="change-btn"
          @click="onUpload"
        >
          更换封面
        </button>

        <Uploader
          ref="uploader"
          v-model="uploadCover"
          @finish="onUploadFinished"
        />
      </figure>
      <nav class="sub-navigation">
        <nuxt-link to="/user/feed">主页</nuxt-link>
        <nuxt-link to="/user/group">圈子</nuxt-link>
        <nuxt-link to="/user/question">问答</nuxt-link>
        <nuxt-link to="/user/news">资讯</nuxt-link>
        <nuxt-link to="/user/collect">收藏</nuxt-link>
      </nav>
    </header>

    <div class="main-wrap">
      <main class="user-container">
        <nuxt-child />
      </main>

      <div class="right-container">
        <SideWidget
          v-if="recommendUsers.length"
          key="recommend-user"
          :users="recommendUsers"
          type="user"
          title="推荐用户"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getObjectUrl } from '@/utils/file'
import SideWidget from '@/components/common/SideWidget.vue'

export default {
  name: 'UserHome',
  middleware: ['requireAuth'],
  components: {
    SideWidget,
  },
  data: function () {
    return {
      tags: [],

      loading: false,
      uploadCover: null,
    }
  },
  computed: {
    ...mapState('user', {
      recommendUsers: 'recommend',
    }),
    user () {
      return this.logged
    },
    bio () {
      return this.user.bio || '这家伙很懒，什么都没留下'
    },
    userBackground () {
      const bg = this.user.bg || {}
      return bg.url || require('@/assets/images/default_cover.jpg')
    },
  },
  async asyncData ({ route, redirect, $axios }) {
    // 首页重定向
    if (route.name === 'user') return redirect(301, '/user/feed')

    const tags = await $axios.$get('/user/tags')
    return {
      tags,
    }
  },
  mounted () {
    document.title = `${this.user.name} 的个人主页`
    this.$store.dispatch('user/fetchRecommendUsers')
  },
  methods: {
    onUpload () {
      this.$refs.uploader.select()
      this.loading = true
    },
    async onUploadFinished (image) {
      if (!image.error) {
        await this.$axios.$patch('/user', { bg: image.value })
        this.user.bg.url = getObjectUrl(image.file)
        this.$Message.success('更换封面成功！')
      }

      this.loading = false
    },
  },
}
</script>

<style lang="less">
.p-user-index {
  .header {
    .cover {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 456px;

      .image {
        position: absolute;
        height: 100%;
        width: 100%;
        background: #fff center / cover no-repeat;
        z-index: -1;
      }

      .change-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        padding: 5px 18px;
        border: 1px solid rgba(255,255,255,0.5);
        border-radius: 40px;
        background-color: rgba(0, 0, 0, .4);
        color: #fff;
        font-weight: bold;
        font-size: @font-size-large;
      }
    }

    .info-wrap {
      display: flex;
      padding: 32px;
      color: #fff;
      font-size: @font-size-large;

      .avatar {
        width: 160px;
        height: 160px;
        border: 4px solid #fff;
        border-radius: 50%;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 32px;
        font-weight: bold;
      }

      .username {
        font-size: 36px;

        > small {
          font-size: @font-size-large;
        }
      }

      ul.tags {
        display: flex;

        > li {
          padding: 2px 8px;
          border: 1px solid #fff;
          border-radius: @border-radius-small;
          font-size: @font-size-small;
          margin-right: 1em;
        }
      }
    }

    .sub-navigation {
      padding: 0 36px;
      background-color: #fff;
      font-size: @font-size-large;

      > a {
        display: inline-block;
        padding: 28px 4px;
        margin: 0 24px;

        &.active,
        &:hover {
          color: @primary-color;
          border-bottom: 1px solid @primary-color;
        }
      }
    }
  }

  .main-wrap {
    display: flex;
    margin-top: 30px;
  }

  .user-container {
    flex: auto;
    min-width: 0;
    background-color: #fff;
    padding: 30px 40px;
    margin-right: 30px;
  }

  .right-container {
    flex: none;
    width: 235px;
  }
}
</style>
