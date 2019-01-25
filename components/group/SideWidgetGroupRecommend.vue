<template>
  <SideWidget title="热门圈子" :loading="!groups.length">
    <ul class="hot-list">
      <li
        v-for="(group, index) in groups"
        :key="group.id"
        :class="{top3: index < 3}"
      >
        <h2>{{ group.name }}</h2>
        <p>帖子 {{ group.posts_count || 0 }} 成员 {{ group.users_count || 0 }}</p>
      </li>
    </ul>
  </SideWidget>
</template>

<script>
import SideWidget from '@/components/common/SideWidget.vue'

export default {
  name: 'SideWidgetGroupRecommend',
  components: {
    SideWidget,
  },
  props: {
    groups: { type: Array, default: () => [] },
  },
}
</script>

<style lang="less" scoped>
.hot-list {
  counter-reset: hot;

  li {
    position: relative;
    margin: 16px 0;
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

    h2 {
      bottom: 12px;
      font-size: @font-size-base;
      font-weight: normal;
    }

    p {
      color: @text-info-color;
      font-size: @font-size-small;
    }
  }
}
</style>
