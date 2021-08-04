<template>
  <SideWidget
    :users="recommendUsers"
    type="user"
    title="推荐用户"
    :loading="loading"
  />
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SideWidget from '@/components/common/SideWidget.vue'

export default {
  name: 'SideWidgetRecommendUsers',
  components: {
    SideWidget,
  },
  computed: {
    ...mapState('user', {
      recommendUsers: 'recommend',
      loading: 'recommendLoading',
    }),
  },
  mounted () {
    this.fetchRecommendUsers()
  },
  methods: {
    ...mapActions('user', {
      fetchRecommendUsers: 'fetchRecommendUsers',
    }),
  },
}
</script>
