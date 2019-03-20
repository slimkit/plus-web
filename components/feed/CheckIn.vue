<template>
  <div class="c-check-in" :class="{loading}">
    <main class="user-info">
      <span class="username">{{ user.name }}</span>
      <Avatar :user="user" size="xl" />
    </main>
    <footer
      class="checkin-info"
      :class="{checked: isChecked}"
      @click="onCheckIn"
    >
      <svg class="icon"><use xlink:href="#icon-checkin" /></svg>
      <span v-if="isChecked">累计签到 {{ checkinCount }} 天</span>
      <span v-else>每日签到</span>
    </footer>

    <ISpin v-if="loading" fix />
  </div>
</template>

<script>
export default {
  name: 'CheckIn',
  data: function () {
    return {
      loading: true,
      info: {},
    }
  },
  computed: {
    user () {
      return this.logged
    },
    isChecked: {
      get () {
        return this.info.checked_in
      },
      set (val) {
        this.info.checked_in = val
      },
    },
    checkinCount: {
      get () {
        return this.info.checkin_count || 0
      },
      set (val) {
        this.info.checkin_count = val
      },
    },
  },
  mounted () {
    this.fetchCheckinInfo()
  },
  methods: {
    async fetchCheckinInfo () {
      this.info = await this.$axios.$get('/user/checkin')
      this.loading = false
    },
    async onCheckIn () {
      try {
        await this.$axios.$put('/user/checkin/currency', {}, { progress: true })
        this.checkinCount += 1
        this.isChecked = true
        this.$Message.success(`签到成功，获得${this.info.attach_balance}积分！`)
      } catch (error) {
        this.fetchCheckinInfo()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.c-check-in {
  position: relative;

  &.loading {
    overflow: hidden; // 防止加载时头像溢出
  }

  .user-info {
    display: flex;
    justify-content: space-between;
    padding: 16px;

    .c-avatar {
      margin-top: -28px;
    }

    .username {
      color: @error-color;
      font-size: @font-size-large;
      margin-top: 8px;
    }
  }

  .checkin-info {
    padding: 16px;
    background-color: @error-color;
    border-radius: 0 0 3px 3px;
    color: #fff;
    font-size: @font-size-large;
    text-align: center;
    font-weight: bold;
    cursor: pointer;

    &.checked {
      background-color: @disabled-color;
    }
  }
}
</style>
