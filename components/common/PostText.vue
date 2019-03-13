<template>
  <div class="c-post-text">
    <InputAt
      ref="editor"
      v-model="content"
      class="editor"
      :placeholder="placeholder"
      @submit="onSubmit"
    />
    <div class="tools">
      <IButton
        type="text"
        class="button tool"
        @click="showMention"
      >
        <svg class="icon"><use xlink:href="#icon-mention" /></svg>
        某人
      </IButton>
      <span class="count">还可输入 <span>{{ maxlength - content.length }}</span> 字</span>
      <IButton
        type="primary"
        class="button submit-button"
        :disabled="disabled"
        @click="onSubmit"
      >
        评 论
      </IButton>
    </div>
  </div>
</template>

<script>
import { textAtMatcher } from '@/utils/matcher.js'
import InputAt from './InputAt.vue'

export default {
  name: 'PostText',
  components: {
    InputAt,
  },
  props: {
    maxlength: { type: Number, default: 255 },
  },
  data () {
    return {
      content: '',
      replyUser: {},

      showMention: false,
    }
  },
  computed: {
    placeholder () {
      if (this.replyUser.id) return `回复 ${this.replyUser.name}:`
      return '说点什么吧'
    },
    disabled () {
      if (!this.content) return true
      if (this.content.length > this.maxlength) return true
      return false
    },
  },
  methods: {
    async onSubmit () {
      await this.checkAuth()
      const contentWithAt = this.content.replace(textAtMatcher, '\u00ad$1\u00ad$2')
      this.$emit('submit', contentWithAt, this.replyUser)
    },
    reply (user) {
      this.replyUser = user
      this.$refs.editor.focus()
    },
    clean () {
      this.content = ''
      this.replyUser = {}
    },
  },
}
</script>

<style lang="less" scoped>
.c-post-text {

  .tools {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 8px;

    .count {
      margin-left: auto;

      > span {
        color: @primary-color;
      }
    }

    .button {
      &.tool {
        margin-right: 16px;
        padding-left: 0;
        padding-right: 0;
      }

      &.submit-button {
        margin-left: 16px;
        padding-left: 18px;
        padding-right: 18px;
        font-weight: bold;
      }
    }

  }
}
</style>
