<template>
  <div class="layout-default">
    <CommonHeader />

    <div class="container main">
      <nuxt />
    </div>

    <FloatWidget class="bottom" />

    <CommonFooter />
  </div>
</template>

<script>
import CommonHeader from '@/components/layout/CommonHeader.vue'
import CommonFooter from '@/components/layout/CommonFooter.vue'
import FloatWidget from '@/components/layout/FloatWidget.vue'

export default {
  components: {
    CommonHeader,
    CommonFooter,
    FloatWidget,
  },
}
</script>

<style lang="less" scoped>
.layout-default {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100vh;

  .main {
    margin: 36px auto;
  }

  .bottom {
    margin-top: auto;
  }
}
</style>
