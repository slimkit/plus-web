<template>
  <div class="c-feed-list-item-image-playground">
    <div class="header">
      <a @click="close"><svg class="icon"><use xlink:href="#icon-top" /></svg> 收起</a>
      <a @click="viewDetail"><svg class="icon"><use xlink:href="#icon-enlarge" /></svg> 查看原图</a>
    </div>

    <div class="preview-wrap">
      <ICarousel
        ref="carousel"
        v-model="index"
        dots="none"
        :height="imageHeight"
      >
        <ICarouselItem
          v-for="img in images"
          :key="img.file"
        >
          <div class="image-wrap">
            <!-- :key="img.file" -->
            <AsyncFile
              :file="img"
              type="image"
              @click.native="close"
            />
            <div
              v-if="img.amount && !img.paid"
              class="pay-cover"
              @click="close"
            >
              <IButton
                ghost
                type="warning"
                size="large"
                @click.stop="onPay(img)"
              >
                <svg class="icon"><use xlink:href="#icon-money" /></svg> 付费查看
              </IButton>
            </div>
          </div>
        </ICarouselItem>
      </ICarousel>
    </div>

    <ul class="image-list">
      <li
        v-for="(img, idx) in images"
        :key="img.file"
        :class="{active: index === idx }"
        @click="index = idx"
      >
        <div class="image-wrap">
          <AsyncFile
            :file="img"
            type="image-wrap"
            :max-height="200"
            :max-width="200"
          />
          <span v-if="img.amount && !img.paid" class="badge pay">付费</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getFileUrl } from '@/utils/file'

export default {
  name: 'FeedListItemImagePlayground',
  props: {
    images: { type: Array, default: () => [] },
    initIndex: { type: Number, default: 0 },
  },
  data () {
    return {
      index: 0,
      listWidth: 0,
    }
  },
  computed: {
    image () {
      return this.images[this.index] || {}
    },
    imageHeight () {
      const [width, height] = this.image.size.split('x')
      return Math.min(this.listWidth * height / width, height)
    },
    needPaid () {
      return this.image.amount && !this.image.paid
    },
  },
  created () {
    this.index = this.initIndex
  },
  mounted () {
    this.listWidth = this.$refs.carousel.listWidth
  },
  methods: {
    close () {
      this.$emit('close')
    },
    viewDetail () {
      if (this.needPaid) return this.onPay()
      const originalUrl = getFileUrl(this.image.file)
      window.open(originalUrl)
    },
    async onPay () {
      const image = this.image
      await this.checkAuth()
      this.$root.$emit('pay', {
        title: '购买支付',
        content: `您只需要支付${image.amount}积分即可查看高清大图，是否确认支付？`,
        amount: image.amount,
        api: `/currency/purchases/${image.paid_node}`,
        callback: (res, amount) => {
          this.$set(image, 'paid', true)
          this.$set(image, '_t', +new Date())
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.c-feed-list-item-image-playground {
  margin: 0 -30px;
  padding: 16px 30px;
  background-color: #efefef;

  .header {
    font-size: @font-size-small;

    > a {
      padding-right: 12px;
      margin-right: 12px;
      border-right: 1px solid @text-info-color;
      color: @disabled-color;
      transition: color @transition-time;

      &:last-child {
        border-right: none;
      }

      &:hover {
        color: @primary-color;
      }
    }
  }

  .preview-wrap {
    margin: 16px 0;

    .image-wrap {
      position: relative;

      .pay-cover {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background-color: rgba(0,0,0,.6);
        cursor: zoom-out;
      }
    }

    .image {
      cursor: zoom-out;
    }

    /deep/ .ivu-carousel-item {
      text-align: center;
      cursor: initial;
      transition: height @transition-time;
    }
  }

  .image-list {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-gap: 2px;

    > li {
      position: relative;
      padding-bottom: 100%;
      border: 1px solid transparent;
      overflow: hidden;

      .image-wrap {
        position: absolute;
        width: 100%;
        height: 100%;

        /deep/ .badge {
          transform: scale(.8);
          transform-origin: bottom right;
        }

        .badge.pay {
          position: absolute;
          padding-top: 20px;
          width: 5em;
          text-align: center;
          color: #fff;
          background-color: #c8a06c;
          background-image: linear-gradient(135deg, #cfac7d 50%, #c8a06c 50%);
          transform: translate(-36px, -42px) rotateZ(-45deg) scale(.7);
        }
      }

      &.active {
        border-color: @warning-color;
      }
    }
  }
}
</style>
