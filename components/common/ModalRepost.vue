<template>
  <div ref="repost" class="c-modal-repost">
    <IModal
      ref="modal"
      v-model="show"
      :loading="true"
      title="转发"
      :transfer="false"
      :footer-hide="true"
    >
      <Reference
        v-if="show"
        :type="type"
        :source="source"
      />

      <PostFeed
        ref="postEditor"
        :repost-type="type"
        :repost-id="source.id"
        @post="onSubmit"
      />
    </IModal>
  </div>
</template>

<script>
import { noop } from '@/utils'
import Reference from '@/components/common/Reference.vue'
import PostFeed from '@/components/feed/PostFeed.vue'

export default {
  name: 'ModalRepost',
  components: {
    Reference,
    PostFeed,
  },
  data () {
    return {
      show: false,
      content: '',
      type: null,
      source: {},
    }
  },
  created () {
    this.$root.$on('repost', options => {
      this.type = options.type
      this.source = options.source || {}
      this.callback = options.callback || noop
      this.open()
    })
  },
  destroyed () {
    this.$root.$off('repost')
  },
  methods: {
    open () {
      this.show = true
      this.$nextTick(() => {
        this.$refs.postEditor.focus()
      })
    },
    close () {
      this.show = false
      this.content = ''
    },
    async onSubmit (feedId) {
      this.callback(feedId)
      this.close()
    },
  },
}
</script>

<style lang="less" scoped>
.c-modal-repost {
  .editor {
    background-color: @background-color-base;
    width: 100%;
    min-height: 16px+22*2;
    max-height: 16px+22*5;
    padding: 8px;
    color: @text-color;
    font-size: @font-size-base;
    .border();
    .placeholder-color(@text-info-color);
  }
}
</style>
