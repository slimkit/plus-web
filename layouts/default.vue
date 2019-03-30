<template>
  <div class="layout-default">
    <CommonHeader />

    <div class="container main">
      <nuxt />
    </div>

    <FloatWidget class="bottom" />

    <!-- 通知栏 -->
    <NotificationBar v-if="logged" />

    <CommonFooter />

    <ModalReport />
    <ModalRepost />
    <ModalPay />
    <ModalReward />
    <ModalPinned />
    <ModalPassword />
  </div>
</template>

<script>
import CommonHeader from '@/components/layout/CommonHeader.vue'
import CommonFooter from '@/components/layout/CommonFooter.vue'
import FloatWidget from '@/components/layout/FloatWidget.vue'
import NotificationBar from '@/components/notification/NotificationBar.vue'
import ModalReport from '@/components/common/ModalReport.vue'
import ModalRepost from '@/components/common/ModalRepost.vue'
import ModalPay from '@/components/common/ModalPay.vue'
import ModalReward from '@/components/common/ModalReward.vue'
import ModalPinned from '@/components/common/ModalPinned.vue'
import ModalPassword from '@/components/common/ModalPassword.vue'

export default {
  name: 'DefaultLayout',
  components: {
    CommonHeader,
    CommonFooter,
    FloatWidget,
    NotificationBar,
    ModalReport,
    ModalRepost,
    ModalPay,
    ModalReward,
    ModalPinned,
    ModalPassword,
  },
}
</script>

<style lang="less" scoped>
.layout-default {
  position: relative;
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
