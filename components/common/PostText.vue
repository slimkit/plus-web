<template>
  <div class="c-post-text">
    <textarea
      ref="editor"
      v-model="content"
      class="editor"
      :placeholder="placeholder"
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
        @click="onSubmit"
      >
        评 论
      </IButton>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostText',
  props: {
    maxlength: { type: Number, default: 255 },
  },
  data () {
    return {
      content: '',
      replyUser: {},
    }
  },
  computed: {
    placeholder () {
      if (this.replyUser.id) return `回复 ${this.replyUser.name}:`
      return '说点什么吧'
    },
  },
  methods: {
    showMention () {},
    onSubmit () {
      if (this.content.length > this.maxlength) {
        return this.$Message.error('超出可输入的字数')
      }
      this.$emit('submit', this.content, this.replyUser)
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
  .editor {
    background-color: @background-color-base;
    width: 100%;
    min-height: 18px+21px*3;
    max-height: 18px+21px*10;
    padding: 8px;
    .border();
    .placeholder-color(@text-info-color);
  }

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
