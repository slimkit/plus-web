<template>
  <div class="c-advertise-right-side">
    <SideWidget v-for="(item, index) in list" :key="`advertise-right-${index}`">
      <a
        :href="item.data.link"
        :title="item.title"
        :target="getLinkTarget(item.data.link)"
      >
        <AsyncFile :url="getFileUrl(item.data.image)" />
      </a>
    </SideWidget>
  </div>
</template>

<script>
import SideWidget from '@/components/common/SideWidget.vue'

const typeMap = {
  feed: 'pc:feeds:right',
  news: 'pc:news:right',
}

export default {
  name: 'AdvertiseRightSide',
  components: {
    SideWidget,
  },
  props: {
    type: { type: String, required: true },
  },
  computed: {
    list () {
      const space = typeMap[this.type]
      return this.$store.getters['advertise/getListBySpace'](space)
    },
  },
  methods: {
    getFileUrl (url) {
      if (url.match(new RegExp('/api/v2/files/\\d+$'))) url += '?w=235'
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
.c-advertise-right-side {

}
</style>
