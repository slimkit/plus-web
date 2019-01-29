<template>
  <div class="c-markdown-editor">
    <EditorMenuBar :editor="editor">
      <div slot-scope="{ commands, isActive }" class="menubar">
        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.bold() }"
          title="粗体"
          @click="commands.bold"
        >
          <svg class="icon sm"><use xlink:href="#icon-bold" /></svg>
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.italic() }"
          title="斜体"
          @click="commands.italic"
        >
          <svg class="icon sm"><use xlink:href="#icon-italic" /></svg>
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.strike() }"
          title="删除线"
          @click="commands.strike"
        >
          <svg class="icon sm"><use xlink:href="#icon-strike" /></svg>
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.underline() }"
          title="下划线"
          @click="commands.underline"
        >
          <svg class="icon sm"><use xlink:href="#icon-underline" /></svg>
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.code() }"
          title="行内代码"
          @click="commands.code"
        >
          <svg class="icon sm"><use xlink:href="#icon-code" /></svg>
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.paragraph() }"
          title="段落"
          @click="commands.paragraph"
        >
          <svg class="icon sm"><use xlink:href="#icon-paragraph" /></svg>
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          title="1级标题"
          @click="commands.heading({ level: 1 })"
        >
          <span class="icon">H1</span>
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          title="2级标题"
          @click="commands.heading({ level: 2 })"
        >
          <span class="icon">H2</span>
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          title="3级标题"
          @click="commands.heading({ level: 3 })"
        >
          <span class="icon">H3</span>
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.bullet_list() }"
          title="无序列表"
          @click="commands.bullet_list"
        >
          <svg class="icon sm"><use xlink:href="#icon-ul" /></svg>
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.ordered_list() }"
          title="有序列表"
          @click="commands.ordered_list"
        >
          <svg class="icon sm"><use xlink:href="#icon-ul" /></svg>
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.blockquote() }"
          title="引用"
          @click="commands.blockquote"
        >
          <svg class="icon sm"><use xlink:href="#icon-quote" /></svg>
        </button>

        <button
          class="menubar-button"
          title="添加表格"
          @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: true })"
        >
          <svg class="icon sm"><use xlink:href="#icon-table" /></svg>
        </button>

        <template v-if="isActive.table()">
          <button
            class="menubar-button"
            title="删除表格"
            @click="commands.deleteTable"
          >
            <svg class="icon sm"><use xlink:href="#icon-delete_table" /></svg>
          </button>
          <button
            class="menubar-button"
            title="在左侧添加列"
            @click="commands.addColumnBefore"
          >
            <svg class="icon sm"><use xlink:href="#icon-add_col_before" /></svg>
          </button>
          <button
            class="menubar-button"
            title="在右侧添加列"
            @click="commands.addColumnAfter"
          >
            <svg class="icon sm"><use xlink:href="#icon-add_col_after" /></svg>
          </button>
          <button
            class="menubar-button"
            title="删除当前列"
            @click="commands.deleteColumn"
          >
            <svg class="icon sm"><use xlink:href="#icon-delete_col" /></svg>
          </button>
          <button
            class="menubar-button"
            title="在上方添加行"
            @click="commands.addRowBefore"
          >
            <svg class="icon sm"><use xlink:href="#icon-add_row_before" /></svg>
          </button>
          <button
            class="menubar-button"
            title="在下方添加行"
            @click="commands.addRowAfter"
          >
            <svg class="icon sm"><use xlink:href="#icon-add_row_after" /></svg>
          </button>
          <button
            class="menubar-button"
            title="删除行"
            @click="commands.deleteRow"
          >
            <svg class="icon sm"><use xlink:href="#icon-delete_row" /></svg>
          </button>
          <button
            class="menubar-button"
            title="合并选中的单元格"
            @click="commands.toggleCellMerge"
          >
            <svg class="icon sm"><use xlink:href="#icon-combine_cells" /></svg>
          </button>
        </template>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.code_block() }"
          title="代码块"
          @click="commands.code_block"
        >
          <svg class="icon sm"><use xlink:href="#icon-code_block" /></svg>
        </button>

        <button
          class="menubar-button"
          title="分割线"
          @click="commands.horizontal_rule"
        >
          <svg class="icon sm"><use xlink:href="#icon-hr" /></svg>
        </button>

        <button
          class="menubar-button"
          title="撤销"
          @click="commands.undo"
        >
          <svg class="icon sm"><use xlink:href="#icon-undo" /></svg>
        </button>

        <button
          class="menubar-button"
          title="重做"
          @click="commands.redo"
        >
          <svg class="icon sm"><use xlink:href="#icon-redo" /></svg>
        </button>
      </div>
    </EditorMenuBar>

    <EditorContent
      class="content markdown-body"
      :content="content"
      :editor="editor"
    />
  </div>
</template>

<script>
import { Editor, EditorMenuBar, EditorContent } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Placeholder,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from 'tiptap-extensions'

export default {
  name: 'MarkdownEditor',
  components: {
    EditorMenuBar,
    EditorContent,
  },
  props: {
    value: { type: String, default: '' },
    placeholder: { type: String, default: '' },
  },
  data () {
    return {
      editor: null,
    }
  },
  computed: {
    content: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('update:input', val)
      },
    },
  },
  mounted () {
    this.editor = new Editor({
      content: this.initContent,
      extensions: [
        new Blockquote(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new HorizontalRule(),
        new OrderedList(),
        new BulletList(),
        new ListItem(),
        new TodoItem(),
        new TodoList(),
        new Bold(),
        new Code(),
        new Italic(),
        new Link(),
        new Strike(),
        new Underline(),
        new History(),
        new Table(),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new Placeholder({
          empytClass: 'is-empty',
          emptyNodeText: this.placeholder,
        }),
      ],
      onUpdate: (ctx) => {
        console.log(ctx)
      },
    })
  },
  beforeDestroy () {
    this.editor.destory()
  },
}
</script>

<style lang="less">
.c-markdown-editor {
  @border-color: @text-info-color;

  border: 1px solid @border-color;
  border-radius: @border-radius-base;

  .menubar {
    display: flex;
    flex-wrap: wrap;
    padding: 8px;
    border-bottom: 1px solid @border-color;

    .menubar-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border: 1px solid transparent;
      border-radius: @border-radius-base;
      background-color: transparent;
      color: @border-color;

      &:hover {
        border: 1px solid @border-color;
      }
      &.is-active {
        color: @text-color;
      }
    }
  }

  .content {
    padding: 8px;

    .ProseMirror {
      min-height: 21px * 10;
      max-height: 21px * 20;
      height: 100%;
      outline: none;
    }

    ol, ul {
      padding-left: 20px;
    }
    ul {
      list-style-type: disc;
    }
  }

  p.is-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
    font-style: italic;
  }
}
</style>
