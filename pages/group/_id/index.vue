<template>
  <div class="p-group-detail">
    <div class="main-wrap">
      <header class="group-header">
        <nav class="bread-wrap">
          <IBreadcrumb separator=">">
            <IBreadcrumbItem to="/group">圈子</IBreadcrumbItem>
            <IBreadcrumbItem :to="`/group?type=${group.category_id}`">{{ group.category.name }}</IBreadcrumbItem>
            <IBreadcrumbItem>{{ group.name }}</IBreadcrumbItem>
          </IBreadcrumb>

          <IInput search placeholder="输入关键字搜索" />
        </nav>
        <hr>

        <div class="group-info-wrap">
          <figure class="group-avatar">
            <Avatar
              :user="group"
              :square="true"
              :link="false"
              size="xl"
            />

            <figcaption>{{ group.category.name }}</figcaption>
          </figure>

          <div class="group-info">
            <h1>{{ group.name }}</h1>
            <p class="description text-cut-2">{{ group.summary }}</p>
            <div class="meta-wrap">
              <span>帖子 <span class="primary-color">{{ group.posts_count || 0 }}</span></span>
              <span>成员 <span class="primary-color">{{ group.users_count || 0 }}</span></span>

              <address>
                <svg class="icon"><use xlink:href="#icon-position" /></svg>
                <span class="primary-color">{{ group.location }}</span>
              </address>

              <IButton
                class="report-btn"
                type="text"
                @click="onReport"
              >
                举报圈子
              </IButton>
              <IButton shape="circle" :disabled="true">已加入</IButton>
            </div>
          </div>
        </div>

        <div class="group-tags">
          <span>圈子标签</span>
          <TagList
            size="sm"
            :tags="group.tags"
            :selected="true"
          >
            我的天我好帅
          </TagList>
        </div>
      </header>

      <main class="post-container">
        <nav class="nav-wrap">
          <nuxt-link :to="{query: {type: 'new'}}">最新帖子</nuxt-link>
          <nuxt-link :to="{query: {type: 'reply'}}">最新回复</nuxt-link>
          <nuxt-link :to="{query: {type: 'excellent'}}">精华帖子</nuxt-link>
        </nav>

        <Loadmore
          ref="loader"
          @refresh="onRefresh"
          @loadmore="onLoadmore"
        >
          <GrouppostList :posts="mixedPosts" />
        </Loadmore>
      </main>
    </div>

    <aside class="side-wrap">
      <IButton
        class="post-btn"
        type="primary"
        shape="circle"
        size="large"
        long
      >
        <svg class="icon"><use xlink:href="#icon-writing" /></svg>
        发帖
      </IButton>

      <SideWidget
        key="notice"
        class="notice"
        title="圈子公告"
      >
        {{ group.summary }}

        <footer
          slot="footer"
          class="side-widget-footer"
          @click="viewNotice"
        >
          查看详细公告
        </footer>
      </SideWidget>

      <SideWidget>
        <div class="manage">
          <svg class="icon"><use xlink:href="#icon-setting" /></svg>
          圈子管理
        </div>
      </SideWidget>

      <SideWidget
        key="members"
        class="members"
        title="圈子成员"
        type="user"
        :users="members.map(member => member.user)"
        :loading="!members.length"
      >
        <div class="founder-wrap">
          <Avatar :user="group.founder.user" />
          <div class="founder-info">
            <p>圈主：{{ group.founder.user.name }}</p>
            <IButton
              size="small"
              type="primary"
              @click="contactFounder"
            >
              联系圈主
            </IButton>
          </div>
        </div>

        <hr>

        <footer
          v-if="members.length > 9"
          slot="footer"
          class="side-widget-footer"
        >
          查看更多成员
        </footer>
      </SideWidget>

      <SideWidgetGroupRecommend :groups="recommendGroups" />
    </aside>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import { limit } from '@/utils'
import TagList from '@/components/tag/TagList.vue'
import GrouppostList from '@/components/group/GrouppostList.vue'
import SideWidget from '@/components/common/SideWidget.vue'
import SideWidgetGroupRecommend from '@/components/group/SideWidgetGroupRecommend.vue'

export default {
  name: 'GroupDetail',
  head () {
    return {
      title: `${this.group.name} - 圈子`,
    }
  },
  components: {
    TagList,
    GrouppostList,
    SideWidget,
    SideWidgetGroupRecommend,
  },
  data () {
    return {
      group: {},
      members: [],
      pinned: [],
      posts: [],
    }
  },
  computed: {
    ...mapState('group', {
      recommendGroups: 'recommend',
    }),
    groupId () {
      return Number(this.$route.params.id)
    },
    type () {
      return this.$route.query.type || 'new'
    },
    fetchParams () {
      const params = { limit }
      switch (this.type) {
        case 'new': params.type = 'latest_post'; break
        case 'reply': params.type = 'latest_reply'; break
        case 'excellent': params.excellent = 1; break
      }
      return params
    },
    mixedPosts () {
      const pinneds = this.pinned.map(item => {
        item.pinned = true
        return item
      })
      return _.unionBy(pinneds, this.posts, 'id')
    },
  },
  async asyncData ({ params, $axios }) {
    const groupId = params.id
    const group = await $axios.$get(`/plus-group/groups/${groupId}`)
    return { group }
  },
  mounted () {
    this.fetchGroupMembers()
    this.getRecommendGroups({ limit: 5 })
  },
  methods: {
    ...mapActions('group', {
      getRecommendGroups: 'getRecommendGroups',
    }),
    async onRefresh () {
      const params = this.fetchParams
      const { pinneds, posts } = await this.$axios.$get(`/plus-group/groups/${this.groupId}/posts`, { params })
      this.posts = posts
      this.pinned = pinneds
      this.loader.afterRefresh(posts.length < limit)
    },
    async onLoadmore () {},
    /**
     * 这里加载的成员只用于右边显示，加载更多成员放在组件里
     */
    async fetchGroupMembers () {
      const params = { limit: 9 }
      const members = await this.$axios.$get(`/plus-group/groups/${this.groupId}/members`, params)
      this.members = members
    },
    viewNotice () {},
    contactFounder () {
      // TODO: 发起单聊
    },
    onReport () {
      this.$root.$emit('report', {
        type: 'group',
        id: this.group.id,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.p-group-detail {
  display: flex;

  .main-wrap {
    flex: auto;
    margin-right: 30px;

    .group-header {
      padding: 30px 40px;
      background-color: #fff;

      hr {
        margin: 16px 0;
      }

      .bread-wrap {
        display: flex;
        align-items: center;

        .ivu-input-wrapper {
          flex: none;
          width: 12em;
          margin-left: auto;
        }
      }

      .group-info-wrap {
        display: flex;

        .group-avatar {
          position: relative;
          flex: none;
          margin-right: 16px;

          figcaption {
            position: absolute;
            top: 12px;
            left: -16px;
            padding: 4px 1em;
            border-radius: 0 50px 50px 0;
            background-color: @primary-color;
            color: #fff;
            font-weight: bold;
          }

          .c-avatar.xl {
            width: 120px;
            height: 120px;
          }
        }

        h1 {
          font-size: @font-size-large;
          margin-bottom: 16px;
        }

        .description {
          color: @disabled-color;
          font-size: @font-size-small;
          margin-bottom: 16px;
        }

        .meta-wrap {
          display: flex;
          align-items: center;
          font-size: @font-size-small;

          > span {
            margin-right: 8px;
          }

          .report-btn {
            margin-left: auto;
          }
        }
      }

      .group-tags {
        display: flex;
        margin-top: 16px;

        > span {
          margin-right: 8px;
        }
      }
    }

    .post-container {
      margin-top: 30px;
      padding: 22px 40px;
      background-color: #fff;

      .nav-wrap {
        margin-bottom: 16px;

        > a {
          margin-right: 16px;
        }
      }
    }
  }

  .side-wrap {
    flex: none;
    width: @sidebar-width;

    .post-btn {
      margin-bottom: 30px;
    }

    .members {
      .founder-wrap {
        display: flex;

        .founder-info {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 16px;
        }
      }

      hr {
        margin: 16px -16px;
      }
    }

    .manage {
      padding: 16px;
      font-size: @font-size-large;
      cursor: pointer;

      .icon {
        margin-right: 8px;
      }
    }

    .side-widget-footer {
      display: flex;
      justify-content: center;
      padding: 8px;
      background-color: tint(@primary-color, 90%);
      color: @disabled-color;
      cursor: pointer;
    }
  }
}
</style>
