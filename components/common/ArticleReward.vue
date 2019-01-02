<template>
  <section class="c-article-reward">
    <IButton
      type="error"
      size="large"
      class="reward-button"
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
      />
      <svg class="icon lg"><use xlink:href="#icon-arrow-right" /></svg>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ArticleReward',
  props: {
    count: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    rewards: { type: Array, default: () => [] },
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
}
</style>
