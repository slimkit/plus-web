<template>
  <section class="c-article-reward">
    <IButton
      type="error"
      size="large"
      class="reward-button"
      @click="onReward"
    >
      打 赏
    </IButton>
    <p class="reward-info">
      <span>{{ count }}</span> 人打赏，
      共 <span>{{ amount }}</span> 积分
    </p>
    <div v-if="rewards.length" class="rewards">
      <Avatar
        v-for="reward in rewardsLimit"
        :key="reward.id"
        :user="reward.user"
        size="sm"
      />
      <svg class="icon lg" @click="showList = true"><use xlink:href="#icon-icon07" /></svg>
    </div>

    <IModal
      v-model="showList"
      title="打赏列表"
      :transfer="false"
      :width="340"
      :footer-hide="true"
    >
      <Loadmore
        ref="loader"
        @refresh="onRefresh"
        @loadmore="onLoadmore"
      >
        <ul class="reward-list">
          <li
            v-for="reward in rewards"
            :key="reward.id"
            class="reward-item"
          >
            <Avatar :user="reward.user" size="sm" />
            <span class="username">{{ reward.user.name }}</span>
            打赏了 {{ reward.rewardable_type | rewardType }}
          </li>
        </ul>
      </Loadmore>
    </IModal>
  </section>
</template>

<script>

const rewardTypeMap = {
  feeds: '动态',
}

export default {
  name: 'ArticleReward',
  filters: {
    rewardType (val) {
      return rewardTypeMap[val]
    },
  },
  props: {
    type: { type: String, required: true },
    article: { type: Number, required: true }, // 文章id
    count: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    rewards: { type: Array, default: () => [] },
  },
  data: function () {
    return {
      showList: false,
    }
  },
  computed: {
    rewardsLimit () {
      return this.rewards.slice(0, 10)
    },
  },
  methods: {
    onRefresh () {
      this.$emit('fetch', null, noMore => {
        this.loader.afterRefresh(noMore)
      })
    },
    onLoadmore () {
      this.$emit('fetch', this.rewards.length, noMore => {
        this.loader.afterRefresh(noMore)
      })
    },
    onReward () {
      this.$root.$emit('reward', {
        type: this.type,
        id: this.article,
        callback: amount => {
          this.$emit('reward', amount)
        },
      })
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

  .reward-list {
    max-height: 70vh;
    overflow: auto;

    .reward-item {
      display: flex;
      align-items: center;
      padding: 8px;
      color: @text-info-color;

      .username {
        color: @text-color;
        margin: 0 8px;
      }
    }
  }
}
</style>
