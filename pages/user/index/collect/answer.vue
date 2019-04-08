<template>
  <Loadmore
    ref="loader"
    class="p-user-collect-answer"
    @refresh="onRefresh"
    @loadmore="onLoadmore"
  >
    <AnswerList :answers="formatedAnswers" :in-collect="true" />
  </Loadmore>
</template>

<script>
import { limit, getLastField } from '@/utils'
import AnswerList from '@/components/question/AnswerList.vue'

export default {
  name: 'UserCollectAnswer',
  components: {
    AnswerList,
  },
  data () {
    return {
      answers: [],
    }
  },
  computed: {
    formatedAnswers () {
      return this.answers.map(item => item.collectible)
    },
  },
  methods: {
    async onRefresh () {
      const params = { limit }
      this.answers = await this.$axios.$get('/user/question-answer/collections', { params })
      this.loader.afterRefresh(this.answers.length < limit)
    },
    async onLoadmore () {
      const params = { limit, after: getLastField(this.answers) }
      const answers = await this.$axios.$get('/user/question-answer/collections', { params })
      this.answers.push(...answers)
      this.loader.afterLoadmore(answers.length < limit)
    },
  },
}
</script>
