<template>
  <ul class="c-group-member-list">
    <li
      v-for="(member, index) in members"
      :key="member.id"
      class="user"
    >
      <Avatar :user="member.user" />
      <div class="user-info">
        <nuxt-link :to="`/user/${member.user_id}`">
          <span class="text-cut">{{ member.user.name }}</span>
        </nuxt-link>
        <IPoptip
          v-if="menu.length"
          v-model="showMenu[index]"
          placement="bottom"
          :transfer="false"
        >
          <span class="pointer">
            管理 <svg class="icon"><use xlink:href="#icon-setting" /></svg>
          </span>

          <template v-slot:content>
            <ul class="options" @click.capture="showMenu[index] = false">
              <li
                v-for="item in menu"
                :key="item.label"
                @click="item.method(member)"
              >
                {{ item.label }}
              </li>
            </ul>
          </template>
        </IPoptip>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'GroupMemberList',
  props: {
    members: { type: Array, default: () => [] },
    menu: { type: Array, default: () => [] },
  },
  data () {
    return {
      showMenu: [],
    }
  },
}
</script>

<style lang="less" scoped>
.c-group-member-list {
  display: grid;
  grid-template-columns: repeat(4, 100%/4);
  grid-gap: 16px;
  margin: 16px 0;

  .user {
    display: flex;
    align-items: center;

    .c-avatar {
      margin-right: 8px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
