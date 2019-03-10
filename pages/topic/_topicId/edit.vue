<script>
import { mapState, mapActions } from 'vuex'
import TopicCreate from '@/pages/topic/create.vue'

export default {
  name: 'TopicEdit',
  extends: TopicCreate,
  validate ({ params }) {
    return /^\d+$/.test(params.topicId)
  },
  computed: {
    ...mapState('topic', {
      topic: 'current',
    }),
    topicId () {
      return +this.$route.params.topicId
    },
    modifiedForm () {
      const form = {}
      if (this.desc && this.desc !== this.topic.desc) form.desc = this.desc
      if (this.cover.value) form.logo = this.cover.value
      return Object.keys(form).length > 0 ? form : null
    },
  },
  async mounted () {
    if (!this.topic.id) await this.getTopic(this.topicId)
    this.name = this.topic.name
    this.desc = this.topic.desc
    if (this.topic.logo) this.cover.preview = this.topic.logo.url
  },
  methods: {
    ...mapActions('topic', {
      getTopic: 'getTopic',
    }),
    async onSubmit () {
      await this.$axios.$patch(`/feed/topics/${this.topicId}`, this.modifiedForm)
      this.$Message.success('修改话题成功')
      this.$router.replace(`/topic/${this.topicId}`)
    },
  },
}
</script>
