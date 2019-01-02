<template>
  <div class="c-post-text">
    <textarea class="editor" placeholder="说点什么吧" />
    <div class="tools">
      <IButton
        type="text"
        class="button tool"
        @click="showMention"
      >
        <svg class="icon"><use xlink:href="#icon-mention" /></svg>
        某人
      </IButton>
      <span class="count">可输入 <span>255</span> 字</span>
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
  methods: {
    showMention () {},
    onSubmit () {},
  },
}
</script>

<style lang="less" scoped>
.c-post-text {
  .editor {
    background-color: @background-color-base;
    width: 100%;
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

        .icon {
          color: @disabled-color;
        }
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
