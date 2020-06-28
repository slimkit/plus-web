<template>
  <div class="c-tag-selector">
    <Poptip
      :transfer="false"
      class="tag-selector"
      title="请选择标签"
      always
    >
      <template v-slot:default>
        <div class="selected-wrap ivu-input">
          <span v-if="!selectedTags.length" class="placeholder">{{ placeholder }}</span>
          <TagList
            v-else
            :tags="selectedTags"
            :selected="true"
            size="sm"
            closeable
            @remove="onTagRemove"
          />
        </div>
      </template>

      <template v-slot:content>
        <div class="tags-wrap">
          <section v-for="tagCate in tags" :key="`cate-${tagCate.id}`">
            <h4>{{ tagCate.name }}</h4>
            <TagList
              :tags="tagCate.tags"
              size="sm"
              :selected-tags="selectedTags"
              @append="onTagAppend"
              @remove="onTagRemove"
            />
          </section>
        </div>
      </template>
    </Poptip>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import TagList from './TagList.vue'

export default {
  name: 'TagSelector',
  components: {
    TagList,
  },
  props: {
    selectedTags: { type: Array, default: () => [] },
    placeholder: { type: String, default: '请选择标签' },
    limit: { type: Number, default: 5 },
  },
  computed: {
    ...mapState({
      tags: 'tags',
    }),
  },
  mounted () {
    this.getTags()
  },
  methods: {
    ...mapActions({
      getTags: 'getTags',
    }),
    onTagAppend (tag) {
      if (this.selectedTags.length >= this.limit) {
        return this.$Message.error(`最多只能添加${this.limit}个标签`)
      }
      this.$emit('update:selectedTags', [...this.selectedTags, tag])
    },
    onTagRemove (tag) {
      this.$emit('update:selectedTags', _.filter(this.selectedTags, t => t.id !== tag.id))
    },
  },
}
</script>

<style lang="less" scoped>
.c-tag-selector {
  .tag-selector {
    width: 100%;

    /deep/ .ivu-poptip-popper {
      left: 0 !important;
      width: 100%;
    }

    .selected-wrap {
      height: auto;
      min-height: 37px;
      padding: 8px 8px 0;

      .placeholder {
        color: @text-info-color;
      }
    }

    .tags-wrap {
      padding: 8px;

      section {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      h4 {
        margin-bottom: 4px;
        color: @disabled-color;
      }

      ul {
        display: flex;
        flex-wrap: wrap;

        > li {
          margin-right: 1em;
        }
      }
    }
  }
}
</style>
