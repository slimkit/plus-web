<template>
  <li class="c-topic-list-item">
    <nuxt-link
      class="topic-card"
      :to="`/topic/${topic.id}`"
      :style="{backgroundImage: cover && `url(${cover})`}"
    >
      <h2 class="name">{{ topic.name }}</h2>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: 'TopicListItem',
  props: {
    topic: { type: Object, required: true },
    height: { type: Number, default: null },
  },
  computed: {
    cover () {
      const logo = this.topic.logo || {}
      return logo.url || null
    },
  },
}
</script>

<style lang="less" scoped>
.c-topic-list-item {
  .topic-card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    border-radius: @border-radius-base * 2;
    background: #ededed no-repeat center / cover;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      display: block;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0,0,0,.3);
      transition: background-color .4s;
    }

    .name {
      position: relative;
      color: #fff;
      top: 0;
      transition: top .2s ease-in-out;
    }

    &:hover {
      &::before {
        background-color: rgba(0,0,0,.35);
      }
      .name {
        top: -4px;
      }
    }
  }
}
</style>
