<template>
  <li class="c-group-list-item">
    <nuxt-link :to="`/group/${group.id}`" class="group-cover">
      <Avatar
        :user="group"
        size="xl"
        :square="true"
      />
    </nuxt-link>
    <div class="info-wrap">
      <nuxt-link :to="`/group/${group.id}`">
        <h2 class="group-name">
          {{ group.name }}
          <small v-if="group.mode === 'paid'" class="paid">付费</small>
        </h2>
      </nuxt-link>
      <p>
        帖子 <span>{{ group.posts_count || 0 }}</span>
        成员 <span>{{ group.users_count || 0 }}</span>
      </p>
      <template v-if="isManager">
        <span class="manager-badge">{{ roleMap[joined.role] }}</span>
      </template>
      <template v-else>
        <IButton
          class="join-btn"
          type="primary"
          size="small"
          :disabled="!!joined.role"
          :loading="joinLock"
          @click="onJoinGroup"
        >
          <template v-if="joined.role">
            已加入
          </template>
          <!-- TODO: 申请加入待审核, 接口无返回此数据 2019-01-25
          <template v-else-if="">
          </template>
          -->
          <template v-else>
            <svg class="icon sm"><use xlink:href="#icon-add" /></svg>
            加入
          </template>
        </IButton>
      </template>
    </div>
  </li>
</template>

<script>

const roleMap = {
  founder: '圈主',
  administrator: '管理员',
}

export default {
  name: 'GroupListItem',
  props: {
    group: { type: Object, required: true },
  },
  data () {
    return {
      roleMap,
      joinLock: false,
    }
  },
  computed: {
    joined () {
      const { joined } = this.group
      return joined || {}
    },
    isManager () {
      return Object.keys(roleMap).includes(this.joined.role)
    },
  },
  methods: {
    async onJoinGroup () {
      this.joinLock = true
      const { message } = await this.$axios.$put(`/plus-group/groups/${this.group.id}`)
        .finally(() => {
          this.joinLock = false
        })
      this.$Message.success(this.$Message.success(message))
      this.$emit('update', this.group.id)
    },
  },
}
</script>

<style lang="less" scoped>
.c-group-list-item {
  display: flex;
  padding: 8px;
  background-color: @background-color-base;

  .c-avatar.xl {
    width: 120px;
    height: 120px;
  }

  .info-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: auto;
    padding: 8px 0;
    margin-left: 12px;

    .group-name {
      margin-bottom: 4px;
      font-size: @font-size-large;
      font-weight: normal;

      .paid {
        padding: 0px 2px;
        border: 1px solid @warning-color;
        border-radius: 2px;
        color: @warning-color;
        font-size: @font-size-small;
        vertical-align: middle;
      }
    }

    p {
      color: @disabled-color;

      > span {
        color: @primary-color;
      }
    }

    .join-btn {
      width: fit-content;
      margin-top: auto;
      padding: 2px 1em;
      border-radius: 100px;
      background-color: #fff;
      color: @primary-color;

      &:disabled {
        color: @btn-disable-color;
      }
    }

    .manager-badge {
      margin-top: auto;
      padding: 1px 0.5em;
      border-radius: @border-radius-base;
      background-color: @text-info-color;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>
