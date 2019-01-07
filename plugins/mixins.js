/**
 * 全局混入
 */

import Vue from 'vue'
import { mapState } from 'vuex'

const mixins = {
  computed: {
    ...mapState({
      boot: 'boot',
    }),
    ...mapState('user', {
      logged: 'logged',
    }),
  },
}

const install = function (Vue) {
  if (install.installed) return
  Vue.mixin(mixins)
}

Vue.use({ install })
