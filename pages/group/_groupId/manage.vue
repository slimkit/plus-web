<script>
import SettingTemplate from '@/pages/setting.vue'

export default {
  name: 'GroupManage',
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
  fetch ({ route, redirect, params }) {
    const { groupId } = params
    if (route.name === 'group-groupId-manage') return redirect(`/group/${groupId}/manage/profile`)
  },
}
</script>
