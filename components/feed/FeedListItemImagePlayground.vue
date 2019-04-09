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
          <AsyncFile
            :key="img.file"
            :file="img"
            type="image"
            @click.native="close"
          />
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
      const originalUrl = getFileUrl(this.image.file)
      window.open(originalUrl)
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

      .image-wrap {
        position: absolute;
        width: 100%;
        height: 100%;

        /deep/ .badge {
          transform: scale(.8);
          transform-origin: bottom right;
        }
      }

      &.active {
        border-color: @warning-color;
      }
    }
  }
}
</style>
