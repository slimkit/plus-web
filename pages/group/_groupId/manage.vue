<script>
import { mapState } from 'vuex'
import { cutText } from '@/utils/text'
import SettingTemplate from '@/pages/setting.vue'

export default {
  name: 'GroupManage',
  head () {
    const name = cutText(this.group.name, 6)
    return {
      title: `${name} - 圈子管理`,
    }
  },
  validate ({ params }) {
    if (!params.groupId.match(/^\d+$/)) return false
    return true
  },
  extends: SettingTemplate,
  data () {
    const { groupId } = this.$route.params
    return {
      navMap: [
        { label: '圈子资料', to: `/group/${groupId}/manage/profile` },
        { label: '圈子收益', to: `/group/${groupId}/manage/income` },
        { label: '成员管理', to: `/group/${groupId}/manage/members` },
        { label: '举报管理', to: `/group/${groupId}/manage/reports` },
      ],
    }
  },
  computed: {
    ...mapState('group', {
      group: 'current',
    }),
  },
  async asyncData ({ params, store, $axios }) {
    const groupId = Number(params.groupId)
    if (store.state.group.current.id !== groupId) {
      await store.dispatch('group/getGroupDetail', groupId)
    }
  },
  fetch ({ route, redirect, params }) {
    const { groupId } = params
    if (route.name === 'group-groupId-manage') return redirect(`/group/${groupId}/manage/profile`)
  },
}
</script>
