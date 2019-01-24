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
        <h2>{{ group.name }}</h2>
      </nuxt-link>
      <p>
        帖子 <span>4</span>
        帖子 <span>4</span>
      </p>
      <IButton
        class="join-btn"
        type="primary"
        size="small"
        :disabled="!!group.joined"
      >
        {{ group.joined ? '已加入':'+加入' }}
      </IButton>
    </div>
  </li>
</template>

<script>

export default {
  name: 'GroupListItem',
  props: {
    group: { type: Object, required: true },
  },
  data () {
    return {
    }
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
    padding: 8px 0;
    margin-left: 12px;

    h2 {
      margin-bottom: 4px;
      font-size: @font-size-large;
      font-weight: normal;
    }

    p {
      color: @disabled-color;

      > span {
        color: @primary-color;
      }
    }

    .join-btn {
      margin-top: auto;
      background-color: #fff;
      color: @primary-color;
      border-radius: 100px;

      &:disabled {
        color: @btn-disable-color;
      }
    }
  }
}
</style>
