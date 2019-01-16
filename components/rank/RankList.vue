<template>
  <div class="c-rank-list">
    <h2 class="title">
      {{ title }}
      <span class="pagination">
        <button :disabled="!page" @click="onPrev"><i class="left" /></button>
        <button :disabled="!hasNext" @click="onNext"><i class="right" /></button>
      </span>
    </h2>
    <table>
      <thead>
        <tr>
          <th class="index">排名</th>
          <th class="user-info">昵称</th>
          <th v-if="extra">{{ extra }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in currentPage" :key="page * 10 + index + 1">
          <template v-if="item">
            <td class="index"><i :class="{top3: page === 0 && index < 3}">{{ page * 10 + index + 1 }}</i></td>
            <td class="user-info">
              <Avatar :user="item.user" size="xs" />
              {{ item.user.name }}
            </td>
            <td v-if="extra">{{ item.extra }}</td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const limit = 10

export default {
  name: 'RankList',
  props: {
    title: { type: String, required: true },
    list: { type: Array, default: () => [] },
    extra: { type: String, default: '' },
  },
  data () {
    return {
      page: 0,
      maxPage: 0,
    }
  },
  computed: {
    currentPage () {
      const list = this.list.slice(this.page * limit, (this.page + 1) * limit)
      list.length = 10
      return list
    },
    hasNext () {
      return this.list.length > (this.page + 1) * limit
    },
  },
  methods: {
    onPrev () {
      this.page--
    },
    onNext () {
      this.page++
      if (this.page > this.maxPage) {
        this.maxPage++
        this.$emit('next', this.page)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.c-rank-list {
  padding: 40px;
  background-color: #fff;

  .title {
    display: flex;
    font-size: @font-size-large;
    margin-bottom: 16px;
  }

  .pagination {
    margin-left: auto;

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 24px;
      width: 24px;
      border: none;
      margin-left: 4px;
      background-color: transparent;

      i {
        display: block;
        width: 0;
        height: 0;
        border: 0 solid transparent;
        border-width: 8px 12px;

        &.left {
          border-right-color: @disabled-color;
          transform: translateX(-25%);
        }
        &.right {
          border-left-color: @disabled-color;
          transform: translateX(25%);
        }
      }

      &:disabled {
        i {
          &.left {
            border-right-color: @normal-color;
          }
          &.right {
            border-left-color: @normal-color;
          }
        }
      }
    }

  }

  table {
    width: 100%;
    min-height: 548px;
    border: 1px solid @text-info-color;
    border-width: 1px 0;

    th, td {
      &.index {
        width: 120px;
        text-align: left;

        > i {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 18px;
          height: 18px;
          border-radius: @border-radius-small;
          background-color: @text-info-color;
          color: #fff;

          &.top3 {
            background-color: @primary-color;
          }
        }
      }

      &.user-info {
        flex: auto;
        display: flex;

        .c-avatar {
          margin-right: 8px;
        }
      }
    }

    tr {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
    }

    thead {
      // height: 40px;

      > tr {
        height: 40px;
        .border(bottom);
        color: @disabled-color;
      }
    }
  }
}
</style>
