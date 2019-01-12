<template>
  <!-- TODO: 收费图片 -->
  <div class="c-post-text feed">
    <div class="content-wrap">
      <textarea
        ref="editor"
        v-model="content"
        class="editor"
        :placeholder="placeholder"
      />
      <span class="count">还可输入 <span>{{ maxlength - content.length }}</span> 字</span>
    </div>
    <div class="tools">
      <IButton
        type="text"
        class="button tool"
        @click="$refs.images.select()"
      >
        <svg class="icon"><use xlink:href="#icon-img" /></svg>
        图片
      </IButton>
      <IButton
        type="text"
        class="button tool"
        @click="showMention"
      >
        <svg class="icon"><use xlink:href="#icon-mention" /></svg>
        某人
      </IButton>
      <IPoptip
        v-model="showPay"
        class="need-pay"
        placement="bottom"
      >
        <div class="label" :class="{active: showPay}">
          {{ needPay ? '付费' : '免费' }}
          <i class="drop-icon" />
        </div>

        <ul
          slot="content"
          class="options"
          @click="showPay = false"
        >
          <li @click="needPay = false">免费</li>
          <li @click="needPay = true">付费</li>
        </ul>
      </IPoptip>
      <IButton
        type="primary"
        class="button submit-button"
        :disabled="disabled"
        :loading="loading"
        @click="beforeSubmit"
      >
        分享
      </IButton>
    </div>

    <PostFeedImages
      v-show="images.length"
      ref="images"
      :list.sync="images"
    />
  </div>
</template>

<script>
import PostText from '@/components/common/PostText.vue'
import PostFeedImages from './PostFeedImages.vue'

export default {
  name: 'PostFeed',
  components: {
    PostFeedImages,
  },
  mixins: [ PostText ],
  data () {
    return {
      loading: false,
      showPay: false,
      needPay: false,
      amount: undefined,
      images: [],
      mark: null, // 唯一标识
    }
  },
  computed: {
    form () {
      const images = this.images.map(image => ({
        id: image.value,
        amount: undefined, // TODO: 收费图片
        type: this.needPay ? 'read' : undefined,
      }))
      return {
        feed_content: this.content,
        amount: this.amount,
        feed_from: 1,
        feed_mark: this.mark,
        images,
      }
    },
    disabled () {
      if (this.content || this.images.length) return false
      return true
    },
  },
  methods: {
    async beforeSubmit () {
      if (!this.needPay) return this.onSubmit()
    },
    async onSubmit () {
      const exceptionImage = this.images.find(item => item.status !== 'success')
      if (exceptionImage) {
        switch (exceptionImage.status) {
          case 'uploading':
          case 'pending':
            this.$Message.error('图片正在上传中，请等待')
            break
          case 'error':
            this.$Message.error('存在上传失败的图片，请检查')
            break
        }
        return
      }
      this.loading = true
      this.mark = `${this.logged.id}${+new Date()}`
      this.$axios.$post('/feeds', this.form)
        .then(({ id }) => {
          this.$Message.success('发布成功')
          this.$emit('post', id)
          this.clear()
        })
        .finally(() => {
          this.loading = false
        })
    },
    clear () {
      this.content = ''
      this.needPay = false
      this.images = []
      this.amount = null
      this.mark = null
      this.loading = false
    },
  },
}
</script>

<style lang="less" scoped>
.c-post-text.feed {
  .content-wrap {
    position: relative;
    margin-bottom: 8px;

    .editor {
      background-color: @background-color-base;
      width: 100%;
      min-height: 18px+21px*5;
      max-height: 18px+21px*10;
      padding: 8px 8px 24px;
      .border();
      .placeholder-color(@text-info-color);
    }

    .count {
      position: absolute;
      bottom: 8px;
      right: 8px;
      font-size: @font-size-small;

      > span {
        color: @primary-color;
      }
    }
  }

  .tools {
    display: flex;

    .tool {
      padding-left: 0;
      padding-right: 0;
      margin-right: 16px;
    }

    .need-pay {
      display: flex;
      align-items: center;
      margin-left: auto;
      margin-right: 1em;

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
          transform-origin: center 3px;
          transform: translateY(4px);
          transition: transform .2s;
        }

        &.active {
          i.drop-icon {
            transform: translateY(4px) rotate(180deg);
          }
        }
      }

      .options {
        text-align: center;
        font-size: @font-size-base;
      }
    }

    .submit-button {
      height: 100%;
      font-size: @font-size-base;
    }
  }

}
</style>
