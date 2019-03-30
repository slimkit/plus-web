/**
 * 全局混入
 */

import Vue from 'vue'
import { mapState } from 'vuex'
import { noop } from '@/utils'

const mixins = {
  computed: {
    ...mapState({
      boot: 'boot',
    }),
    ...mapState('user', {
      logged: 'logged',
    }),
    loader () {
      return this.$refs.loader || {
        beforeRefresh: noop,
        afterRefresh: noop,
        beforeLoadmore: noop,
        afterLoadmoare: noop,
      }
    },
    allowReward () {
      const config = this.boot.site || {}
      return config.reward.status
    },
  },
  methods: {
    async checkAuth () {
      if (!this.logged) {
        this.$Message.error('请先登录')
        this.$router.push('/auth/login')
        return Promise.reject('Unauthorized')
      }
      return Promise.resolve()
    },
  },
}

const install = function (Vue) {
  if (install.installed) return
  Vue.mixin(mixins)
}

Vue.use({ install })
