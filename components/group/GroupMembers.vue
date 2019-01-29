<template>
  <div class="c-group-members">
    <Loadmore
      ref="loader"
      @refresh="onRefresh"
      @loadmore="onLoadmore"
    >
      <section v-if="founder" class="group">
        <h3>圈主</h3>
        <ul class="member-list">
          <li :key="`founder-${founder.id}`">
            <nuxt-link class="user" :to="`/user/${founder.user_id}`">
              <Avatar :user="founder.user" />
              <span class="text-cut">{{ founder.user.name }}</span>
            </nuxt-link>
          </li>
        </ul>
      </section>
      <section v-if="administrators.length" class="group">
        <h3>管理员</h3>
        <ul class="member-list">
          <li v-for="member in administrators" :key="`admin-${member.id}`">
            <nuxt-link class="user" :to="`/user/${member.user_id}`">
              <Avatar :user="member.user" />
              <span class="text-cut">{{ member.user.name }}</span>
            </nuxt-link>
          </li>
        </ul>
      </section>
      <section v-if="normals.length" class="group">
        <h3>一般成员</h3>
        <ul class="member-list">
          <li v-for="member in normals" :key="`member-${member.id}`">
            <nuxt-link class="user" :to="`/user/${member.user_id}`">
              <Avatar :user="member.user" />
              <span class="text-cut">{{ member.user.name }}</span>
            </nuxt-link>
          </li>
        </ul>
      </section>
    </Loadmore>
  </div>
</template>

<script>
import { limit, getLastField } from '@/utils'

export default {
  name: 'GroupMembers',
  props: {
    groupId: { type: Number, required: true },
    members: { type: Object, default: () => ({}) },
  },
  data () {
    return {
      normals: [],
    }
  },
  computed: {
    founder () {
      const founders = this.members.founder || []
      return founders[0]
    },
    administrators () {
      return this.members.administrator || []
    },
  },
  mounted () {
    this.normals = this.members.member || []
  },
  methods: {
    async onRefresh () {
      const params = { limit, type: 'member' }
      const normals = await this.$axios.$get(`/plus-group/groups/${this.groupId}/members`, { params })
      this.normals = normals
      this.loader.afterRefresh(normals.length < limit)
    },
    async onLoadmore () {
      const after = getLastField(this.normals)
      const params = { limit, type: 'member', after }
      const normals = await this.$axios.$get(`/plus-group/groups/${this.groupId}/members`, { params })
      this.normals = normals
      this.loader.afterRefresh(normals.length < limit)
    },
  },
}
</script>

<style lang="less" scoped>
.c-group-members {
  .member-list {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
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
}

@media screen and (max-width: 1080px) {
  .c-group-members {
    .member-list {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
</style>
