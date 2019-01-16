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
  },
  methods: {
    checkAuth () {
      if (!this.logged) this.$router.push('/auth/login')
    },
  },
}

const install = function (Vue) {
  if (install.installed) return
  Vue.mixin(mixins)
}

Vue.use({ install })
