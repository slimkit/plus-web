<template>
  <div class="c-side-widget">
    <h3 v-if="title" class="title">{{ title }}</h3>
    <div class="panel" :class="{'no-title': !title}">
      <!-- 用户列表挂件 -->
      <template v-if="type === 'user'">
        <slot />
        <ul class="user-list">
          <li
            v-for="userItem in users"
            :key="userItem.id"
            class="user-item"
          >
            <Avatar :user="userItem" />
            <span class="username text-cut">{{ userItem.name }}</span>
          </li>
        </ul>
      </template>

      <!-- 通用挂件 -->
      <template v-else>
        <slot />
      </template>

      <ISpin v-if="loading" fix />
    </div>

    <slot name="footer" />
  </div>
</template>

<script>
export default {
  name: 'SideWidget',
  props: {
    type: { type: String, default: '', validator: val => ['', 'user'].includes(val) },
    users: { type: Array, default: () => [] },
    title: { type: String, default: '' },
    loading: { type: [Boolean, Number], default: false },
  },
}
</script>

<style lang="less" scoped>
.c-side-widget {
  position: relative;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    .border(bottom);
    border-radius: 3px 3px 0 0;
    background-color: #fff;
  }

  .panel {
    position: relative;
    padding: 12px;
    background-color: #fff;
    border-radius: 0 0 3px 3px;

    &.no-title {
      padding: 0;
      border-radius: 3px;
    }
  }
}

.user-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;

  .user-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .username {
      margin-top: 8px;
      font-size: @font-size-small;
      text-align: center;
      max-width: 5em;
    }
  }
}
</style>
