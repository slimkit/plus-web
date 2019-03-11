<template>
  <!-- TODO: 收费图片 -->
  <div class="c-post-text feed">
    <div class="content-wrap">
      <textarea
        ref="editor"
        v-model="content"
        v-ctrl-enter="beforeSubmit"
        class="editor"
        :placeholder="placeholder"
      />
      <span class="count">还可输入 <span>{{ maxlength - content.length }}</span> 字</span>
    </div>

    <Collapse>
      <ul v-if="topics.length" class="selected-topics">
        <Tag
          v-for="t in topics"
          :key="t.id"
          :selected="true"
          size="sm"
          :text="t.name"
          :closeable="!topic || t.id !== topic.id"
          @close="removeTopic(t.id)"
        />
      </ul>
    </Collapse>

    <div class="tools">
      <IButton
        type="text"
        class="button tool"
        @click="$refs.images.select()"
      >
        <svg class="icon"><use xlink:href="#icon-img" /></svg>
        图片
      </IButton>

      <IPoptip
        key="topic-selector"
        v-model="showTopic"
        placement="bottom"
      >
        <IButton type="text" class="button tool">
          <svg class="icon"><use xlink:href="#icon-topic4" /></svg>
          话题
        </IButton>

        <template v-slot:content>
          <TopicSelector @select="addTopic" />
        </template>
      </IPoptip>

      <IButton type="text" class="button tool">
        <svg class="icon"><use xlink:href="#icon-mention" /></svg>
        某人
      </IButton>

      <IPoptip
        v-model="showPayOptions"
        class="need-pay"
        placement="bottom"
      >
        <div class="label" :class="{active: showPayOptions}">
          {{ needPay ? '付费' : '免费' }}
          <i class="drop-icon" />
        </div>

        <template v-slot:content>
          <ul class="options" @click="showPayOptions = false">
            <li @click="needPay = false">免费</li>
            <li @click="needPay = true">付费</li>
          </ul>
        </template>
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
      :need-pay="needPay"
      @set-amount="onSetAmount"
    />

    <IModal
      v-if="needPay"
      v-model="showPayModal"
      title="付费设置"
      :transfer="false"
      :loading="!images.length"
      @on-ok="afterSetAmount"
    >
      <p>设置{{ images.length ? '图片' :'文字' }}收费金额</p>
      <IRadioGroup
        v-model="selectedAmount"
        class="select-wrap"
        type="button"
      >
        <IRadio
          v-for="item in amountItems"
          :key="item"
          :label="item"
        />
      </IRadioGroup>
      <IInputNumber
        ref="custom"
        v-model="customAmount"
        class="custom-wrap"
        :min="0"
        placeholder="自定义金额，必须为整数"
      />
    </IModal>
  </div>
</template>

<script>
import _ from 'lodash'
import PostText from '@/components/common/PostText.vue'
import PostFeedImages from './PostFeedImages.vue'
import TopicSelector from '@/components/topic/TopicSelector.vue'

export default {
  name: 'PostFeed',
  components: {
    PostFeedImages,
    TopicSelector,
  },
  mixins: [ PostText ],
  props: {
    // 默认添加的话题
    topic: { type: Object, default: null },
  },
  data () {
    return {
      loading: false,
      images: [],
      topics: [],
      mark: null, // 唯一标识

      needPay: false,
      showPayOptions: false,
      showPayModal: false,
      selectedAmount: null,
      customAmount: null,
      setAmountIndex: null,
      showTopic: false,
      showMention: false,
    }
  },
  computed: {
    form () {
      const images = this.images.map(image => ({
        id: image.value,
        amount: image.amount || undefined,
        type: image.amount ? 'read' : undefined,
      }))
      const amount = !this.images.length && this.amount
      return {
        feed_content: this.content,
        feed_from: 1,
        feed_mark: this.mark,
        topics: this.topics.map(t => t.id),
        images,
        amount: amount || undefined,
      }
    },
    amountItems () {
      const { items = [] } = this.boot.feed
      return items.map(item => Number(item))
    },
    amount () {
      if (!this.needPay) return undefined
      return this.customAmount || this.selectedAmount
    },
    disabled () {
      if (this.content || this.images.length) return false
      return true
    },
  },
  watch: {
    customAmount () {
      this.selectedAmount = null
    },
    selectedAmount () {
      this.customAmount = null
    },
    showPayModal (val) {
      if (val) this.selectedAmount = this.amountItems[0]
    },
  },
  mounted () {
    if (this.topic) this.topics.push(this.topic)
  },
  methods: {
    async beforeSubmit () {
      // 如果不需要付费 或者含有付费图片
      if (!this.needPay) return this.onSubmit()

      if (this.images.length) {
        if (!this.images.find(item => item.amount > 0)) {
          return this.$Message.error('应配置至少一张图片费用')
        }
        return this.onSubmit()
      }

      // 付费文字动态
      const minLength = this.boot.feed.limit
      if (this.content.length < minLength) {
        return this.$Message.error(`付费动态内容长度为 ${minLength}-255 字`)
      }
      this.showPayModal = true
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
    afterSetAmount () {
      if (typeof this.setAmountIndex === 'number') {
        // https://cn.vuejs.org/v2/api/#Vue-set
        this.$set(this.images[this.setAmountIndex], 'amount', this.amount)
        this.setAmountIndex = null
      } else {
        this.onSubmit()
      }
    },
    clear () {
      this.content = ''
      this.needPay = false
      this.setAmountIndex = undefined
      this.images = []
      this.topics = this.topic ? [this.topic] : []
      this.mark = null
      this.loading = false
    },
    onSetAmount (index) {
      this.setAmountIndex = index
      this.showPayModal = true
    },
    addTopic (topic) {
      if (this.topics.length >= 5) {
        this.$Message.error('最多添加5个话题')
        this.showTopic = false
      } else if (this.topics.find(t => t.id === topic.id)) {
        this.$Message.error('你已经添加过该话题，不能重复添加')
      } else {
        this.topics.push(topic)
        this.showTopic = false
      }
    },
    removeTopic (topicId) {
      this.topics = _.filter(this.topics, t => t.id !== topicId)
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

    .ivu-poptip {
      display: flex;
      align-items: center;
    }

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
          transform-origin: center 2px;
          transform: translateY(2px);
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

  .selected-topics {
    display: flex;
    margin-top: 8px;

    > li {
      margin-right: 8px;
    }
  }

  .select-wrap {
    display: block;
    margin-top: 8px;
  }

  .custom-wrap {
    display: block;
    margin-top: 8px;
    width: 15em;
  }

}
</style>
