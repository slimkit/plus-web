<template>
  <ul class="c-group-member-list">
    <li v-for="member in members" :key="member.id">
      <nuxt-link class="user" :to="`/user/${member.user_id}`">
        <Avatar :user="member.user" />
        <span class="text-cut">{{ member.user.name }}</span>
      </nuxt-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'GroupMemberList',
  props: {
    members: { type: Array, default: () => [] },
  },
}
</script>

<style lang="less" scoped>
.c-group-member-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;
  margin: 16px 0;

  .user {
    display: flex;
    align-items: center;

    .c-avatar {
      margin-right: 8px;
    }
  }
}
</style>
