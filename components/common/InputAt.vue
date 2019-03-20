
<template>
  <!-- TODO: 这里的代码有点脆 需要补充单元测试 -->
  <div v-click-outside="blur" class="c-input-at">
    <textarea
      ref="editor"
      v-model="content"
      v-at
      v-ctrl-enter="onSubmit"
      class="editor"
      :placeholder="placeholder"
    />

    <!-- 输入框镜像，用于定位 “@” 位置用于选择列表跟随光标 -->
    <div class="mirror editor" v-html="mirrowHTML" />

    <!-- 用户选择列表 -->
    <div
      v-if="inAtRange"
      class="at-list"
      :style="{...atPosition}"
    >
      <template v-if="!searchUser">
        <p>请输入要提醒的人</p>
        <ul class="user-list">
          <li
            v-for="(user, index) in friends"
            :key="index"
            :class="{active: index === selectIndex}"
            @click.prevent="onSelectUser(user.name)"
            v-text="user.name"
          />
        </ul>
      </template>
      <p v-else-if="searchLock">搜索中</p>
      <p v-else-if="!searchUsers.length">没有找到该用户</p>
      <template v-else>
        <p>轻敲空格或回车完成输入</p>
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

const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace']

// onKeyup 用于光标定位、跳转、选择相关逻辑
function onKeyup (event) {
  const { el, vnode: { context: vm } } = this
  vm.setData('locationCursor', el.selectionEnd)
  if (el.selectionEnd === vm.locationAfterSearch && event.key !== 'Backspace') return

  event.preventDefault()
  if (event.type === 'mouseup') {
    if (vm.inAtRange && el.selectionStart === el.selectionEnd) {
      el.setSelectionRange(vm.locationNestAt, vm.locationAfterSearch)
    }
  } else {
    if (vm.inAtRange && arrowKeys.includes(event.key)) {
      el.setSelectionRange(vm.locationNestAt, vm.locationAfterSearch)
    }
  }
}

// onKeydown 用于拦截用户选择框默认行为
function onKeydown (event) {
  // 如果监测到按上下或者回车键、空格键，就拦截默认的光标跳转行为 改为控制选择器
  if (!['ArrowUp', 'ArrowDown', 'Enter', 'Tab', ' '].includes(event.key)) return
  const { el, vnode: { context: vm } } = this

  const maxIndex = vm.users.length - 1
  switch (event.key) {
    // 选择上一个
    case 'ArrowUp':
      const lastIndex = Math.max(vm.selectIndex - 1, 0)
      vm.setData('selectIndex', lastIndex)
      event.preventDefault()
      break
    // 选择下一个
    case 'ArrowDown':
      const nextIndex = Math.min(vm.selectIndex + 1, maxIndex)
      vm.setData('selectIndex', nextIndex)
      event.preventDefault()
      break
    // 回车选择
    case 'Tab':
    case 'Enter':
      if (!vm.inAtRange) return
      event.preventDefault()
      const user = vm.users[vm.selectIndex]
      vm.onSelectUser(user.name)
      break
    // 空格
    case ' ':
      if (el.selectionStart === el.selectionEnd) return
      const index = el.selectionEnd
      el.setSelectionRange(index, index)
      break
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
      locationCursor: -1, // 当前光标位置
      atPosition: { left: 0, top: 0 }, // at 列表定位

      searchLock: false, // 搜索锁
      searchUsers: [], // 搜索用户列表
      selectIndex: 0, // 当前选择索引
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
      if (this.searchUsers.length && this.searchUser) return this.searchUsers
      return this.friends
    },
    inAtRange () {
      return this.locationNestAt !== null
    },
    // 光标前的最后一个 @ 字符的位置
    locationNestAt () {
      if (this.locationCursor < 0) return null
      const beforeCursorString = this.content.substr(0, this.locationCursor) // 光标前的字符串
      const locationAt = beforeCursorString.lastIndexOf('@') // 找到 @ 字符在光标前出现的最后位置
      if (locationAt < 0 || beforeCursorString.indexOf(' ', locationAt) >= 0 || beforeCursorString.indexOf('\n', locationAt) >= 0) return null
      return locationAt
    },
    // 光标前最后一个 @ 存在时，光标后的空格、换行符、@符号的位置
    locationAfterSearch () {
      if (!this.inAtRange) return -1
      const patterns = [
        this.content.indexOf(' ', this.locationNestAt),
        this.content.indexOf('\n', this.locationNestAt),
        this.content.indexOf('@', this.locationNestAt + 1),
      ]
      const index = Math.min(...patterns.filter(i => i >= 0))
      if (index < 0 || index === Infinity) return this.content.length
      return index
    },
    // 当前 at 用户的名字 （光标前最后一个 @ 到光标后的空格、换行符、@之间的字符串）
    searchUser () {
      if (!this.inAtRange) return ''
      const betweenAtToSpace = this.content.substring(this.locationNestAt, this.locationAfterSearch)
      return betweenAtToSpace.replace(/^@/, '')
    },
    // 镜像容器所需要的 HTML 内容，产生 @ 符号用于定位
    mirrowHTML () {
      if (!this.inAtRange) return ''
      return this.content.substr(0, this.locationNestAt)
        .replace(/\n/g, '<br>') + '<span class="at">@</span>'
    },

  },
  watch: {
    // 光标前最后一个 @ 字符变动时，更新 at 列表位置
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
    // at 用户名变动时，触发搜索器
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
    if (this.logged && !this.friends.length) this.getUserFriends()
  },
  methods: {
    ...mapActions('user', {
      getUserFriends: 'getUserFriends',
    }),
    focus (pos) {
      this.$refs.editor.focus()
      this.setCursorPosition(pos)
    },
    blur () {
      const len = this.content.length
      this.setCursorPosition(len)
      this.$refs.editor.blur()
    },
    // 设置光标位置
    setCursorPosition (start, end = start) {
      this.$refs.editor.setSelectionRange(start, end)
      this.locationCursor = end
    },
    // 通过 vm 触发 vue 实例数据变更（响应）的方法
    setData (key, val) {
      this.$set(this.$data, key, val)
    },
    // 选择用户时触发的事件（回车选择、点击选择）
    onSelectUser (user) {
      if (!user) return
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
    // 搜索器（debounce 防抖）
    onSearchUser: _.debounce(async function () {
      const params = { limit: 5, keyword: this.searchUser }
      this.searchUsers = await this.$axios.$get('/user/search', { params })
      this.searchLock = false
    }, 450),

    onSubmit () {
      this.$emit('submit')
    },
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
    opacity: 1;

    &.mirror {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      white-space: pre-wrap;
    }
  }

  .at-list {
    position: absolute;
    min-width: 10em;
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
