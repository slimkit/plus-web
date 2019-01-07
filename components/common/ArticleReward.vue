<template>
  <section class="c-article-reward">
    <IButton
      type="error"
      size="large"
      class="reward-button"
      @click="beforeReward"
    >
      打 赏
    </IButton>
    <p class="reward-info">
      <span>{{ count }}</span> 人打赏，
      共 <span>{{ amount }}</span> 积分
    </p>
    <div v-if="rewards.length" class="rewards">
      <Avatar
        v-for="reward in rewards"
        :key="reward.id"
        :user="reward.user"
        size="sm"
      />
      <svg class="icon lg" @click="viewList"><use xlink:href="#icon-icon07" /></svg>
    </div>

    <ModalReward ref="modal" @reward="onReward" />
  </section>
</template>

<script>
import ModalReward from '@/components/common/ModalReward.vue'

export default {
  name: 'ArticleReward',
  components: {
    ModalReward,
  },
  props: {
    count: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    rewards: { type: Array, default: () => [] },
  },
  methods: {
    beforeReward () {
      this.$refs.modal.open()
    },
    onReward (...args) {
      this.$emit('reward', ...args)
    },
    viewList () {
      console.log('on view list')
    },
  },
}
</script>

<style lang="less" scoped>
.c-article-reward {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 32px 0;

  .reward-button {
    padding: 6px 22px 8px;
    font-size: 16px;
    font-weight: bold;
  }

  .reward-info {
    margin: 16px 0;

    > span {
      color: @error-color;
    }
  }

  .rewards {
    display: flex;
    align-items: center;
    justify-content: center;

    .c-avatar {
      margin: 0 4px;
    }

    .icon {
      cursor: pointer;
    }
  }
}
</style>
