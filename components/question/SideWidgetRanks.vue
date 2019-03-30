<template>
  <SideWidget title="问答达人排行" :loading="loading">
    <nav class="type-switcher">
      <a :class="{'active': type === 'day'}" @click="type = 'day'">今日</a>
      <a :class="{'active': type === 'week'}" @click="type = 'week'">一周</a>
      <a :class="{'active': type === 'month'}" @click="type = 'month'">月份</a>
    </nav>
    <ul v-if="users.length" class="hot-list">
      <li
        v-for="(user, index) in users.slice(0, 9)"
        :key="user.id"
        :class="{top3: index < 3}"
      >
        <nuxt-link class="user-wrap" :to="`/user/${user.id}`">
          <Avatar :user="user" />
          <div class="user-info">
            <p class="text-cut">{{ user.name }}</p>
            <p class="disabled-color">回答数：{{ user.extra.count }}</p>
          </div>
        </nuxt-link>
      </li>
    </ul>
    <div v-else v-empty:content />
  </SideWidget>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SideWidget from '@/components/common/SideWidget.vue'

export default {
  name: 'SideWidgetRanks',
  components: {
    SideWidget,
  },
  data () {
    return {
      type: 'month',

      loading: true,
    }
  },
  computed: {
    ...mapState('question', {
      ranks: 'rankAnswer',
    }),
    users () {
      return this.ranks[this.type] || []
    },
  },
  async mounted () {
    await this.getQuestionAnswerRanks()
    this.loading = false
  },
  methods: {
    ...mapActions('question', {
      getQuestionAnswerRanks: 'getQuestionAnswerRanks',
    }),
  },
}
</script>

<style lang="less" scoped>
.type-switcher {
  display: flex;
  justify-content: space-around;
  margin: 0 -12px;
  .border(bottom);

  > a {
    padding: 0 12px 12px;
    margin-bottom: -1px;

    &.active {
      color: @primary-color;
      border-bottom: 1px solid @primary-color;
    }
  }
}

.hot-list {
  counter-reset: hot;

  li {
    position: relative;
    margin: 24px 0;
    margin-left: 32px;

    &::before {
      counter-increment: hot;
      content: counter(hot);
      position: absolute;
      top: 50%;
      left: -26px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      margin-top: -8px;
      border-radius: @border-radius-small;
      background-color: @text-info-color;
      font-size: 80%;
      color: #fff;
    }

    &.top3::before {
      background-color: @primary-color;
    }

    .user-wrap {
      display: inline-flex;
      width: 100%;

      .user-info {
        flex: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 12px;
        overflow: hidden;
      }
    }
  }
}

.v-empty-content {
  height: 240px;
  transform: scale(.7);
}
</style>
