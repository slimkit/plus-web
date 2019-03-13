<template>
  <div class="c-input-at">
    <textarea
      ref="editor"
      v-model="content"
      v-at
      v-ctrl-enter="() => $emit('submit')"
      class="editor"
      :placeholder="placeholder"
    />
    <div class="mirror editor" v-html="mirrowHTML" />

    <div
      v-if="searchUser"
      class="at-list"
      :style="{...atPosition}"
    >
      <template v-if="searchUser === '@'">
        <p>请输入要提醒的人</p>
        <ul class="user-list">
          <li
            v-for="(user, index) in friends"
            :key="index"
            :class="{active: index === selectIndex}"
            @click.prevent="onSelectUser(user.name)"
          >
            {{ user.name }}
          </li>
        </ul>
      </template>
      <p v-else-if="searchLock">搜索中</p>
      <p v-else-if="!searchUsers.length">没有找到该用户</p>
      <template v-else>
        <p>搜索到以下用户</p>
        <ul class="user-list">
          <li
            v-for="(user, index) in searchUsers"
            :key="index"
            :class="{active: index === selectIndex}"
            @click.prevent="onSelectUser(user.name)"
          >
            {{ user.name }}
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'

const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

function onKeyup (event) {
  const { el, vnode: { context: vm } } = this
  event.preventDefault()
  vm.setData('locationCursor', el.selectionEnd)
  // console.log(vm.searchUser)
  if (vm.searchUser && arrowKeys.includes(event.key)) {
    event.preventDefault()
    el.setSelectionRange(vm.locationNestAt, vm.locationCursor)
  }
}

function onKeydown (event) {
  if (!['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) return
  const { vnode: { context: vm } } = this

  const maxIndex = vm.users.length - 1
  switch (event.key) {
    case 'ArrowUp':
      const lastIndex = Math.max(vm.selectIndex - 1, 0)
      vm.setData('selectIndex', lastIndex)
      event.preventDefault()
      break
    case 'ArrowDown':
      const nextIndex = Math.min(vm.selectIndex + 1, maxIndex)
      vm.setData('selectIndex', nextIndex)
      event.preventDefault()
      break
    case 'Enter':
      if (!vm.searchUser) return
      event.preventDefault()
      const user = vm.users[vm.selectIndex]
      vm.onSelectUser(user.name)
  }
}

export default {
  name: 'InputAt',
  directives: {
    at: {
      bind (el, binding, vnode, oldVnode) {
        const thisArg = { el, binding, vnode, oldVnode }
        el.addEventListener('keyup', onKeyup.bind(thisArg))
        el.addEventListener('mouseup', onKeyup.bind(thisArg))
        el.addEventListener('keydown', onKeydown.bind(thisArg))
      },
      unbind (el) {
        el.removeEventListener('keyup', onKeyup)
        el.removeEventListener('mouseup', onKeyup)
        el.removeEventListener('keydown', onKeydown)
      },
    },
  },
  props: {
    value: { type: String, default: '' },
    placeholder: { type: String, default: '' },
  },
  data () {
    return {
      atUser: '',
      locationCursor: -1,
      atPosition: { left: 0, top: 0 },

      searchLock: false,
      searchUsers: [],
      selectIndex: 0,
    }
  },
  computed: {
    ...mapState('user', {
      friends: 'friend',
    }),
    content: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      },
    },
    users () {
      if (this.searchUsers.length && this.searchUser !== '@') return this.searchUsers
      return this.friends
    },
    locationNestAt () {
      if (this.locationCursor < 0) return -1
      const beforeCursorString = this.content.substr(0, this.locationCursor) // 光标前的字符串
      const locationAt = beforeCursorString.lastIndexOf('@') // 找到 @ 字符在光标前出现的最后位置
      if (beforeCursorString.indexOf(' ', locationAt) >= 0 || beforeCursorString.indexOf('\n', locationAt) >= 0) return -1
      return locationAt
    },
    locationAfterSearch () {
      if (this.locationNestAt < 0) return -1
      return Math.max(
        this.content.indexOf(' ', this.locationNestAt),
        this.content.indexOf('\n', this.locationNestAt),
        this.content.indexOf('@', this.locationNestAt + 1)
      )
    },
    searchUser () {
      if (this.locationNestAt < 0) return ''
      const loc = this.locationAfterSearch < 0 ? this.content.length : this.locationAfterSearch
      const betweenAtToSpace = this.content.substring(this.locationNestAt, loc)
      return betweenAtToSpace
    },
    mirrowHTML () {
      if (this.locationNestAt < 0) return ''
      return this.content.substr(0, this.locationNestAt)
        .replace(/\n/g, '<br>') + '<span class="at">@</span>'
    },

  },
  watch: {
    content (str) {
      // console.log(this.searchUser)
    },
    locationNestAt (val) {
      this.$nextTick(() => {
        const el = this.$el.querySelector('.at')
        if (val < 0 || !el) return
        const lineHeight = window.getComputedStyle(el).lineHeight
        const top = el.offsetTop + el.scrollTop + 2 + +lineHeight.replace(/px$/, '') + 'px'
        const left = el.offsetLeft + el.scrollLeft + 2 + 'px'
        this.atPosition = { left, top }
      })
    },
    searchUser (val) {
      if (val && val !== '@') {
        this.searchLock = true
        this.onSearchUser()
      } else {
        this.searchLock = false
      }
    },
  },
  mounted () {
    if (!this.friends.length) this.getUserFriends()
  },
  methods: {
    ...mapActions('user', {
      getUserFriends: 'getUserFriends',
    }),
    focus (pos) {
      this.$refs.editor.focus()
      this.setCursorPosition(pos)
    },
    setCursorPosition (start, end = start) {
      this.$refs.editor.setSelectionRange(start, end)
      this.locationCursor = end
    },
    setData (key, val) {
      this.$set(this.$data, key, val)
    },
    onSelectUser (user) {
      const str = this.content
      const stringBeforAt = str.substr(0, this.locationNestAt)
      const stringAt = `@${user} `
      const stringAfterAt = str.substring(this.locationAfterSearch)
      this.content = stringBeforAt + stringAt + (this.locationAfterSearch < 0 ? '' : stringAfterAt)
      this.selectIndex = 0
      this.$nextTick(() => {
        this.focus(stringBeforAt.length + stringAt.length)
      })
    },
    onSearchUser: _.debounce(async function () {
      const params = { limit: 5, keyword: this.searchUser.replace(/^@/, '') }
      this.searchUsers = await this.$axios.$get('/user/search', { params })
      this.searchLock = false
    }, 450),
  },
}
</script>

<style lang="less" scoped>
.c-input-at {
  position: relative;

  .editor {
    background-color: @background-color-base;
    width: 100%;
    min-height: 18px+21px*3;
    max-height: 18px+21px*10;
    padding: 8px;
    .border();
    border-radius: @border-radius-small;
    .placeholder-color(@text-info-color);
    opacity: .4;

    &.mirror {
      position: absolute;
      left: 0;
      top: 0;
      // z-index: -1;
      pointer-events: none;
      opacity: .4;
      color: red;
    }
  }

  .at-list {
    position: absolute;
    width: 11em;
    padding: 8px;
    .border();
    border-radius: @border-radius-small;
    background-color: #fff;
    font-size: @font-size-small;
    z-index: 10;

    > p {
      font-weight: bold;
    }

    .user-list {
      > li {
        cursor: pointer;

        &.active {
          color: @primary-color;
        }
      }
    }
  }
}
</style>
