<template>
  <div class="p-user-group">
    <nav class="cate-wrap">
      <IPoptip
        v-model="showGroupCate"
        class="cate"
        placement="bottom"
      >
        <div class="label" :class="{active: ['groupJoined', 'groupAudit'].includes(type)}">
          <template>圈子</template>
          <i class="drop-icon" :class="{open: showGroupCate}" />
        </div>

        <template v-slot:content>
          <ul class="options" @click="showGroupCate = false">
            <li :class="{active: type == 'groupJoined'}" @click="type = 'groupJoined'">我加入的</li>
            <li class="disabled" @click="$Message.error('接口未实现')">待审核的</li>
          </ul>
        </template>
      </IPoptip>

      <IPoptip
        v-model="showPostCate"
        class="cate"
        placement="bottom"
      >
        <div class="label" :class="{active: ['post', 'postPinned', 'postPinnedAudit'].includes(type)}">
          <template>帖子</template>
          <i class="drop-icon" :class="{open: showPostCate}" />
        </div>

        <template v-slot:content>
          <ul class="options" @click="showPostCate = false">
            <li :class="{active: type == 'post'}" @click="type = 'post'">我发布的</li>
            <li :class="{active: type == 'postPinned'}" @click="type = 'postPinned'">已置顶的</li>
            <li :class="{active: type == 'postPinnedAudit'}" @click="type = 'postPinnedAudit'">置顶待审核</li>
          </ul>
        </template>
      </IPoptip>
    </nav>

    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <GroupList v-if="isGroup" :groups="groups" />
      <GrouppostList v-if="isPost" :posts="posts" />
    </Loadmore>
  </div>
</template>

<script>
import { limit } from '@/utils'
import GroupList from '@/components/group/GroupList.vue'
import GrouppostList from '@/components/group/GrouppostList.vue'

const groupTypeMap = {
  groupJoined: 'join',
  groupAudit: '', // TODO: 接口未实现
}

const postTypeMap = {
  post: 1,
  postPinned: 2,
  postPinnedAudit: 3,
}

export default {
  name: 'UserGroup',
  components: {
    GroupList,
    GrouppostList,
  },
  data () {
    return {
      groupJoined: [],
      groupAudit: [],
      post: [],
      postPinned: [],
      postPinnedAudit: [],

      showGroupCate: false,
      showPostCate: false,
    }
  },
  computed: {
    type: {
      get () {
        return this.$route.query.type || 'groupJoined'
      },
      set (type) {
        this.$router.replace({ query: { type } })
      },
    },
    isGroup () {
      return Object.keys(groupTypeMap).includes(this.type)
    },
    isPost () {
      return Object.keys(postTypeMap).includes(this.type)
    },
    groups () {
      if (!this.isGroup) return []
      return this.$data[this.type]
    },
    posts () {
      if (!this.isPost) return []
      return this.$data[this.type]
    },
  },
  watch: {
    type () {
      this.loader.beforeRefresh()
    },
  },
  methods: {
    async onRefresh () {
      switch (this.type) {
        case 'groupJoined':
          this.groupJoined = await this.fetchGroups()
          this.loader.afterRefresh(true)
          return
        case 'groupAudit':
          // TODO: 接口未实现
          this.loader.afterRefresh(true)
          return
        case 'post':
        case 'postPinned':
        case 'postPinnedAudit':
          const post = await this.fetchPosts()
          this.$data[this.type] = post
          this.loader.afterRefresh(post.length < limit)
      }
    },
    async onLoadmore () {
      switch (this.type) {
        case 'post':
        case 'postPinned':
        case 'postPinnedAudit':
          const post = await this.fetchPosts(this.$data[this.type].length)
          this.$data[this.type].push(...post)
          this.loader.afterLoadmore(post.length < limit)
      }
    },
    async fetchGroups () {
      const type = groupTypeMap[this.type]
      const params = { type, user_id: this.logged.id }
      const groups = await this.$axios.$get('/plus-group/groups/users', { params })
      return groups
    },
    async fetchPosts (offset) {
      const type = postTypeMap[this.type]
      if (!type) return Promise.reject()
      const params = { type, limit, offset }
      const posts = await this.$axios.$get('/plus-group/user-group-posts', { params })
      return posts
    },
  },
}
</script>

<style lang="less" scoped>
.p-user-group {
  .cate-wrap {
    display: flex;
    margin-bottom: 16px;

    .cate {
      display: flex;
      align-items: center;
      margin-right: 2em;

      .label {
        display: flex;
        align-items: center;
        cursor: pointer;

        i.drop-icon {
          display: inline-block;
          width: 0;
          height: 0;
          margin-left: 4px;
          border: 6px solid transparent;
          border-top-color: @text-color;
          transform-origin: center 2px;
          transform: translateY(2px);
          transition: transform .2s;

          &.open {
            transform: translateY(4px) rotate(180deg);
          }
        }

        &.active {
          color: @primary-color;
        }
      }

      .options {
        text-align: center;
        font-size: @font-size-base;

        > li {
          &.active {
            color: @primary-color;
          }
          &.disabled {
            color: @disabled-color;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style>
