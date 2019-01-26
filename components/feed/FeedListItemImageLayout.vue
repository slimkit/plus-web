<template>
  <div class="c-feed-list-item-image-layout">
    <ul
      v-if="images.length"
      class="grid-wrap"
      :class="`with-${Math.min(images.length, 9)}`"
    >
      <li
        v-for="(image, index) in images.slice(0, 9)"
        :key="image.id"
        class="item"
        @click="onImageClick(image, index)"
      >
        <AsyncFile
          :file="image"
          type="image-wrap"
          :max-height="400"
        />

        <div v-if="isGreatThen9 && index === 8" class="cover">+{{ images.length - 9 }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FeedListItemImageLayout',
  props: {
    images: { type: Array, default: () => [] },
  },
  computed: {
    isGreatThen9 () {
      return this.images.length > 9
    },
  },
  methods: {
    onImageClick (image, index) {
      if (index === 8 && this.isGreatThen9) {
        return this.$emit('more')
      }
      this.$emit('click', image, index)
    },
  },
}
</script>

<style lang="less" scoped>
.c-feed-list-item-image-layout {
  position: relative;
  width: 100%;

  .grid-wrap {
    display: grid;
    grid-gap: 3px;
    width: 100%;

    .item {
      position: relative;
      width: 100%;
      padding-bottom: 100%;
      grid-area: span 1;

      .c-async-file {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
      }

      .cover {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .2);
        color: #fff;
        font-size: 400%;
      }

    }

    &.with-1 {
      grid-template-columns: 1fr;
    }

    &.with-2,
    &.with-4 {
      grid-template-columns: repeat(2, 1fr);
    }

    &.with-3,
    &.with-9 {
      grid-template-columns: repeat(3, 1fr);
    }

    &.with-5 {
      grid-template-columns: repeat(6, 1fr);

      .item {
        grid-area: span 1 / span 2;

        &:nth-child(1) {
          grid-area: span 2 / span 4;
        }
        &:nth-child(4),
        &:nth-child(5) {
          grid-area: span 1 / span 3;
        }
      }
    }

    &.with-6 {
      grid-template-columns: repeat(3, 1fr);

      .item {
        grid-area: span 1;

        &:nth-child(1) {
          grid-area: span 2 / span 2;
        }
      }
    }

    &.with-7 {
      grid-template-columns: repeat(4, 1fr);

      .item {
        grid-area: span 1 / span 1;

        &:nth-child(1),
        &:nth-child(4),
        &:nth-child(5) {
          grid-area: span 2 / span 2;
        }
      }
    }

    &.with-8 {
      grid-template-columns: repeat(6, 1fr);

      .item {
        grid-column: span 2;

        &:nth-child(4),
        &:nth-child(5) {
          grid-column: span 3;
        }
      }
    }
  }

}
</style>
