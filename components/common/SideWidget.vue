<template>
  <div class="c-side-widget">
    <h3 v-if="title" class="title">{{ title }}</h3>
    <div class="panel" :class="{'no-title': !title}">
      <!-- 用户列表挂件 -->
      <ul v-if="type === 'user'" class="user-list">
        <li
          v-for="userItem in users"
          :key="userItem.id"
          class="user-item"
        >
          <Avatar :user="userItem" />
          <span class="username text-cut">{{ userItem.name }}</span>
        </li>
      </ul>

      <!-- 通用挂件 -->
      <template v-else>
        <slot />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideWidget',
  props: {
    type: { type: String, default: '', validator: val => ['', 'user'].includes(val) },
    users: { type: Array, default: () => [] },
    title: { type: String, default: '' },
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .user-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
    margin: 8px 0;

    .username {
      margin-top: 8px;
      font-size: @font-size-small;
      text-align: center;
      max-width: 5em;
    }
  }
}
</style>
