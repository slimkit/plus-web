<template>
  <div class="p-group-detail">
    <div class="main-wrap">
      <header class="group-header">
        <nav class="bread-wrap">
          <Breadcrumb separator="&gt;">
            <BreadcrumbItem to="/group">圈子</BreadcrumbItem>
            <BreadcrumbItem :to="`/group?type=${group.category_id}`">{{ group.category.name }}</BreadcrumbItem>
            <BreadcrumbItem>{{ group.name }}</BreadcrumbItem>
          </Breadcrumb>

          <Input
            v-model="searchKeyword"
            search
            :readonly="isPreview"
            placeholder="输入关键字搜索"
            @on-focus="capturePreview"
            @on-search="onSearchPosts"
          />
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
            <h1>
              {{ group.name }}
              <Poptip
                v-model="showShareMenu"
                class="more"
                placement="bottom"
              >
                <svg class="icon pointer"><use xlink:href="#icon-more" /></svg>

                <template v-slot:content>
                  <ul class="options" @click="showShareMenu = false">
                    <li @click="onRepost"><svg class="icon"><use xlink:href="#icon-share" /></svg>转发</li>
                  </ul>
                </template>
              </Poptip>
            </h1>
            <div class="group-desc">
              <p class="description text-cut-2">{{ group.summary }}</p>
              <Poptip
                trigger="hover"
                placement="bottom"
                class="poptip-social-share"
              >
                <template v-slot:default>
                  <a><svg class="icon"><use xlink:href="#icon-share" /></svg> 分享</a>
                </template>

                <template v-slot:content>
                  <SocialShare
                    :title="group.name"
                    :description="group.summary"
                    :image="group.avatar.url"
                  />
                </template>
              </Poptip>
            </div>
            <div class="meta-wrap">
              <span>帖子 <span class="primary-color">{{ group.posts_count || 0 }}</span></span>
              <span>成员 <span class="primary-color">{{ group.users_count || 0 }}</span></span>

              <address :title="location">
                <svg class="icon"><use xlink:href="#icon-position" /></svg>
                <span class="primary-color text-cut">{{ location }}</span>
              </address>

              <Button
                class="report-btn"
                type="text"
                @click="onReport"
              >
                举报圈子
              </Button>
              <Button
                class="join-btn"
                type="primary"
                shape="circle"
                :disabled="!!joined.role || joinLock"
                @click="onJoinGroup"
              >
                <template v-if="joined.role">
                  已加入
                </template>
                <!-- TODO: 申请加入待审核, 接口无返回此数据 2019-01-25
                <template v-else-if="">
                </template>
                -->
                <template v-else>
                  <svg class="icon sm"><use xlink:href="#icon-add" /></svg>
                  加入
                </template>
              </Button>
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

      <main
        class="post-container"
        :class="{preview: isPreview}"
        @click.capture="capturePreview"
      >
        <nav class="nav-wrap">
          <template v-if="joined.role">
            <nuxt-link
              replace
              :class="{'exact-active': type === 'new'}"
              :to="{query: {type: 'new'}}"
            >
              最新帖子
            </nuxt-link>
            <nuxt-link
              replace
              :class="{'exact-active': type === 'reply'}"
              :to="{query: {type: 'reply'}}"
            >
              最新回复
            </nuxt-link>
            <nuxt-link
              replace
              :class="{'exact-active': type === 'excellent'}"
              :to="{query: {type: 'excellent'}}"
            >
              精华帖子
            </nuxt-link>
          </template>
          <template v-else>
            <nuxt-link
              replace
              :class="{'exact-active': type === 'preview'}"
              :to="{query: {type: 'preview'}}"
            >
              帖子预览
            </nuxt-link>
          </template>
        </nav>

        <Loadmore
          ref="loader"
          :show-bottom="mixedPosts.length > 0"
          @refresh="onRefresh"
          @loadmore="onLoadmore"
        >
          <div
            v-if="type !== 'search' && !mixedPosts.length"
            key="no-content"
            v-empty:content
          />
          <div
            v-if="type === 'search' && !searchPosts.length"
            key="no-search"
            v-empty:search
          />
          <GrouppostList :posts="mixedPosts" />
        </Loadmore>
      </main>
    </div>

    <aside class="side-wrap">
      <div :class="{preview: isPreview}" @click.capture="capturePreview">
        <nuxt-link to="post/create" append>
          <Button
            class="post-btn"
            type="primary"
            shape="circle"
            size="large"
            long
          >
            <svg class="icon"><use xlink:href="#icon-writing" /></svg>
            发帖
          </Button>
        </nuxt-link>
      </div>

      <SideWidget
        key="notice"
        class="notice"
        title="圈子公告"
      >
        <template v-slot:default>
          <div class="notice-content text-cut-4">
            {{ group.notice }}
            <div v-if="!group.notice" class="no-notice">什么也没写</div>
          </div>
        </template>

        <template v-slot:footer>
          <footer
            v-if="group.notice"
            class="side-widget-footer"
            @click="onViewNotice"
          >
            查看详细公告
          </footer>

          <Modal
            v-model="showNotice"
            :footer-hide="true"
            title="圈子公告"
          >
            <article class="text-pre">{{ group.notice }}</article>
          </Modal>
        </template>
      </SideWidget>

      <SideWidget v-if="isManager">
        <nuxt-link
          to="manage"
          append
          class="manage"
        >
          <svg class="icon"><use xlink:href="#icon-setting" /></svg>
          圈子管理
        </nuxt-link>
      </SideWidget>

      <SideWidget
        key="members"
        class="members"
        title="圈子成员"
        type="user"
        :users="membersPreview.slice(0, 9).map(member => member.user)"
        :loading="!members.length"
      >
        <div class="founder-wrap">
          <Avatar :user="group.founder.user" />
          <div class="founder-info">
            <p>圈主：{{ group.founder.user.name }}</p>
            <Button
              v-if="!isMine"
              size="small"
              type="primary"
              @click="contactFounder"
            >
              联系圈主
            </Button>
          </div>
        </div>

        <hr>

        <footer
          v-if="members.length > 9"
          slot="footer"
          class="side-widget-footer"
          @click="showMembers = true"
        >
          查看更多成员
        </footer>

        <Modal
          v-model="showMembers"
          title="圈子成员"
          :footer-hide="true"
          :width="1050"
        >
          <GroupMembers
            v-if="showMembers"
            :group-id="groupId"
            :members="membersGrouped"
          />
        </Modal>
      </SideWidget>

      <SideWidgetGroupRecommend key="recommend-group" />
    </aside>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import { limit } from '@/utils'
import TagList from '@/components/tag/TagList.vue'
import GrouppostList from '@/components/group/GrouppostList.vue'
import GroupMembers from '@/components/group/GroupMembers.vue'
import SideWidget from '@/components/common/SideWidget.vue'
import SideWidgetGroupRecommend from '@/components/group/SideWidgetGroupRecommend.vue'
import SocialShare from '@/components/common/SocialShare.vue'

export default {
  name: 'GroupDetail',
  validate ({ params }) {
    return /^\d+$/.test(params.groupId)
  },
  head () {
    return {
      title: `${this.group.name} - 圈子`,
    }
  },
  components: {
    TagList,
    GrouppostList,
    GroupMembers,
    SideWidget,
    SideWidgetGroupRecommend,
    SocialShare,
  },
  data () {
    return {
      members: [],
      pinned: [],
      posts: [],
      searchPosts: [],
      searchKeyword: '',

      showNotice: false,
      showMembers: false,
      showShareMenu: false,
      joinLock: false,
    }
  },
  computed: {
    ...mapState('group', {
      group: 'current',
    }),
    groupId () {
      return Number(this.$route.params.groupId)
    },
    joined () {
      const { joined } = this.group
      return joined || {}
    },
    isPreview () {
      if (!this.joined.role) return true
      return false
    },
    type () {
      const { type, keyword } = this.$route.query
      if (this.isPreview) return 'preview'
      if (keyword) return 'search'
      return type || 'new'
    },
    keyword () {
      return this.$route.query.keyword || ''
    },
    isMine () {
      return this.joined.role === 'founder'
    },
    isManager () {
      return ['founder', 'administrator'].includes(this.joined.role)
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
      if (this.type === 'search') return this.searchPosts
      const pinneds = this.pinned.map(item => {
        item.pinned = true
        return item
      })
      return _.unionBy(pinneds, this.posts, 'id')
    },
    membersGrouped () {
      const members = _.filter(this.members, m => m.audit === 1 && !m.disabled)
      return _.groupBy(members, 'role')
    },
    membersPreview () {
      const { member = [], administrator = [] } = this.membersGrouped
      return [...administrator, ...member]
    },
    location () {
      let { location } = this.group
      if (!location) {
        const locationMap = ['水星', '金星', '火星', '土星', '地球']
        location = locationMap[Math.floor(Math.random() * locationMap.length)]
      }
      return location
    },
  },
  watch: {
    type (val) {
      if (val !== 'search') this.searchKeyword = ''
      this.loader.beforeRefresh()
    },
    keyword () {
      this.loader.beforeRefresh()
    },
  },
  async asyncData ({ params, store, $axios }) {
    const { groupId } = params
    if (store.state.group.current.id !== Number(groupId)) {
      await store.dispatch('group/getGroupDetail', groupId)
    }
  },
  mounted () {
    this.fetchGroupMembers()
  },
  methods: {
    async onRefresh () {
      if (this.isPreview) return this.fetchPreviewPosts()
      let noMore = true
      if (this.type === 'search') {
        const params = { limit, group_id: this.groupId, keyword: this.keyword }
        this.searchPosts = await this.$axios.$get('/plus-group/group-posts', { params })
        noMore = this.searchPosts.length < limit
      } else {
        const params = this.fetchParams
        const { pinneds, posts } = await this.$axios.$get(`/plus-group/groups/${this.groupId}/posts`, { params })
        this.posts = posts
        this.pinned = pinneds
        noMore = posts.length < limit
      }
      this.loader.afterRefresh(noMore)
    },
    async onLoadmore () {
      let noMore = true
      if (this.type === 'search') {
        const params = { limit, group_id: this.groupId, keyword: this.keyword, offset: this.searchPosts.length }
        const posts = await this.$axios.$get('/plus-group/group-posts', { params })
        this.searchPosts.push(...posts)
        noMore = posts.length < limit
      } else {
        const params = { ...this.fetchParams, offset: this.posts.length }
        const { posts } = await this.$axios.$get(`/plus-group/groups/${this.groupId}/posts`, { params })
        this.posts.push(...posts)
        noMore = posts.length < limit
      }
      this.loader.afterLoadmore(noMore)
    },
    async fetchPreviewPosts () {
      this.posts = await this.$axios.$get(`/group/groups/${this.groupId}/preview-posts`)
      this.loader.afterRefresh(true)

      // 拼接 user 字段 （预览接口返回的数据不含 user 字段）
      this.$nextTick(async () => {
        const usersId = this.posts.map(post => post.user_id)
        if (!usersId.length) return
        const params = { fetch_by: 'id', id: usersId.join(',') }
        const users = await this.$axios.$get('/users', { params })
        const usersMap = _.keyBy(users, 'id')
        this.posts.forEach((post, index) => {
          this.$set(this.posts[index], 'user', usersMap[post.user_id])
        })
      })
    },
    async onSearchPosts (keyword) {
      this.$router.replace({ query: { keyword } })
    },
    /**
     * 这里加载的成员只用于右边显示，加载更多成员放在组件里
     */
    async fetchGroupMembers () {
      const params = { limit: 9 }
      const members = await this.$axios.$get(`/plus-group/groups/${this.groupId}/members`, params)
      this.members = members
    },
    onViewNotice () {
      this.showNotice = true
    },
    contactFounder () {
      // TODO: 发起单聊
    },
    onReport () {
      this.$root.$emit('report', {
        type: 'group',
        id: this.group.id,
      })
    },
    onRepost () {
      this.$root.$emit('repost', {
        type: 'groups',
        source: this.group,
      })
    },
    async onJoinGroup () {
      this.joinLock = true
      const { message } = await this.$axios.$put(`/plus-group/groups/${this.group.id}`)
        .finally(() => {
          this.joinLock = false
        })
      this.$Message.success(message)
      await this.$store.dispatch('group/getGroupDetail', this.group.id)
    },
    capturePreview (event) {
      if (!this.isPreview) return
      event.preventDefault()
      event.stopPropagation()
      this.$Message.error('请先加入圈子')
    },
  },
}
</script>

<style lang="less" scoped>
.p-group-detail {
  display: flex;

  .preview > * {
    cursor:not-allowed;
  }

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

            &::before {
              content: '';
              position: absolute;
              top: 100%;
              left: 1px;
              display: block;
              width: 0;
              height: 0;
              border: 8px solid transparent;
              border-top-color: darken(@primary-color, 20%);
              border-right-color: darken(@primary-color, 20%);
            }
          }

          .c-avatar.xl {
            width: 120px;
            height: 120px;
          }
        }

        .group-info {
          flex: auto;
        }

        h1 {
          display: flex;
          font-size: @font-size-large * 1.4;
          margin-bottom: 16px;

          .more {
            margin-left: auto;
            font-weight: normal;
          }
        }

        .group-desc {
          display: flex;
          justify-content: space-between;
        }

        .description {
          color: @disabled-color;
          font-size: @font-size-small;
          margin-bottom: 16px;
          min-height: 36px;
        }

        .meta-wrap {
          display: flex;
          align-items: center;
          font-size: @font-size-small;

          > span {
            flex: none;
            margin-right: 8px;
          }

          address {
            display: flex;
            flex: auto;
            min-width: 0;
          }

          .report-btn {
            flex: none;
            margin-left: auto;
          }

          .join-btn {
            flex: none;
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

      &.preview {
        cursor: not-allowed;
      }

      .nav-wrap {
        margin-bottom: 16px;

        > a {
          margin-right: 16px;
          color: @disabled-color;

          &.exact-active {
            color: @text-color;
          }
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

    .notice-content {
      .no-notice {
        width: 100%;
        text-align: center;
        color: @text-info-color;
        font-style: italic;
      }
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
      display: block;
      padding: 16px;
      font-size: @font-size-large;

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
