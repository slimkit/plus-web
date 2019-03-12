<template>
  <article class="c-reference-group">
    <ISpin v-if="loading" fix />

    <template v-if="notFound">
      该资源不存在或已被删除
    </template>
    <template v-else>
      <div class="group-container">
        <figure class="group-avatar">
          <AsyncFile
            v-if="group.avatar"
            type="image-wrap"
            :file="group.avatar"
            class="image"
            :max-height="80"
            :max-width="80"
          />

          <figcaption>{{ category.name }}</figcaption>
        </figure>

        <div class="group-info">
          <h3>{{ group.name }}</h3>
          <p class="text-cut-2">{{ '' || '没什么可说的' }}</p>
        </div>
      </div>

      <nuxt-link
        v-if="!noLink"
        class="link"
        :to="`/group/${group.id}`"
      />
    </template>
  </article>
</template>

<script>
export default {
  name: 'ReferenceGroup',
  props: {
    source: { type: Object, required: true },
    noLink: { type: Boolean, default: false },
  },
  data () {
    return {
      remoteGroup: null,

      notFound: false,
      loading: false,
    }
  },
  computed: {
    group () {
      return this.remoteGroup || this.source
    },
    category () {
      return this.group.category || {}
    },
  },
  mounted () {
    if (!this.group.founder) this.fetchGroup()
  },
  methods: {
    async fetchGroup () {
      this.loading = true
      const { data: group, status } = await this.$axios.get(`/plus-group/groups/${this.group.id}`, {
        validateStatus: s => [200, 404].includes(s),
      })
      this.loading = false
      if (status === 404) {
        this.notFound = true
      } else {
        this.remoteGroup = group
      }
    },
  },
}
</script>

<style lang="less" scoped>
.c-reference-group {
  max-height: 80px;

  .group-container {
    display: flex;

    .image {
      flex: none;
      width: 80px;
      height: 80px;
      margin-right: 12px;
    }

    .group-info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    .group-avatar {
      position: relative;
      flex: none;

      figcaption {
        position: absolute;
        top: 8px;
        left: -12px;
        padding: 2px 1em;
        border-radius: 0 50px 50px 0;
        background-color: @primary-color;
        color: #fff;
        font-weight: bold;
        font-size: @font-size-small;

        &::before {
          content: '';
          position: absolute;
          top: 100%;
          left: 1px;
          display: block;
          width: 0;
          height: 0;
          border: 6px solid transparent;
          border-top-color: darken(@primary-color, 20%);
          border-right-color: darken(@primary-color, 20%);
        }
      }
    }
  }
}
</style>
