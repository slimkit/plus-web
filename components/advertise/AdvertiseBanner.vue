<template>
  <div class="c-advertise-banner">
    <Collapse>
      <Carousel
        v-if="list.length"
        v-model="index"
        :height="bannerHeight"
        :loop="list.length > 1"
        autoplay
        :autoplay-speed="3000"
      >
        <CarouselItem v-for="(item, idx) in list" :key="`advertise-right-${idx}`">
          <a
            class="banner-wrap"
            :href="item.data.link"
            :title="item.title"
            :target="getLinkTarget(item.data.link)"
          >
            <AsyncFile type="image-wrap" :url="getFileUrl(item.data.image)" />
            <h3 class="title">{{ item.title }}</h3>
          </a>
        </CarouselItem>
      </Carousel>
    </Collapse>
  </div>
</template>

<script>
const typeMap = {
  news: 'pc:news:top',
}

const BANNER_HEIGHT = 420

export default {
  name: 'AdvertiseBanner',
  props: {
    type: { type: String, required: true },
  },
  data () {
    return {
      index: 0,
      bannerHeight: BANNER_HEIGHT,
    }
  },
  computed: {
    list () {
      const space = typeMap[this.type]
      return this.$store.getters['advertise/getListBySpace'](space)
    },
  },
  methods: {
    getFileUrl (url) {
      if (url.match(new RegExp('/api/v2/files/\\d+$'))) url += `?w=1080&h=${BANNER_HEIGHT}`
      return url
    },
    getLinkTarget (url) {
      const host = location.origin
      if (url.match(new RegExp(`^${host}`))) return null
      return '_blank'
    },
  },
}
</script>

<style lang="less" scoped>
.c-advertise-banner {
  margin-bottom: 30px;

  .banner-wrap {
    position: relative;
    display: block;
    height: 100%;

    .title {
      position: absolute;
      left: 30px;
      bottom: 30px;
      color: #fff;
      font-size: @font-size-large;
    }
  }
}
</style>
