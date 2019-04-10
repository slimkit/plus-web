<template>
  <div class="layout-default">
    <!-- Browse Happy -->
    <Collapse>
      <IAlert
        v-if="isIE"
        banner
        type="warning"
        closable
        :style="{marginBottom: 0,marginRight: logged && '48px', zIndex: 100}"
      >
        <!-- eslint-disable-next-line -->
        您正在使用过时的 IE 浏览器，因此排版可能会错乱。为了您的浏览体验，强烈建议您更换至 <a class="primary-color" href="https://browsehappy.com/" target="_blank" >现代浏览器</a>
      </IAlert>
    </Collapse>

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
import { isIE } from '@/utils'
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
import { mapActions } from 'vuex'

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
  data () {
    return {
      isIE: false,
    }
  },
  mounted () {
    if (isIE()) {
      setTimeout(() => {
        this.isIE = true
      }, 500)
    }

    this.checkAdvertise()
  },
  methods: {
    ...mapActions('advertise', {
      getAdvertiseSpace: 'getAdvertiseSpace',
      getPcAdvertises: 'getPcAdvertises',
    }),
    async checkAdvertise () {
      // 获取所有广告位
      await this.getAdvertiseSpace()

      // 获取 PC 端广告列表
      this.getPcAdvertises()
        .catch(err => { console.log(err.response) })
    },
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
